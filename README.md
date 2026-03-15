# RePrompt Cloud — SaaS Infrastructure Layer

This repository contains the backend API and management infrastructure for the RePrompt 10x ecosystem. It provides the high-performance inference gateway, authentication systems, and distributed prompt memory.

---

## 🚀 Core API Ecosystem

### 🧠 High-Performance Optimization Gateway
- **`/api/optimize`**: The core LLM proxy. Injects master business frameworks (COSTAR, AUTOMAT) into user intents and returns structured prompts.
- **`/api/clarify`**: Intelligent ambiguity detection. Generates hybrid (MCQ + Text) questions to resolve vague user prompts.

### 👤 Profile & Context Synchronization
- **`/api/profile`**: Manages the "Global Profile" (Role, Tone, Background) which the desktop app uses to tailor every single optimization.
- **Distributed Memory**: Stores high-entropy optimization success patterns to improve AI response quality over time.

### 💳 Infrastructure & Billing
- **Vercel Postgres**: Scalable database for usage tracking, credit management, and user authentication.
- **Groq Integration**: Leverages Groq's low-latency inference for real-time prompt engineering.

---

## 🛠️ Technical Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Vercel Postgres / Neon
- **Hosting**: Vercel (Edge Functions enabled)

---

<div align="center">
  Building the future of Cognitive Acceleration.
</div>
