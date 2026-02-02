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
            <span style={{ color: 'var(--primary)' }}>Prompts.</span>
          </h1>
          <h1 className="text-hero" style={{ opacity: 0.2 }}>
            One Shortcut.
          </h1>

          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/RePrompt-Setup-1.0.0.exe" download className="border-box" style={{ backgroundColor: 'var(--primary)', color: 'black', fontWeight: 'bold', padding: '1.5rem 3rem' }}>
              DOWNLOAD FOR WINDOWS
            </a>
            <span className="text-mono">v1.0.0 | Stable Build</span>
          </div>
        </div>
      </section>

      {/* STORY SECTION 1 */}
      <StorySection
        mono="S01_THE_BURDEN"
        title="Engineering, Automated."
        subtitle="You spend 30% of your day explaining yourself to machines. We stopped that. RePrompt transforms raw thoughts into structured, professional prompts the moment you hit the shortcut."
      />

      {/* STORY SECTION 2 */}
      <StorySection
        align="right"
        mono="S02_THE_GHOST"
        title="Always There. Never in the Way."
        subtitle="Invisibility is our greatest feature. RePrompt lives in your system tray, watches your intent, and stays out of your way until you need it. No windows. No distractions."
      />

      {/* STORY SECTION 3 */}
      <StorySection
        mono="S03_THE_CONVERSION"
        title="Instant Mastery."
        subtitle="Better answers aren't about longer prompts. They're about better context. We inject the right instructions directly into your workflow, ensuring consistent, high-quality output every time."
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
              title="Zero Interface"
              description="Works in any text field. Browsers, IDEs, Slack, or Word. If you can type there, RePrompt works there."
            />
            <TechCard
              tag="LOGIC_02"
              title="Provider Agnostic"
              description="Powered by Groq and OpenAI. Switch between Llama 3 and GPT-4o models in seconds with zero configuration."
            />
            <TechCard
              tag="EFFICIENCY_03"
              title="Ultra-Low Latency"
              description="A lightweight C++ powered automation engine that consumes less than 50MB of RAM. Performance without compromise."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '4rem', textAlign: 'center', borderTop: '1px solid var(--outline)' }}>
        <span className="text-mono" style={{ opacity: 0.5 }}>© 2026 REPROMPT. OBSESSIVELY CRAFTED BY AAWEJ.</span>
      </footer>
    </div>
  )
}

export default App
