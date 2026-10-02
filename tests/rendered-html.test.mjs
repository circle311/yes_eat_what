import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  assert.equal(typeof worker.fetch, "function");

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the meal planner with its core controls", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>今日吃什么｜智能配餐 Agent<\/title>/i);
  assert.match(html, /href="\/favicon\.svg"/);
  for (const label of ["用餐人数", "丰盛程度", "食材偏好", "本地规则", "大模型", "请 Agent 帮我配一餐"]) {
    assert.ok(html.includes(label), `Missing meal planner control: ${label}`);
  }
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("packages the favicon and the same Sites project configuration", async () => {
  const [sourceIcon, builtIcon, sourceHosting, builtHosting] = await Promise.all([
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/favicon.svg", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(builtIcon, /<svg\b/);
  assert.equal(builtIcon, sourceIcon);
  assert.deepEqual(JSON.parse(builtHosting), JSON.parse(sourceHosting));
});
