# RePrompt Cloud - SaaS Backend & Management

This is the official SaaS backend for [RePrompt](https://github.com/pathanaawej0-dot/Startup-reprompt-desktop-app-windows-). It handles user authentication, credit management, global profiles, and the advanced AI optimization pipeline.

## 🚀 Key Responsibilities

- **🔐 Authentication**: Secure JWT-based auth via Clerk/Custom Auth.
- **💳 Credit System**: Manages user usage and API credit limits via Vercel Postgres.
- **🧠 AI Pipeline**: Proxies and enhances requests to Groq models with COSTAR/AUTOMAT frameworks.
- **🔄 Sync Service**: Keeps user agents and global profiles synchronized across devices.
- **📈 Analytics**: Logs usage patterns for continuous prompt engineering refinement.

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Vercel Postgres (SQL)
- **Styling**: Tailwind CSS
- **AI**: Groq SDK + Llama 3 models

## 📖 API Documentation

### POST `/api/optimize`
Optimizes raw text using a specific agent's persona.
- Returns: `{ optimizedText, explanation }`

### POST `/api/clarify`
Generates MCQ/Text hybrid questions for vague prompts.
- Returns: `{ questions: [...] }`

### POST `/api/evaluate`
Evaluates AI responses and generates follow-up prompts.
- Returns: `{ followUpPrompt }`

## 🏗️ Development

```bash
npm install
npm run dev
```

---

**Built with ❤️ for the RePrompt ecosystem.**
