
const AI_API_UPSTREAM = "https://nova.notrexed.workers.dev";
const MUSIC_PROXY_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function apiCorsHeaders(methods) {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": methods,
    "access-control-allow-headers": "Content-Type, Range",
    "access-control-expose-headers": "Content-Length, Content-Range, Accept-Ranges, Content-Type",
  };
}

// The nova worker (AI_API_UPSTREAM) is a GET-only URL relay: it requires a
// `url` query param and cannot carry POST bodies, so forwarding the chat
// payload to it always fails with 400 "url param required". Instead this
// gateway translates the OpenAI-style POST { messages } body into a
// keyless Pollinations GET request and wraps the plain-text answer back
// into OpenAI shape ({ choices[0].message.content }) so the frontend
// parser works unchanged.
const AI_CHAT_BACKEND = "https://text.pollinations.ai";
const AI_CHAT_MODEL = "openai";

function aiTextOf(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((b) => b && (b.type === "text" || typeof b.text === "string"))
      .map((b) => (typeof b.text === "string" ? b.text : ""))
      .join(" ");
  }
  return "";
}

function aiClip(n, s) {
  const text = String(s || "");
  return text.length > n ? text.slice(0, n) : text;
}

async function proxyAi(request) {
  const cors = apiCorsHeaders("POST, OPTIONS");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { ...cors, "content-type": "text/plain; charset=utf-8" } });
  const fail = (message, status = 502) =>
    new Response(JSON.stringify({ error: { message } }), {
      status,
      headers: { ...cors, "content-type": "application/json; charset=utf-8" },
    });
  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return fail("Request body must be JSON with a messages array", 400);
  }
  const messages = Array.isArray(payload?.messages) ? payload.messages : null;
  if (!messages || !messages.length) return fail("Request body must be JSON with a messages array", 400);
  const system = aiClip(
    600,
    messages.filter((m) => m?.role === "system").map((m) => aiTextOf(m.content)).join(" ")
  );
  const convo = aiClip(
    1800,
    messages
      .filter((m) => m && m.role !== "system" && aiTextOf(m.content).trim())
      .slice(-8)
      .map((m) => (m.role === "assistant" ? "Assistant: " : "User: ") + aiTextOf(m.content).trim())
      .join("\n")
  );
  if (!convo.trim()) return fail("No user message found", 400);
  const target =
    AI_CHAT_BACKEND + "/" + encodeURIComponent(convo) +
    "?model=" + encodeURIComponent(AI_CHAT_MODEL) +
    (system.trim() ? "&system=" + encodeURIComponent(system) : "");
  try {
    const upstream = await fetch(target, { headers: { accept: "text/plain" } });
    const text = (await upstream.text()).trim();
    if (!upstream.ok || !text) return fail("AI backend error (HTTP " + upstream.status + ")", 502);
    return new Response(
      JSON.stringify({ choices: [{ message: { role: "assistant", content: text } }] }),
      { status: 200, headers: { ...cors, "content-type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    return fail("AI upstream error: " + (error?.message || error));
  }
}

async function proxyMusic(request) {
  const cors = apiCorsHeaders("GET, HEAD, OPTIONS");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (!MUSIC_PROXY_METHODS.has(request.method)) return new Response("Method not allowed", { status: 405, headers: { ...cors, "content-type": "text/plain; charset=utf-8" } });
  let target;
  try { target = new URL(new URL(request.url).searchParams.get("url") || ""); }
  catch (_) { return new Response("Missing or invalid url parameter", { status: 400, headers: cors }); }
  if (target.protocol !== "http:" && target.protocol !== "https:") return new Response("Only HTTP(S) URLs are supported", { status: 400, headers: cors });
  try {
    const headers = new Headers();
    for (const name of ["accept", "range", "content-type"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await fetch(target, { method: request.method, headers });
    const output = new Headers(cors);
    for (const name of ["content-type", "content-length", "content-range", "accept-ranges"]) {
      const value = upstream.headers.get(name);
      if (value) output.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: output });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || String(error) }), {
      status: 502,
      headers: { ...cors, "content-type": "application/json; charset=utf-8" },
    });
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname.replace(/\/+$/, "");

  if (/.html$/i.test(path)) {
    // jsDelivr serves repository .html as text/plain with nosniff, which would
    // render as raw text in frames. Re-serve it as a real HTML document so
    // relative URLs, same-origin access, and nested document loads keep a
    // normal document URL.
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const headers = new Headers(response.headers);
        headers.set("content-type", "text/html; charset=utf-8");
        headers.delete("x-content-type-options");
        return new Response(await response.arrayBuffer(), {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (error) {
        return new Response(
          "Failed to load " + url.href + ": " + (error?.message || error),
          { status: 502, headers: { "content-type": "text/html; charset=utf-8" } }
        );
      }
    })());
    return;
  }

  if (path.endsWith("/api/ai")) {
    event.respondWith(proxyAi(event.request));
    return;
  }
  if (path.endsWith("/api/music")) {
    event.respondWith(proxyMusic(event.request));
  }
});
