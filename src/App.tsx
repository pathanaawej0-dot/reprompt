import { StorySection, TechCard } from './components/Components'

function App() {
  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="full-viewport" style={{ borderBottom: '2px solid var(--primary)' }}>
        <div className="container">
          <span className="text-mono" style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>[ REPROMPT_v1.0 ]</span>
          <h1 className="text-hero" style={{ marginTop: '1rem' }}>
            Professional<br />
            <span style={{ color: 'var(--primary)' }}>Prompt Engineer.</span>
          </h1>
          <h1 className="text-hero" style={{ opacity: 0.2 }}>
            At One Click.
          </h1>

          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/RePrompt-Setup-1.0.0.exe" download className="border-box" style={{ backgroundColor: 'var(--primary)', color: 'black', fontWeight: 'bold', padding: '1.5rem 3rem' }}>
              DOWNLOAD FOR WINDOWS
            </a>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-mono">v1.0.0 | Stable Build</span>
              <a href="https://github.com/786aawej-cmd/RePrompt-open-source-.git" target="_blank" className="text-mono" style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem', textDecoration: 'underline' }}>
                VIEW APP SOURCE (GITHUB)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STORY SECTION 1 */}
      <StorySection
        mono="S01_THE_MISSION"
        title="Built by a 16-Year-Old. Built for People."
        subtitle="I'm a 16-year-old builder who believes tools should be powerful, silent, and free. RePrompt is an open-source project created to bridge the gap between messy thoughts and architectural-grade prompts with just a single shortcut. No noise, just master-level engineering."
      />

      {/* STORY SECTION 2 */}
      <StorySection
        align="right"
        mono="S02_THE_GHOST"
        title="Invisibility is a Feature."
        subtitle="You spend 30% of your day explaining yourself to machines. RePrompt lives in your system tray, watches your intent, and stays out of your way until the exact millisecond you need it. No interface to manage, just pure result."
      />

      {/* STORY SECTION 3 */}
      <StorySection
        mono="S03_TRANSPARENCY"
        title="Radically Open Source."
        subtitle="Trust is built through transparency. The entire engine—from the keyboard simulator to the AI integration—is open to the world. We don't just optimize your prompts; we're optimizing how you work with AI."
      />

      {/* TECH SPECS GRID */}
      <section className="full-viewport" style={{ backgroundColor: '#050505' }}>
        <div className="container">
          <h2 className="text-section-title" style={{ marginBottom: '4rem' }}>Technical Prowess</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <TechCard
              tag="INTEGRATION_01"
              title="One-Click Mastery"
              description="Instantly transform highlighted text into optimized prompts using Ctrl+P+W. It's like having a senior prompt engineer living in your keyboard."
            />
            <TechCard
              tag="LOGIC_02"
              title="Provider Agnostic"
              description="Powered by Groq and OpenAI. Built to switch between high-performance local-first models and industry-leading AI in seconds."
            />
            <TechCard
              tag="EFFICIENCY_03"
              title="Industrial Light"
              description="A lightweight automation engine that consumes less than 50MB of RAM. Built with obsessive attention to performance and silence."
            />
          </div>
        </div>
      </section>

      {/* SOCIAL & CONNECT SECTION */}
      <section style={{ padding: '10vh 0', borderTop: '1px solid var(--outline)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="text-section-title" style={{ fontSize: '2rem', marginBottom: '3rem' }}>Connect with the Builder</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="https://aawejpathan.vercel.app" target="_blank" className="border-box" style={{ minWidth: '200px', textAlign: 'center', borderColor: 'var(--primary)' }}>
              <span className="text-mono" style={{ color: 'var(--primary)' }}>MY PORTFOLIO</span>
            </a>
            <a href="https://x.com/AawejPathan786" target="_blank" className="border-box" style={{ minWidth: '200px', textAlign: 'center' }}>
              <span className="text-mono">FOLLOW ON X</span>
            </a>
            <a href="https://github.com/pathanaawej0-dot/reprompt.git" target="_blank" className="border-box" style={{ minWidth: '200px', textAlign: 'center' }}>
              <span className="text-mono">WEBSITE SOURCE</span>
            </a>
            <a href="https://github.com/786aawej-cmd/RePrompt-open-source-.git" target="_blank" className="border-box" style={{ minWidth: '200px', textAlign: 'center' }}>
              <span className="text-mono">APP SOURCE</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#000', opacity: 0.5 }}>
        <span className="text-mono" style={{ fontSize: '0.7rem' }}>© 2026 REPROMPT | BUILT BY AAWEJ PATHAN | 16YRS OLD & BUILDING | <a href="https://aawejpathan.vercel.app" target="_blank" style={{ color: 'inherit' }}>VIEW PORTFOLIO</a></span>
      </footer>
    </div>
  )
}

export default App
