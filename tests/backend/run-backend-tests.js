const { spawn } = require("node:child_process");
const process = require("node:process");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");
const host = "127.0.0.1";
const port = 8080;

process.env.API_BASE_URL = process.env.API_BASE_URL || `http://${ host }:${ port }/api`;

const testEnvPath = path.join(projectRoot, "tests", "backend", ".env.test");

if (fs.existsSync(testEnvPath)) process.loadEnvFile(testEnvPath);

if (!process.env.TEST_USERNAME || !process.env.TEST_PASSWORD) {
	console.error(
		"Set TEST_USERNAME and TEST_PASSWORD to credentials from your test database."
	);
	process.exit(1);
}

const server = spawn("php", ["-S", `${ host }:${ port }`, "-t", projectRoot], {
	cwd: projectRoot,
	env: process.env,
	stdio: "inherit"
});

let stopped = false;

function stopServer(exitCode) {
	if (stopped) return;
	stopped = true;
	server.kill("SIGTERM");
	process.exit(exitCode);
}

async function waitForServer() {
	for (let attempt = 0; attempt < 30; attempt += 1) {
		try {
			await fetch(`${ process.env.API_BASE_URL }/login.php`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: "", password: "" })
			});
			return true;
		} 
		catch {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
	}
	return false;
}

server.on("error", (error) => {
	console.error(error);
	stopServer(1);
});

waitForServer().then((ready) => {
	if (!ready) {
		console.error("PHP test server did not start.");
		stopServer(1);
		return;
	}

	const jest = spawn(
		process.execPath,
		[
			"node_modules/jest/bin/jest.js",
			"--runInBand",
			"tests/backend"
		],
		{
			cwd: projectRoot,
			env: process.env,
			stdio: "inherit"
		}
	);

	jest.on("error", (error) => {
		console.error(error);
		stopServer(1);
	});

	jest.on("exit", (code) => {
		stopServer(code ?? 1);
	});
});