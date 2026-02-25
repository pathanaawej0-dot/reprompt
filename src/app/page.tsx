'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BrainCircuit, Flame, Zap, LayoutGrid, BadgeDollarSign, ArrowRight, Heart } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#0A0A0B', minHeight: '100vh', color: '#fff' }}>

      {/* NAV */}
      <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
        <div style={{
          height: scrolled ? '72px' : '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '0 32px' : '0 64px',
          transition: 'all 0.6s cubic-bezier(0.2, 0, 0, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Image src="/logo.svg" alt="RePrompt Logo" width={scrolled ? 32 : 40} height={scrolled ? 32 : 40} style={{ transition: 'all 0.6s' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: scrolled ? '20px' : '24px', fontWeight: 600, letterSpacing: '1px', transition: 'all 0.6s' }}>REPROMPT</span>
            </div>
            <nav style={{ marginLeft: '16px', display: 'flex', gap: '24px' }}>
              {[['Pricing', '/pricing'], ['Download', '/download'], ['Founder', '/founder']].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 500, opacity: 0.6, transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SignedIn>
              <Link href="/dashboard" className="md-btn md-btn-tonal" style={{ padding: '10px 24px' }}>Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="md-btn md-btn-filled" style={{ padding: '10px 32px' }}>Start Free</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="stack-container">

        {/* 1. HERO — The Truth */}
        <section className="stack-section bg-deep" style={{ zIndex: 1 }}>
          <div className="content-wrapper reveal-up" style={{ textAlign: 'center' }}>
            <BrainCircuit style={{ color: 'var(--md-sys-color-primary)', width: '64px', height: '64px', marginBottom: '56px' }} />
            <h1 className="sys-headline-xl" style={{ fontSize: '88px', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '40px' }}>
              AI is a genius.<br />
              <span style={{ color: 'var(--md-sys-color-primary)' }}>Treat it like a toddler.</span>
            </h1>
            <p className="sys-subhead" style={{ fontSize: '26px', opacity: 0.65, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55, marginBottom: '64px' }}>
              If you want great results from ChatGPT, Claude, or Cursor — you have to do all the heavy lifting. Every single time.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="md-btn" style={{
                  padding: '20px 56px',
                  fontSize: '20px',
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: '#000',
                  borderRadius: '100px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.2px'
                }}>
                  Stop the busywork <ArrowRight size={20} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" style={{
                padding: '20px 56px',
                fontSize: '20px',
                backgroundColor: 'var(--md-sys-color-primary)',
                color: '#000',
                borderRadius: '100px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                letterSpacing: '0.2px'
              }}>
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            </SignedIn>
          </div>
        </section>

        {/* 2. THE PROBLEM */}
        <section className="stack-section bg-surface" style={{ zIndex: 2 }}>
          <div className="content-wrapper">
            <Flame style={{ color: '#FF5F56', width: '64px', height: '64px', marginBottom: '56px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '48px', lineHeight: 1.1 }}>
              Writing the perfect prompt<br />is <i style={{ color: '#FF5F56' }}>exhausting.</i>
            </h2>
            <p className="sys-subhead" style={{ fontSize: '26px', opacity: 0.75, maxWidth: '700px', lineHeight: 1.65 }}>
              Explain the persona. Define the tone. Set the rules. If you skip any of it — you get generic, robotic garbage that breaks your code or sounds completely fake.
            </p>
          </div>
        </section>

        {/* 3. THE FRICTION */}
        <section className="stack-section bg-violet" style={{ zIndex: 3 }}>
          <div className="content-wrapper">
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '48px', color: '#D2A8FF', lineHeight: 1.1 }}>
              It takes<br /><span style={{ color: '#fff' }}>15 minutes</span> every time.
            </h2>
            <p className="sys-subhead" style={{ fontSize: '26px', opacity: 0.8, maxWidth: '700px', lineHeight: 1.65 }}>
              Leave your app. Open a new tab. Write the prompt. Copy it. Switch back. Paste it. You&apos;re doing the busywork that AI was supposed to eliminate.
            </p>
          </div>
        </section>

        {/* 4. THE SCENE */}
        <section className="stack-section bg-deep" style={{ zIndex: 4 }}>
          <div className="content-wrapper">
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '48px', lineHeight: 1.1 }}>
              You just have a<br /><span style={{ color: 'var(--md-sys-color-primary)' }}>raw, messy thought.</span>
            </h2>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '40px 48px',
              maxWidth: '760px',
              fontFamily: 'monospace',
              fontSize: '22px',
              lineHeight: 1.7,
              color: '#e2d9f3',
            }}>
              &ldquo;tell the client we are delayed 2 weeks cause of the API bug, be professional but don&apos;t apologize too much.&rdquo;
            </div>
            <p className="sys-subhead" style={{ fontSize: '22px', opacity: 0.5, maxWidth: '700px', lineHeight: 1.65, marginTop: '40px' }}>
              You don&apos;t open a new tab. You don&apos;t copy-paste anything.
            </p>
          </div>
        </section>

        {/* 5. THE SHORTCUT */}
        <section className="stack-section bg-emerald" style={{ zIndex: 5 }}>
          <div className="content-wrapper" style={{ textAlign: 'center' }}>
            <h2 className="sys-headline" style={{ fontSize: '80px', marginBottom: '56px', lineHeight: 1.05, color: '#A3FFB4' }}>
              You just press<br />a shortcut.
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '64px', flexWrap: 'wrap', alignItems: 'center' }}>
              {['Alt', '+', 'Shift', '+', 'O'].map((key, i) => (
                <kbd key={i} style={{
                  background: key === '+' ? 'transparent' : 'rgba(255,255,255,0.08)',
                  border: key === '+' ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '14px',
                  padding: key === '+' ? '0 6px' : '16px 28px',
                  fontSize: key === '+' ? '32px' : '28px',
                  fontFamily: 'monospace',
                  color: key === '+' ? 'rgba(255,255,255,0.3)' : '#fff',
                  fontWeight: 600,
                  minWidth: key === '+' ? 'auto' : '72px',
                  textAlign: 'center',
                }}>{key}</kbd>
              ))}
            </div>
            <p className="sys-subhead" style={{ fontSize: '26px', opacity: 0.85, maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Your messy 20-word thought is instantly replaced with a <strong style={{ color: '#fff' }}>250-word, masterclass-level prompt.</strong>
            </p>
          </div>
        </section>

        {/* 6. THE PRODUCT — Switchboard */}
        <section className="stack-section bg-surface" style={{ zIndex: 6 }}>
          <div className="content-wrapper">
            <LayoutGrid style={{ color: 'var(--md-sys-color-primary)', width: '64px', height: '64px', marginBottom: '56px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '48px', lineHeight: 1.1 }}>
              Your keyboard is now a<br /><span style={{ color: 'var(--md-sys-color-primary)' }}>switchboard of AI experts.</span>
            </h2>
            <p className="sys-subhead" style={{ fontSize: '26px', opacity: 0.75, maxWidth: '800px', lineHeight: 1.7 }}>
              Need a senior software engineer to review your logic? Press <kbd style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '4px 14px', fontFamily: 'monospace', fontSize: '22px', color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>Alt + 1</kbd> and your thought becomes a strict code-review prompt.<br /><br />
              Need a direct-response marketer? Press <kbd style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '4px 14px', fontFamily: 'monospace', fontSize: '22px', color: 'var(--md-sys-color-primary)', fontWeight: 700 }}>Alt + 2</kbd>.<br /><br />
              You can even write and save your own custom frameworks. Your voice. Your rules. Never typed again.
            </p>
          </div>
        </section>

        {/* 7. THE VALUE */}
        <section className="stack-section bg-violet" style={{ zIndex: 7 }}>
          <div className="content-wrapper">
            <Zap style={{ color: '#D2A8FF', width: '64px', height: '64px', marginBottom: '56px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '48px', lineHeight: 1.1, color: '#D2A8FF' }}>
              Be lazy.<br /><span style={{ color: '#fff' }}>Still get perfect results.</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '720px', marginBottom: '56px' }}>
              {[
                { num: '1,500', label: 'Optimizations / month' },
                { num: '50', label: 'Perfect prompts / day' },
                { num: '1¢', label: 'Per perfect prompt' },
              ].map(({ num, label }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(210,168,255,0.15)',
                  borderRadius: '20px',
                  padding: '36px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '56px', fontWeight: 800, color: '#D2A8FF', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: '15px', opacity: 0.55, marginTop: '12px', lineHeight: 1.4 }}>{label}</div>
                </div>
              ))}
            </div>
            <p className="sys-subhead" style={{ fontSize: '22px', opacity: 0.6, maxWidth: '680px', lineHeight: 1.65 }}>
              Every shortcut saves you <strong style={{ color: '#fff' }}>15 minutes</strong> and guarantees your AI gives you exactly what you want — first try.
            </p>
          </div>
        </section>

        {/* 8. THE CTA */}
        <section className="stack-section bg-emerald" style={{ zIndex: 8 }}>
          <div className="content-wrapper" style={{ textAlign: 'center' }}>
            <BadgeDollarSign style={{ color: '#A3FFB4', width: '64px', height: '64px', marginBottom: '56px' }} />
            <h2 className="sys-headline" style={{ fontSize: '88px', marginBottom: '32px', color: '#A3FFB4', letterSpacing: '-2px', lineHeight: 1.05 }}>
              Stop wrestling<br />with AI.
            </h2>
            <p className="sys-subhead" style={{ fontSize: '24px', opacity: 0.75, maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6, marginBottom: '20px' }}>
              Type your raw thought. Hit the shortcut. Let RePrompt do the translation.
            </p>
            <p style={{ fontSize: '18px', color: '#A3FFB4', opacity: 0.6, marginBottom: '56px' }}>
              $15 / month — 1,500 instant optimizations.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="md-btn" style={{
                  padding: '24px 64px',
                  fontSize: '24px',
                  backgroundColor: '#fff',
                  color: '#091C10',
                  borderRadius: '100px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Start Free <ArrowRight />
                </button>
              </SignInButton>
              <div style={{ marginTop: '24px' }}>
                <Link href="/download" className="md-btn md-btn-tonal" style={{ padding: '16px 48px', fontSize: '18px', borderRadius: '100px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Download for Windows
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="md-btn" style={{
                padding: '24px 64px',
                fontSize: '24px',
                backgroundColor: '#fff',
                color: '#091C10',
                borderRadius: '100px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none'
              }}>
                Go to Dashboard <ArrowRight />
              </Link>
              <div style={{ marginTop: '24px' }}>
                <Link href="/download" className="md-btn md-btn-tonal" style={{ padding: '16px 48px', fontSize: '18px', borderRadius: '100px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Download for Windows
                </Link>
              </div>
            </SignedIn>
            <p style={{ marginTop: '32px', opacity: 0.6, fontSize: '17px', color: '#A3FFB4' }}>Includes 10 Free Optimizations Every Month.</p>
          </div>
        </section>

        {/* FOUNDER FOOTER */}
        <section style={{ padding: '100px 24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Link href="/founder" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '40px',
                borderRadius: '32px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} className="hover-glow">
                <Heart style={{ color: '#ec4899', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>A message from Aawej</h3>
                <p style={{ opacity: 0.55, fontSize: '15px', lineHeight: 1.7 }}>
                  &ldquo;I don&apos;t have a giant team or a custom domain yet. I&apos;m just a student from Satara with a vision for better AI tools. Click to read my story.&rdquo;
                </p>
                <div style={{ marginTop: '20px', color: 'var(--md-sys-color-primary)', fontSize: '14px', fontWeight: 500 }}>
                  Read the Founder&apos;s Story →
                </div>
              </div>
            </Link>
          </div>
        </section>

      </main>

      <style jsx global>{`
        .nav-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.6s cubic-bezier(0.2, 0, 0, 1);
        }
        .nav-header.scrolled {
          background-color: rgba(10, 10, 11, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .stack-container { position: relative; }
        .stack-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 140px 24px;
          position: sticky;
          top: 0;
          overflow: hidden;
        }
        .bg-deep { background-color: #0A0A0B; }
        .sys-headline-xl { font-family: var(--font-display); }
        .content-wrapper {
          max-width: 1100px;
          width: 100%;
          position: relative;
          z-index: 2;
        }
        .hover-glow:hover {
          background-color: rgba(255,255,255,0.04);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
