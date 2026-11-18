/** @jest-environment node */

const crypto = require("node:crypto");
const baseUrl = process.env.API_BASE_URL || "http://127.0.0.1:8080/api";
const testUsername = process.env.TEST_USERNAME;
const testPassword = process.env.TEST_PASSWORD;
const passwordHash = crypto
	.createHash("md5")
	.update(testPassword || "")
	.digest("hex");

async function postJson(path, body) {
	const response = await fetch(`${ baseUrl }/${ path }`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});

	let json;
	try { json = await response.json(); }
	catch { throw new Error(`${ path } returned non-JSON content`); }
	return { response, json };
}

async function login(username = testUsername, password = passwordHash) {
	return postJson("login.php", { username, password });
}

test("login returns the complete success JSON structure", async () => {
	const { response, json } = await login();
	expect(response.status).toBe(200);
	expect(response.headers.get("content-type")).toContain("application/json");
	expect(json).toEqual({
		id: expect.any(Number),
		firstName: expect.any(String),
		lastName: expect.any(String),
		error: ""
	});
	expect(json.id).toBeGreaterThan(0);
});

test("login returns the complete failure JSON structure for an incorrect password", async () => {
	const incorrectPasswordHash = crypto
		.createHash("md5")
		.update(`${ testPassword }-incorrect`)
		.digest("hex");
	const { response, json } = await login(testUsername, incorrectPasswordHash);
	expect(response.status).toBe(200);
	expect(json).toEqual({
		id: 0,
		firstName: "",
		lastName: "",
		error: "No Records Found"
	});
});

test("addColor returns a valid JSON response", async () => {
	const { json: loginJson } = await login();
	const color = `jest-${ crypto.randomUUID() }`;
	const { response: response, json: json } = await postJson("addColor.php", {
		userId: loginJson.id,
		color: color
	});

	expect(response.status).toBe(200);
	expect(json).toEqual({ error: "" });

	const { json: searchJson } = await postJson("searchColors.php", {
		search: color,
		userId: loginJson.id
	});

	expect(searchJson).toEqual({
		results: [color],
		error: ""
	});
});

test("searchColors returns the complete JSON structure", async () => {
	const { json: loginJson } = await login();
	const search = `jest-no-match-${ crypto.randomUUID() }`;
	const { response, json } = await postJson("searchColors.php", {
		search: search,
		userId: loginJson.id
	});

	expect(response.status).toBe(200);
	expect(json).toEqual({
		id: 0,
		first_name: "",
		last_name: "",
		error: "No Records Found"
	});
});