'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Download, Monitor, ShieldCheck, Zap, ArrowLeft, ArrowRight, MonitorCheck } from 'lucide-react';

export default function DownloadPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ backgroundColor: '#0A0A0B', minHeight: '100vh', color: '#fff' }}>

            {/* NAV BAR */}
            <header style={{
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 10,
                backgroundColor: 'rgba(10,10,11,0.8)',
                backdropFilter: 'blur(12px)'
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
                    <Image src="/logo.svg" alt="RePrompt Logo" width={32} height={32} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, letterSpacing: '1px' }}>REPROMPT</span>
                </Link>
                <div style={{ display: 'flex', gap: '24px' }}>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.6 }}>Back to Home</Link>
                    <Link href="/pricing" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', opacity: 0.6 }}>Pricing</Link>
                </div>
            </header>

            <main style={{ padding: '160px 24px 80px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        backgroundColor: 'rgba(140, 252, 66, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '1px solid var(--md-sys-color-primary)'
                    }}>
                        <Monitor style={{ color: 'var(--md-sys-color-primary)', width: '32px', height: '32px' }} />
                    </div>
                    <h1 className="sys-headline-xl" style={{ fontSize: '72px', marginBottom: '16px' }}>Power at your <br /><span style={{ color: 'var(--md-sys-color-primary)' }}>fingertips.</span></h1>
                    <p className="sys-subhead" style={{ fontSize: '20px', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                        Download the RePrompt Desktop App to unlock the full potential of invisible AI integration.
                    </p>
                </div>

                {/* PRIMARY CTA */}
                <div style={{
                    padding: '80px',
                    textAlign: 'center',
                    marginBottom: '80px'
                }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px' }}>RePrompt for Windows</h3>
                    <a href="/reprompt.exe" download className="md-btn" style={{
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
                        cursor: 'pointer',
                        textDecoration: 'none'
                    }}>
                        Download .exe <Download size={24} />
                    </a>
                    <p style={{ marginTop: '24px', opacity: 0.4, fontSize: '14px' }}>Version 1.0.0 • Approx 74MB</p>
                </div>

                {/* FEATURES LIST (CLEAN) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '48px',
                    textAlign: 'center'
                }}>
                    <div>
                        <MonitorCheck style={{ color: 'var(--md-sys-color-primary)', marginBottom: '16px', margin: '0 auto 16px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Global Hotkey</h4>
                        <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: 1.6 }}>Access RePrompt anywhere in your OS with a single keystroke. No context switching.</p>
                    </div>
                    <div>
                        <Zap style={{ color: 'var(--md-sys-color-primary)', marginBottom: '16px', margin: '0 auto 16px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Instant Refuel</h4>
                        <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: 1.6 }}>Real-time synchronization with your Web Dashboard ensures your custom agents are always ready.</p>
                    </div>
                    <div>
                        <ShieldCheck style={{ color: 'var(--md-sys-color-primary)', marginBottom: '16px', margin: '0 auto 16px' }} />
                        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Local Security</h4>
                        <p style={{ opacity: 0.6, fontSize: '14px', lineHeight: 1.6 }}>Your prompts and configurations stay encrypted and local until optimization is requested.</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '120px' }}>
                    <p style={{ opacity: 0.4, fontSize: '14px', marginBottom: '8px' }}>© 2026 RePrompt. All rights reserved.</p>
                    <p style={{ opacity: 0.4, fontSize: '12px' }}>Windows 10+ recommended.</p>
                </div>
            </main>
        </div>
    );
}
