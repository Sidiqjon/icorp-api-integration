// Run: node interview.js <public_url> [port] [message]

const http = require('http')
const { URL } = require('url')
const fs = require('fs')

const PUBLIC_URL = process.argv[2]
const PORT = Number(process.argv[3] || 3000)
const MESSAGE = process.argv[4] || "Hello from Applicant"
const TEST_URL = "https://test.icorp.uz/interview.php"

if (!PUBLIC_URL) {
  console.log("Usage: node interview.js <public_url> [port] [message]")
  process.exit(1)
}

let part1 = null
let part2 = null
let server = null

async function sendInitial() {
  console.log("Sending first request...")
  const body = JSON.stringify({ msg: MESSAGE, url: PUBLIC_URL })
  
  try {
    const res = await fetch(TEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    })
    const text = await res.text()
    console.log("Received first part:", text)
    
    try {
      const json = JSON.parse(text)
      part1 = json.part1
    } catch {
      part1 = text
    }
    tryFinish()
  } catch (error) {
    console.error("Error sending initial request:", error.message)
    server.close()
    process.exit(1)
  }
}

async function finishRequest() {
  const code = part1 + part2
  const u = new URL(TEST_URL)
  u.searchParams.set("code", code)
  
  try {
    const res = await fetch(u.toString())
    const text = await res.text()

    console.log("\n=== RESULT ===")
    console.log("Combined key:", code)
    console.log("Final message:", text)
    console.log("==============\n")

    fs.writeFileSync("result.txt", `combined=${code}\n\nresponse:\n${text}`)
    console.log("Saved result.txt")
  } catch (error) {
    console.error("Error in final request:", error.message)
    server.close()
    process.exit(1)
  }
  
  setTimeout(() => {
    server.close()
    process.exit(0)
  }, 1000)
}

function tryFinish() {
  if (part1 && part2) finishRequest()
}

function startServer() {
  server = http.createServer((req, res) => {
    let data = ""

    req.on("data", chunk => data += chunk)
    req.on("end", () => {
      try {
        const json = JSON.parse(data)
        part2 = json.part2
      } catch {
        part2 = data
      }

      console.log("Received second part:", part2)

      res.writeHead(200)
      res.end("OK")

      tryFinish()
    })
  })

  server.listen(PORT, () => {
    console.log("Server running at port", PORT)
    console.log("Public callback:", PUBLIC_URL)
  })
}

(async () => {
  startServer()
  await new Promise(r => setTimeout(r, 500))
  await sendInitial()
})()