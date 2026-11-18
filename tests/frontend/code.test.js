/** @jest-environment node */

const { JSDOM } = require("jsdom");
const {
	doLogin,
	readCookie,
	addColor,
	searchColor,
} = require("../../public/js/code.js");

let dom;

class MockXMLHttpRequest {
	static instances = [];

	constructor() {
		this.readyState = 0;
		this.status = 0;
		this.responseText = "";
		this.onreadystatechange = null;
		this.open = jest.fn();
		this.setRequestHeader = jest.fn();
		this.send = jest.fn((payload) => {
			this.payload = payload;
		});
		MockXMLHttpRequest.instances.push(this);
	}

	respond(body, status = 200) {
		this.readyState = 4;
		this.status = status;
		this.responseText = JSON.stringify(body);
		this.onreadystatechange();
	}
}

function getLastRequest() {
	return MockXMLHttpRequest.instances.at(-1);
}

beforeEach(() => {
	dom = new JSDOM(`
		<input id="loginName" />
		<input id="loginPassword" />
		<span id="loginResult"></span>
		<input id="colorText" />
		<span id="colorAddResult"></span>
		<input id="searchText" />
		<span id="colorSearchResult"></span>
		<p id="colorList"></p>
	`, { url: "https://example.test/" });

	global.document = dom.window.document;
	global.window = { location: { href: "" } };
	global.XMLHttpRequest = MockXMLHttpRequest;
	global.md5 = jest.fn((password) => `hashed-${ password }`);
	MockXMLHttpRequest.instances = [];
});

afterEach(() => {
	dom.window.close();
	delete global.document;
	delete global.window;
	delete global.XMLHttpRequest;
	delete global.md5;
});

test("doLogin sends credentials and displays an error for invalid credentials", () => {
	document.getElementById("loginName").value = "alice";
	document.getElementById("loginPassword").value = "secret";

	doLogin();

	const xhr = getLastRequest();
	expect(xhr.open).toHaveBeenCalledWith(
		"POST",
		"http://collateralconscience.store/api/login.php",
		true,
	);
	expect(xhr.setRequestHeader).toHaveBeenCalledWith(
		"Content-type",
		"application/json; charset=UTF-8",
	);
	expect(JSON.parse(xhr.payload)).toEqual({
		username: "alice",
		password: "hashed-secret",
	});

	xhr.respond({ id: 0 });

	expect(document.getElementById("loginResult").textContent).toBe(
		"User/Password combination incorrect",
	);
});

test("readCookie redirects to the login page when the user ID is missing", () => {
	readCookie();
	expect(window.location.href).toBe("index.html");
});

test("addColor displays success after a successful response", () => {
	document.getElementById("colorText").value = "blue";

	addColor();
	getLastRequest().respond({ error: "" });

	expect(document.getElementById("colorAddResult").textContent).toBe(
		"Color has been added",
	);
	expect(JSON.parse(getLastRequest().payload)).toMatchObject({ color: "blue" });
});

test("searchColor renders the returned colors", () => {
	document.cookie = "firstName=Alice, lastName=Example, userId=12";
	readCookie();
	document.getElementById("searchText").value = "bl";

	searchColor();

	const xhr = getLastRequest();
	expect(JSON.parse(xhr.payload)).toEqual({ search: "bl", userId: 12 });

	xhr.respond({ results: ["blue", "black"], error: "" });

	expect(document.getElementById("colorSearchResult").textContent).toBe(
		"Color(s) has been retrieved",
	);
	expect(document.getElementById("colorList").innerHTML).toBe(
		"blue<br>\nblack",
	);
});