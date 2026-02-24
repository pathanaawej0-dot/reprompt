'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--md-sys-color-background)' }}>

      {/* Sleek Minimal Top Bar */}
      <header style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Image src="/logo.svg" alt="RePrompt Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--md-sys-color-on-background)'
          }}>RePrompt</span>
        </div>

        <div>
          <SignedOut>
            <Link href="/sign-up">
              <button className="md-btn md-btn-filled" style={{ padding: '10px 24px' }}>Get Started</button>
            </Link>
          </SignedOut>
          <SignedIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link href="/dashboard" className="md-btn md-btn-tonal" style={{ textDecoration: 'none' }}>
                Open Terminal
              </Link>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {/* NARRATIVE HERO SECTION */}
        <section style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 48px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--md-sys-color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 500,
              marginBottom: '32px',
              fontSize: '14px'
            }}>
              System Architecture &gt; Phase 1
            </p>

            <h1 className="sys-headline" style={{
              fontSize: 'min(12vw, 120px)',
              lineHeight: 0.85,
              marginBottom: '40px',
            }}>
              Stop <span style={{ opacity: 0.3 }}>wrestling</span><br />
              with <span style={{ color: 'var(--md-sys-color-primary)' }}>machines.</span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '22px',
              lineHeight: 1.6,
              maxWidth: '600px',
              marginBottom: '56px',
              color: 'var(--md-sys-color-on-background)',
              opacity: 0.8
            }}>
              Context switching breaks your flow. RePrompt is the invisible OS layer that translates your intent into perfect AI prompts instantly, anywhere.
            </p>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="md-btn md-btn-filled" style={{ padding: '20px 48px', fontSize: '18px' }}>
                    Commence Trial
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <a href="/RePrompt-Setup-1.0.0.exe" download className="md-btn md-btn-tonal" style={{ padding: '20px 48px', fontSize: '18px' }}>
                  Download App
                </a>
                <Link href="/dashboard" className="md-btn md-btn-outlined" style={{ padding: '20px 48px', fontSize: '18px' }}>
                  Open Terminal
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* STORYTELLING FLOW - ONE CONCEPT PER SCROLL */}
        <section style={{ padding: '120px 48px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            {/* Step 01 */}
            <div style={{ display: 'flex', gap: '48px', marginBottom: '160px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '120px', lineHeight: 0.8, color: 'var(--md-sys-color-primary)' }}>01</div>
              <div style={{ maxWidth: '500px', paddingTop: '16px' }}>
                <h3 className="sys-title" style={{ fontSize: '40px', marginBottom: '24px' }}>Highlight. Strike. Done.</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, color: 'var(--md-sys-color-on-background)', opacity: 0.8 }}>
                  No tabs. No copy-pasting. Highlight text in Chrome, VSCode, or Word. Hit a global hotkey, and a highly-specialized prompt replaces your text immediately. Silence the noise; keep the momentum.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div style={{ display: 'flex', gap: '48px', marginBottom: '160px', alignItems: 'flex-start', justifyContent: 'flex-end', textAlign: 'right' }}>
              <div style={{ maxWidth: '500px', paddingTop: '16px' }}>
                <h3 className="sys-title" style={{ fontSize: '40px', marginBottom: '24px' }}>Architect Your Agents</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, color: 'var(--md-sys-color-on-background)', opacity: 0.8 }}>
                  Create specific system prompts for code reviews, email drafting, or deep psychological storytelling. Assign them precise hotkeys from the web dashboard. Watch them instantly sync to your desktop.
                </p>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '120px', lineHeight: 0.8, color: 'var(--md-sys-color-primary)' }}>02</div>
            </div>

            {/* Step 03 */}
            <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '120px', lineHeight: 0.8, color: 'var(--md-sys-color-primary)' }}>03</div>
              <div style={{ maxWidth: '500px', paddingTop: '16px' }}>
                <h3 className="sys-title" style={{ fontSize: '40px', marginBottom: '24px' }}>Invisibility as a Feature</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, color: 'var(--md-sys-color-on-background)', opacity: 0.8 }}>
                  RePrompt lives completely out of sight in your system tray. A true utility is one you never have to look at. We stripped away the UI so you can focus purely on your work.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer style={{
        padding: '64px 48px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'var(--md-sys-color-surface)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '2px', color: 'var(--md-sys-color-primary)' }}>REPROMPT</p>
          <p style={{ opacity: 0.4, marginTop: '8px', fontSize: '12px', fontFamily: 'var(--font-body)' }}>Copyright © 2026. All rights reserved.</p>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Built by a 16-year-old. Built for people.</p>
      </footer>
    </div>
  );
}

