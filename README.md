# 🧠 Overleaf AI Assistant

A Chrome extension that allows you to generate LaTeX code on Overleaf using AI prompts via OpenAI's GPT API.  
This extension communicates with a local Node.js backend that securely uses **your own OpenAI API key** — nothing is exposed.

---

## 🚀 Features

- 📝 Write LaTeX with simple prompts like:  
  _"Make a 3-column table about pros and cons"_
- 🔐 Secure — uses your own OpenAI key, nothing is sent to third parties
- 💻 Seamless Overleaf integration
- 🧠 Powered by GPT-3.5 (or GPT-4 if you have access)
- 💬 Auto-inserts generated LaTeX directly into the Overleaf editor

---

## 📦 How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/AhmadAllabadi1/overleaf-ai-extension.git
cd overleaf-ai-extension
```

---

### 2. Set Up Your OpenAI API Key

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your OpenAI key:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

The backend will now run at:  
👉 `http://localhost:8000/generate`

---

### 3. Load the Chrome Extension

1. Open Chrome and go to:  
   👉 `chrome://extensions/`

2. Enable **Developer Mode** (top right)

3. Click **"Load unpacked"**

4. Select the `extension/` folder inside this repo

✅ You should now see the Overleaf AI Assistant icon in your Chrome toolbar

---

### 4. Use It on Overleaf

1. Go to https://www.overleaf.com  
2. Open any project  
3. Click the extension icon or on-screen button  
4. Enter a prompt like:

   ```
   Create a LaTeX equation for the quadratic formula
   ```

5. The generated LaTeX code will be inserted directly into your Overleaf editor ✨

---

## 🛡️ Privacy & Safety

- Your API key is stored only on your machine
- You control your own usage and billing
- The backend runs locally — no third-party backend involved
- No usage data is collected — 100% local and private

---

## 🧪 Troubleshooting

| Issue                        | Solution                                                                 |
|-----------------------------|---------------------------------------------------------------------------|
| 🔥 Extension not working     | Make sure the backend is running on \`http://localhost:8000\`              |
| 🚫 Missing API key error     | Ensure \`.env\` exists and contains \`OPENAI_API_KEY=...\`                    |
| ❌ CORS or fetch error       | Confirm the extension is allowed to access \`localhost\`                   |
| 🤖 OpenAI not responding     | Double-check your key and usage at https://platform.openai.com/account/usage |

---

## 💡 Ideas for Contribution

Want to help improve it? Pull requests are welcome!

- Add a visual popup UI for prompt input
- Let users select model (\`gpt-3.5\`, \`gpt-4\`)
- Create reusable LaTeX templates (e.g., tables, math, TikZ)
- Add support for remote (hosted) backends
- UI for storing API key in browser storage (instead of \`.env\`)

---

## 📜 License

MIT License — free to use, remix, and build on  
Let’s make LaTeX more accessible for everyone 💙


