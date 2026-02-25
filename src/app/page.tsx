'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Target, SearchX, FastForward, Wand2, Coffee, Sparkles, VolumeX, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: '#0A0A0B', minHeight: '100vh', color: '#fff' }}>

      {/* DYNAMIC NAV BAR */}
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
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: scrolled ? '20px' : '24px',
                fontWeight: 600,
                letterSpacing: '1px',
                transition: 'all 0.6s'
              }}>REPROMPT</span>
            </div>

            <nav style={{ marginLeft: '16px', display: 'flex', gap: '24px' }}>
              <Link href="/pricing" style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                opacity: 0.6,
                transition: 'opacity 0.2s'
              }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}>
                Pricing
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SignedIn>
              <Link href="/dashboard" className="md-btn md-btn-tonal" style={{ padding: '10px 24px' }}>
                Dashboard
              </Link>
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

        {/* 1. THE HOOK */}
        <section className="stack-section bg-deep" style={{ zIndex: 1 }}>
          <div className="content-wrapper reveal-up" style={{ textAlign: 'center' }}>
            <Target style={{ color: 'var(--md-sys-color-primary)', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h1 className="sys-headline-xl" style={{ fontSize: '96px', lineHeight: 1.1, letterSpacing: '-2px' }}>
              Reclaim your <br /><span style={{ color: 'var(--md-sys-color-primary)' }}>focus.</span>
            </h1>
            <p className="sys-subhead" style={{ marginTop: '32px', fontSize: '24px', opacity: 0.7, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Stop wrestling with machines. Translate your raw, messy thoughts into perfect output instantly.
            </p>
          </div>
        </section>

        {/* 2. THE DECEPTION */}
        <section className="stack-section bg-surface" style={{ zIndex: 2 }}>
          <div className="content-wrapper">
            <SearchX style={{ color: '#FF5F56', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '32px', lineHeight: 1.1 }}>The Industry Trap.</h2>
            <p className="sys-subhead" style={{ fontSize: '28px', opacity: 0.8, maxWidth: '800px', lineHeight: 1.5 }}>
              You're paying for "Prompt Libraries" and "Optimizers" that actually cost you <i style={{ color: '#FF5F56' }}>more</i> time. Searching, copy-pasting, tweaking. You are paying to do more work.
            </p>
          </div>
        </section>

        {/* 3. THE PIVOT */}
        <section className="stack-section bg-violet" style={{ zIndex: 3 }}>
          <div className="content-wrapper">
            <FastForward style={{ color: '#D2A8FF', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '80px', marginBottom: '32px', color: '#D2A8FF' }}>The Pivot.</h2>
            <p className="sys-subhead" style={{ fontSize: '32px', opacity: 0.9, maxWidth: '800px', lineHeight: 1.4 }}>
              10X results shouldn't require 10X the effort. <br /><br />
              It's time to stop engineering prompts, and start thinking again.
            </p>
          </div>
        </section>

        {/* 4. THE RELEASE */}
        <section className="stack-section bg-deep" style={{ zIndex: 4 }}>
          <div className="content-wrapper">
            <Wand2 style={{ color: 'var(--md-sys-color-primary)', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '32px' }}>Invisible Help.</h2>
            <p className="sys-subhead" style={{ fontSize: '28px', opacity: 0.8, maxWidth: '800px', lineHeight: 1.5 }}>
              Highlight your braindump anywhere. Hit your hotkey. RePrompt acts as an invisible layer over your OS, replacing your text with perfect results—zero editing required.
            </p>
          </div>
        </section>

        {/* 5. THE RITUAL */}
        <section className="stack-section bg-emerald" style={{ zIndex: 5 }}>
          <div className="content-wrapper">
            <Coffee style={{ color: '#A3FFB4', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '32px', color: '#A3FFB4' }}>The Workflow Ritual.</h2>
            <p className="sys-subhead" style={{ fontSize: '28px', opacity: 0.9, maxWidth: '800px', lineHeight: 1.5 }}>
              It shouldn't feel like "using an AI tool". It should feel like hitting <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '8px', fontFamily: 'monospace' }}>⌘ + C</kbd>. A completely seamless integration into the work you are already doing.
            </p>
          </div>
        </section>

        {/* 6. THE INTELLIGENCE */}
        <section className="stack-section bg-surface" style={{ zIndex: 6 }}>
          <div className="content-wrapper">
            <Sparkles style={{ color: 'var(--md-sys-color-primary)', width: '80px', height: '80px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '64px', marginBottom: '32px' }}>Introducing <br /><span style={{ color: 'var(--md-sys-color-primary)' }}>RePrompt Agent 1.0</span></h2>
            <p className="sys-subhead" style={{ fontSize: '24px', opacity: 0.8, maxWidth: '900px', lineHeight: 1.6 }}>
              We aren't just passing your text to an LLM. The RePrompt Agent is specifically engineered to aggressively decode human intent and synthesize perfectly formatted, professional machine instructions.
            </p>
          </div>
        </section>

        {/* 7. THE PEACE */}
        <section className="stack-section bg-indigo" style={{ zIndex: 7 }}>
          <div className="content-wrapper">
            <VolumeX style={{ color: '#A1B0FF', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '80px', marginBottom: '32px', color: '#A1B0FF' }}>Total Peace.</h2>
            <p className="sys-subhead" style={{ fontSize: '32px', opacity: 0.9, maxWidth: '800px', lineHeight: 1.4 }}>
              No bloated interfaces. No tabs to manage. <br /><br />Just absolute system tray silence until the exact moment you need it.
            </p>
          </div>
        </section>

        {/* 8. THE TRUST */}
        <section className="stack-section bg-deep" style={{ zIndex: 8 }}>
          <div className="content-wrapper">
            <ShieldCheck style={{ color: 'white', width: '64px', height: '64px', marginBottom: '40px' }} />
            <h2 className="sys-headline" style={{ fontSize: '72px', marginBottom: '32px' }}>Secure by Default.</h2>
            <p className="sys-subhead" style={{ fontSize: '28px', opacity: 0.6, maxWidth: '800px', lineHeight: 1.5 }}>
              Your workflows are private. Your keys stay on your machine. All background processing is executed securely via our edge infrastructure.
            </p>
          </div>
        </section>

        {/* 9. THE INVITATION */}
        <section className="stack-section bg-emerald" style={{ zIndex: 9 }}>
          <div className="content-wrapper" style={{ textAlign: 'center' }}>
            <h2 className="sys-headline" style={{ fontSize: '96px', marginBottom: '48px', color: '#A3FFB4', letterSpacing: '-2px' }}>Join the New Age.</h2>
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
                  Enter RePrompt <ArrowRight />
                </button>
              </SignInButton>
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
            </SignedIn>
            <p style={{ marginTop: '32px', opacity: 0.7, fontSize: '18px', color: '#A3FFB4' }}>Includes 10 Free Optimizations Every Month.</p>
          </div>
        </section>

      </main>

    </div>
  );
}
