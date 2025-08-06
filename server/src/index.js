export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const path = url.pathname;
		const KV_KEY = "lifelogs";
		const SECRET_KEY = "SECRET_KEY"; //TODO:
		if (path === "/get" && request.method === "GET") {
			return await handleGet(env, KV_KEY);
		};
		if (path === "/post" && request.method === "POST") {
			return await handlePost(request, env, KV_KEY, SECRET_KEY);
		};
		if (path === "/edit" && request.method === "POST") {
			return await handleEdit(request, env, KV_KEY, SECRET_KEY);
		};
		return new Response("Not Found", { status: 404 });
	},
};

async function handleGet(env, key) {
	try {
		const data = await env.LIFELOG_KV.get(key, { type: "json" }) || [];
		return new Response(JSON.stringify(data, null, 2), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("GET Error:", error);
		return new Response("Internal Server Error", { status: 500 });
	};
};

async function handlePost(request, env, key, secret) {
	const authKey = request.headers.get("X-Auth-Key");
	if (authKey !== secret) {
		return new Response("Forbidden", { status: 403 });
	};
	try {
		const newLogEntry = await request.json();
		let logs = await env.LIFELOG_KV.get(key, { type: "json" }) || [];
		logs.unshift(newLogEntry);
		if (logs.length > 50) {
			logs = logs.slice(0, 50);
		};
		await env.LIFELOG_KV.put(key, JSON.stringify(logs));
		return new Response(JSON.stringify({ success: true, newLog: newLogEntry }), {
			status: 201,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("POST Error:", error);
		if (error instanceof SyntaxError) {
			return new Response("Bad Request: Invalid JSON", { status: 400 });
		};
		return new Response("Internal Server Error", { status: 500 });
	};
};

async function handleEdit(request, env, key, secret) {
	const authKey = request.headers.get("X-Auth-Key");
	if (authKey !== secret) {
		return new Response("Forbidden", { status: 403 });
	};
	try {
		const newData = await request.json();
		await env.LIFELOG_KV.put(key, JSON.stringify(newData));
		return new Response(JSON.stringify({ success: true, newData: newData }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Edit Error:", error);
		if (error instanceof SyntaxError) {
			return new Response("Bad Request: Invalid JSON", { status: 400 });
		};
		return new Response("Internal Server Error", { status: 500 });
	};
};
