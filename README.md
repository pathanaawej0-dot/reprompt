# RePrompt Landing Page

<div align="center">

**Extreme Minimalist Industrial Design**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://reprompt-one.vercel.app)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF.svg)](https://vitejs.dev/)

[Live Site](https://reprompt-one.vercel.app) • [App Repo](https://github.com/786aawej-cmd/RePrompt-open-source-)

</div>

---

## 🎨 Design Philosophy

This landing page embodies **"Obsessive Precision"** - a Steve Jobs-style narrative focused on extreme minimalism and industrial aesthetics.

### Design Principles

- **No Gradients**: Pure matte surfaces only
- **High Contrast**: Dark backgrounds with RePrompt Green (`#8cfc42`) accents
- **Typography-First**: Bold, large-scale text for impact
- **Storytelling**: Jobs-style narrative structure
- **Direct Download**: One-click installer download (VS Code style)

## 🏗️ Tech Stack

- **Framework**: Vite + React 19
- **Language**: TypeScript
- **Styling**: Vanilla CSS (no frameworks)
- **Analytics**: Vercel Analytics + Speed Insights
- **Deployment**: Vercel (auto-deploy from GitHub)

## 📐 Project Structure

```
website/
├── public/
│   ├── reprompt.svg              # Logo/favicon
│   └── RePrompt-Setup-1.0.0.exe  # Installer (73.72 MB)
├── src/
│   ├── App.tsx                   # Main landing page
│   ├── components/
│   │   └── Components.tsx        # Reusable components
│   ├── index.css                 # Design system
│   └── main.tsx                  # Entry point
├── index.html                    # HTML template
└── package.json                  # Dependencies
```

## 🎯 Page Sections

### 1. Hero Section
- **Tagline**: "Professional Prompts. One Shortcut."
- **CTA**: Direct download button
- **Version Info**: Current stable build

### 2. Storytelling Sections

#### S01: The Burden
*"Engineering, Automated."*
- Problem statement: Time wasted explaining to machines
- Solution: Instant transformation with shortcuts

#### S02: The Ghost
*"Invisible. Instant. Intelligent."*
- Zero-interface philosophy
- Background operation
- System tray integration

#### S03: The Synergy
*"Provider Agnostic. Infinitely Extensible."*
- Works with any AI provider
- Customizable agents
- Open architecture

### 3. Technical Features Grid
- **Zero Interface**: No windows, no interruptions
- **Provider Agnostic**: Groq, OpenAI, Claude, etc.
- **Ultra-Low Latency**: <2s optimizations

### 4. Builder Story
- 16-year-old creator
- Portfolio link
- Social links (X, GitHub)

## 🎨 Design System

### Colors
```css
--bg-primary: #000000;      /* Pure black */
--bg-secondary: #0a0a0a;    /* Near black */
--text-primary: #ffffff;    /* Pure white */
--text-muted: #888888;      /* Gray */
--primary: #8cfc42;         /* RePrompt Green */
--border: #1a1a1a;          /* Dark border */
```

### Typography
```css
--font-mono: 'Courier New', monospace;
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Spacing
```css
--spacing-unit: 1rem;       /* Base unit */
--container-max: 1200px;    /* Max content width */
```

## 📊 Analytics

Integrated with Vercel Analytics and Speed Insights:

- **Visitor Tracking**: Unique visitors, countries, referrals
- **Download Tracking**: Custom event `Download_Windows_Setup`
- **Performance**: Real-world load times

## 🚀 Development

### Setup

```bash
# Clone the repository
git clone https://github.com/pathanaawej0-dot/reprompt.git
cd reprompt

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts

- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Deployment

### Vercel Auto-Deploy

1. Push to `main` branch on GitHub
2. Vercel automatically detects changes
3. Builds and deploys to production
4. Live at: `https://reprompt-one.vercel.app`

### Manual Deploy

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎯 SEO & Performance

### Optimizations
- **Title**: "RePrompt | Professional Prompt Engineer"
- **Favicon**: Custom RePrompt logo
- **Meta Tags**: Proper description and OG tags
- **Performance**: Lighthouse score 95+

### Analytics Events
```typescript
track('Download_Windows_Setup') // Fired on installer download
```

## 🎨 Component Library

### StorySection
Large-scale narrative sections with optional mono tags.

```tsx
<StorySection 
  mono="S01_THE_BURDEN"
  title="Engineering, Automated."
  subtitle="You spend 30% of your day..."
/>
```

### TechCard
Technical feature cards with industrial borders.

```tsx
<TechCard 
  tag="CORE_01"
  title="Zero Interface"
  description="No windows. No interruptions..."
/>
```

## 📝 Content Strategy

### Storytelling Arc
1. **Problem** (The Burden): Time wasted on prompts
2. **Solution** (The Ghost): Invisible automation
3. **Vision** (The Synergy): Extensible platform

### Tone
- **Confident**: "Professional Prompts. One Shortcut."
- **Technical**: Precise, engineering-focused language
- **Minimal**: No fluff, direct communication

## 🔗 Links

- **Live Site**: [reprompt-one.vercel.app](https://reprompt-one.vercel.app)
- **App Repo**: [github.com/786aawej-cmd/RePrompt-open-source-](https://github.com/786aawej-cmd/RePrompt-open-source-)
- **Builder Portfolio**: [aawejpathan.vercel.app](https://aawejpathan.vercel.app)

## 👨‍💻 Author

**Aawej Pathan** - 16-year-old builder

- Portfolio: [aawejpathan.vercel.app](https://aawejpathan.vercel.app)
- Twitter: [@AawejPathan786](https://x.com/AawejPathan786)
- GitHub: [@pathanaawej0-dot](https://github.com/pathanaawej0-dot)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with obsessive precision**

[⭐ Star this repo](https://github.com/pathanaawej0-dot/reprompt) if you appreciate the design!

</div>
