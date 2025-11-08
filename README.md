# iCorp Interview Task

A Node.js application demonstrating HTTP communication and callback handling skills through interaction with the iCorp test API.

## 📋 Overview

This project implements a two-step API integration challenge:

1. **Initial Request**: Send a POST request with a message and callback URL
2. **Callback Reception**: Receive the second part of a code via webhook
3. **Code Assembly**: Concatenate both code parts
4. **Verification**: Retrieve the original message using the complete code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for native `fetch` support)
- A public tunneling service (e.g., [ngrok](https://ngrok.com/))

### Setup

1. **Start your public tunnel**:
   ```bash
   ngrok http 3000
   ```
   Copy the generated public URL (e.g., `https://abcd.ngrok.io`)

2. **Run the script**:
   ```bash
   node interview.js <public_url> [port] [message]
   ```

### Command Line Arguments

| Argument | Required | Default | Description |
|----------|----------|---------|-------------|
| `public_url` | ✅ Yes | - | Your public callback URL from ngrok or similar |
| `port` | ❌ No | `3000` | Local server port |
| `message` | ❌ No | `"Hello from Applicant"` | Custom message to send |

### Example Usage

```bash
node interview.js https://abcd.ngrok.io 3000 "Hello from Applicant"
```

## 🔄 How It Works

```
┌─────────────┐         POST request          ┌──────────────┐
│             │────────────────────────────────>│              │
│   Client    │      {msg, callback_url}       │  iCorp API   │
│             │<────────────────────────────────│              │
└─────────────┘      Response: code_part1      └──────────────┘
       │                                               │
       │                                               │
       │                                               ▼
       │                                        Sends code_part2
       │                                          to callback
       │                                               │
       │<──────────────────────────────────────────────┘
       │
       ├─── Concatenate: code_part1 + code_part2
       │
       ▼
┌─────────────┐         GET request            ┌──────────────┐
│             │────────────────────────────────>│              │
│   Client    │       ?code=combined           │  iCorp API   │
│             │<────────────────────────────────│              │
└─────────────┘    Response: original_msg      └──────────────┘
```

## 📁 Project Structure

```
.
├── interview.js    # Main application script
├── result.txt      # Generated output file
└── README.md       # This file
```

## 📤 Output

Upon successful execution, `result.txt` will contain:

```
combined=<concatenated_code>

response:
<original_message>
```

## 🛠️ Technical Details

- **Self-contained**: Single file implementation for easy deployment
- **Modern JavaScript**: Uses native `fetch` API (Node.js 18+)
- **Express Server**: Handles webhook callbacks
- **Comprehensive Logging**: Detailed console output for debugging

## 🔍 API Endpoints

### POST Request
- **URL**: `https://test.icorp.uz/interview.php`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "msg": "Your message here",
    "url": "https://your-public-url.com"
  }
  ```

### GET Request
- **URL**: `https://test.icorp.uz/interview.php?code=<combined_code>`
- **Method**: `GET`

## 📝 Notes

- Ensure your tunneling service is running before starting the script
- The callback URL must be publicly accessible
- The script will automatically handle server setup and teardown
- All HTTP interactions are logged to the console for transparency

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Verify ngrok is running and URL is correct |
| Port already in use | Choose a different port number |
| Node version error | Upgrade to Node.js 18 or higher |
| Timeout waiting for callback | Check firewall settings and ngrok configuration |

## 📄 License

This project is created as part of the iCorp interview process.

---

**Built with** Node.js