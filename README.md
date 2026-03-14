# RePrompt Cloud — The Infrastructure Layer

The high-performance Next.js backend powering the RePrompt 10x ecosystem. Managing authentication, distributed prompt memory, and the enterprise-grade AI optimization pipeline.

---

## 🚀 Core API Services

### 🔒 Secure Auth & Profile Sync
- Seamless authentication via high-entropy JWT tokens.
- Global user profile management (Role, Tone, Background) shared across the 10x Desktop suite.

### 🧠 Advanced Optimization Pipeline
- **`/api/optimize`**: The core LLM proxy. Injects enterprise frameworks (COSTAR, ReAct) and returns high-performance prompts with detailed explanations.
- **`/api/clarify`**: Vagueness detection and hybrid (MCQ + Text) question generation.
- **`/api/evaluate`**: Bidirectional evaluator for refining AI responses.

### 📊 Scalable Persistence
- Powered by **Vercel Postgres** with high-concurrency usage logging and credit management.

---

## 🛠️ Technical Implementation

- **Framework**: Next.js 14+ (App Router)
- **Inference**: Groq Llama 3 (70B & 8B variants)
- **Database**: Vercel Postgres / Neon
- **Hosting**: Edge-optimized on Vercel

---

## 🏗️ Documentation

For detailed API consumption, refer to the [Internal Wiki](https://reprompt-one.vercel.app/docs) or the desktop app's `apiClient.ts` implementation.

---

<div align="center">
  Powered by the RePrompt 10x Engine
</div>
