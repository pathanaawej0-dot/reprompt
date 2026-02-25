'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Check, Sparkles, Zap, ArrowLeft } from 'lucide-react';

export default function Pricing() {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await fetch('/api/checkout', { method: 'POST' });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Checkout error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#0A0A0B', minHeight: '100vh', color: '#fff', padding: '100px 48px' }}>

            {/* BACKGROUND BEAM */}
            <div className="glow-bg" style={{ top: '0', left: '50%', transform: 'translateX(-50%)', opacity: 0.15 }}></div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--md-sys-color-primary)',
                    textDecoration: 'none',
                    marginBottom: '48px',
                    fontWeight: 500
                }}>
                    <ArrowLeft size={20} /> Back to Story
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 className="sys-headline-xl" style={{ fontSize: '80px', marginBottom: '24px' }}>Simple Choice.</h1>
                    <p className="sys-subhead" style={{ fontSize: '24px', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                        Choose the plan that fits your creative rhythm. Powered by <b>RePrompt Agent 1.0</b>.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>

                    {/* FREE PLAN */}
                    <div style={{
                        padding: '48px',
                        borderRadius: '40px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h2 className="sys-title" style={{ opacity: 0.5, marginBottom: '16px' }}>Starter</h2>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '56px', fontWeight: 600 }}>$0</span>
                            <span style={{ opacity: 0.4 }}>/month</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', flexGrow: 1 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> 10 Professional Optimizations
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> RePrompt Agent 1.0 Access
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> Global Hotkey Integration
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.4 }}>
                                <Check size={20} /> Private Community Access
                            </li>
                        </ul>

                        <Link href="/dashboard" className="md-btn md-btn-tonal" style={{ padding: '20px', borderRadius: '24px', textAlign: 'center' }}>
                            Current Plan
                        </Link>
                    </div>

                    {/* PRO PLAN */}
                    <div style={{
                        padding: '48px',
                        borderRadius: '40px',
                        background: 'rgba(140, 252, 66, 0.03)',
                        border: '1px solid var(--md-sys-color-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '24px',
                            right: '-32px',
                            background: 'var(--md-sys-color-primary)',
                            color: '#000',
                            padding: '8px 48px',
                            transform: 'rotate(45deg)',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>Popular</div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Sparkles size={20} style={{ color: 'var(--md-sys-color-primary)' }} />
                            <h2 className="sys-title" style={{ color: 'var(--md-sys-color-primary)' }}>Pro Builder</h2>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '56px', fontWeight: 600 }}>$19.99</span>
                            <span style={{ opacity: 0.4 }}>/month</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px 0', flexGrow: 1 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <Zap size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> <b>1500</b> Professional Optimizations
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> Priority RePrompt Agent 1.0
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> Unlimited Custom Agents
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> Early Access to New Rituals
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: 0.8 }}>
                                <Check size={20} style={{ color: 'var(--md-sys-color-primary)' }} /> Private Discord Community
                            </li>
                        </ul>

                        <SignedIn>
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="md-btn md-btn-filled"
                                style={{ padding: '20px', borderRadius: '24px', width: '100%', fontSize: '18px' }}
                            >
                                {loading ? 'Processing...' : 'Upgrade Now'}
                            </button>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="md-btn md-btn-filled" style={{ padding: '20px', borderRadius: '24px', width: '100%', fontSize: '18px' }}>
                                    Sign In to Upgrade
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>

                </div>

                <p style={{ textAlign: 'center', marginTop: '64px', opacity: 0.4, fontSize: '14px' }}>
                    Secure payments powered by Dodo Payments. Cancel anytime.
                </p>
            </div>
        </div>
    );
}
