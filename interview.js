// Run: node interview.js <public_url> [port] [message]

const http = require('http');
const { URL } = require('url');
const fs = require('fs');

const PUBLIC_URL = process.argv[2];
const PORT = Number(process.argv[3] || 3000);
const MESSAGE = process.argv[4] || "Hello from Applicant";
const TEST_URL = "https://test.icorp.uz/interview.php";

if (!PUBLIC_URL) {
  console.log("Usage: node interview.js <public_url> [port] [message]");
  process.exit(1);
}

let part1 = null;
let part2 = null;
let server = null;

function log(...a) { console.log(new Date().toISOString(), ...a) }

async function sendInitial() {
  log("Sending first request...");
  const body = JSON.stringify({ msg: MESSAGE, url: PUBLIC_URL });

  const res = await fetch(TEST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });

  const text = await res.text();
  log("Received first part:", text);

  try {
    const json = JSON.parse(text);
    part1 = json.part1 || json.part || Object.values(json)[0];
  } catch {
    part1 = text;
  }

  tryFinish();
}

async function finishRequest() {
  const code = part1 + part2;
  log("Final code:", code);

  const u = new URL(TEST_URL);
  u.searchParams.set("code", code);

  const res = await fetch(u.toString());
  const text = await res.text();

  log("Final response:", text);

  fs.writeFileSync("result.txt", `combined=${code}\n\nresponse:\n${text}`);
  log("Saved result.txt");

  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 1000);
}

function tryFinish() {
  if (part1 && part2) finishRequest();
}

function startServer() {
  server = http.createServer((req, res) => {
    let data = "";

    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      try {
        const json = JSON.parse(data);
        part2 = json.part2 || json.part || Object.values(json)[0];
      } catch {
        part2 = data;
      }

      log("Received second part:", part2);

      res.writeHead(200);
      res.end("OK");

      tryFinish();
    });
  });

  server.listen(PORT, () => {
    log("Server running at port", PORT);
    log("Public callback:", PUBLIC_URL);
  });
}

(async () => {
  startServer();
  await new Promise(r => setTimeout(r, 500));
  await sendInitial();
})();
