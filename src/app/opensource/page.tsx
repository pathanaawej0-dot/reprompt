'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Download, Github, Monitor, ShieldCheck, Zap, ArrowLeft, ArrowRight, MonitorCheck } from 'lucide-react';

export default function OpenSourcePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{ backgroundColor: '#0A0A0B', minHeight: '100vh', color: '#fff' }}>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 48px 0' }}>
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--md-sys-color-primary)',
                    textDecoration: 'none',
                    marginBottom: '48px',
                    fontWeight: 500
                }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>

            <main style={{ padding: '40px 24px 80px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

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
                        <Github style={{ color: 'var(--md-sys-color-primary)', width: '32px', height: '32px' }} />
                    </div>
                    <h1 className="sys-headline-xl" style={{ fontSize: '72px', marginBottom: '16px' }}>RePrompt <br /><span style={{ color: 'var(--md-sys-color-primary)' }}>Open Source.</span></h1>
                    <p className="sys-subhead" style={{ fontSize: '20px', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                        Free forever. Bring your own keys. Transparent and community-driven.
                    </p>
                </div>

                {/* PRIMARY CTA */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    padding: '80px',
                    textAlign: 'center',
                    marginBottom: '80px',
                    flexWrap: 'wrap'
                }}>
                    <a href="/Reprompt-opensource.exe" download className="md-btn" style={{
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

                    <a href="https://github.com/786aawej-cmd/RePrompt-open-source-.git" target="_blank" rel="noopener noreferrer" className="md-btn md-btn-tonal" style={{
                        padding: '24px 64px',
                        fontSize: '24px',
                        borderRadius: '100px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        textDecoration: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        View on GitHub <Github size={24} />
                    </a>
                </div>

                <div style={{ textAlign: 'center', marginTop: '120px' }}>
                    <p style={{ opacity: 0.4, fontSize: '14px', marginBottom: '8px' }}>© 2026 RePrompt. All rights reserved.</p>
                    <p style={{ opacity: 0.4, fontSize: '12px' }}>Windows 10+ recommended.</p>
                </div>
            </main>
        </div>
    );
}
