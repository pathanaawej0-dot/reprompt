'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Calendar, MessageSquare, ArrowLeft, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function FounderPage() {
    return (
        <div style={{ backgroundColor: '#0a0a0b', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-sans)' }}>
            {/* NAVIGATION */}
            <nav style={{
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(10,10,11,0.8)',
                backdropFilter: 'blur(12px)',
                zIndex: 100
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', fontSize: '14px', opacity: 0.6 }} className="hover-opacity-1">
                    <ArrowLeft size={16} />
                    Back to Story
                </Link>
            </nav>

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
                {/* HEADER */}
                <header style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        margin: '0 auto 32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        position: 'relative'
                    }}>
                        <Image
                            src="/founder.png"
                            alt="Aawej - Founder of RePrompt"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-1.5px' }}>
                        The Founder's Story
                    </h1>
                    <p style={{ fontSize: '20px', opacity: 0.6, maxWidth: '600px', margin: '0 auto', fontWeight: 400 }}>
                        Building the future of AI productivity from Satara.
                    </p>
                </header>

                {/* THE STORY */}
                <section style={{ lineHeight: 1.8, fontSize: '17px', opacity: 0.9 }}>
                    <p style={{ marginBottom: '24px' }}>
                        Hi, I'm <strong>Aawej</strong>. I'm a 10th-grade student at <strong>St. Paul's School & Jr. College, Satara</strong>.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        I noticed a big problem: people are paying for "prompt engineering" tools that only work in a browser. You have to constanty copy-paste your prompts, waste time finding the best one in a library, and then manually edit it. It's a broken workflow.
                    </p>

                    <p style={{ marginBottom: '24px', color: 'var(--md-sys-color-primary)', fontWeight: 500 }}>
                        I built RePrompt to change that. No more copy-pasting. Just write your raw, messy thoughts anywhere you need—in any app—and press one key. RePrompt Agent 1.0 does the heavy lifting instantly.
                    </p>

                    <div style={{
                        backgroundColor: 'rgba(255,244,199,0.05)',
                        border: '1px solid rgba(255,244,199,0.2)',
                        borderRadius: '24px',
                        padding: '32px',
                        marginBottom: '40px',
                        marginTop: '40px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck style={{ color: '#fbbf24' }} />
                            A Note on Safety & Warnings
                        </h3>
                        <p style={{ fontSize: '15px', opacity: 0.7, marginBottom: '16px' }}>
                            Because I'm building this from my bedroom without a giant budget, you might encounter two specific warnings. I want to be 100% honest about why:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '4px' }}>1. Windows "Protected your PC"</strong>
                                <p style={{ fontSize: '14px', opacity: 0.6 }}>Microsoft requires a $400/year "EV Certificate" to remove this warning. As a student, I'm saving up for this. The app is safe, verified, and open-source.</p>
                            </div>
                            <div>
                                <strong style={{ color: '#fff', fontSize: '14px', display: 'block', marginBottom: '4px' }}>2. Clerk "Development Mode"</strong>
                                <p style={{ fontSize: '14px', opacity: 0.6 }}>Our authentication provider requires a custom domain (like <code>reprompt.ai</code>) to go live. I currently built this on a <code>.vercel.app</code> domain to save on costs.</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '20px', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                            Your Pro subscriptions go 100% toward fixing these "beginner" hurdles so we can look as professional as we act.
                        </p>
                    </div>

                    <p style={{ marginBottom: '24px' }}>
                        Thank you for taking a chance on a student project. Your trust means everything to me. I'm building this for you, and I'm always available to listen.
                    </p>
                </section>

                {/* HEART */}
                <div style={{ textAlign: 'center', margin: '48px 0 64px' }}>
                    <Heart style={{ color: '#ec4899' }} size={32} />
                </div>

                {/* CONTACT SECTION */}
                <section style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '32px', textAlign: 'center' }}>Let's talk</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        <a href="mailto:pathanaawej0@gmail.com" style={{
                            textDecoration: 'none',
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            padding: '32px 24px',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '16px',
                            transition: 'all 0.2s ease'
                        }} className="hover-lift">
                            <Mail style={{ color: 'var(--md-sys-color-primary)' }} size={32} />
                            <div>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '18px' }}>Email Me Directly</span>
                                <span style={{ fontSize: '14px', opacity: 0.6 }}>pathanaawej0@gmail.com</span>
                            </div>
                        </a>

                        <a href="https://wa.me/919822304077" target="_blank" rel="noopener noreferrer" style={{
                            textDecoration: 'none',
                            color: '#fff',
                            backgroundColor: 'rgba(37, 211, 102, 0.05)',
                            padding: '32px 24px',
                            borderRadius: '32px',
                            border: '1px solid rgba(37, 211, 102, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '16px',
                            transition: 'all 0.2s ease'
                        }} className="hover-lift">
                            <MessageSquare style={{ color: '#25D366' }} size={32} />
                            <div>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '18px' }}>WhatsApp Support</span>
                                <span style={{ fontSize: '14px', opacity: 0.6 }}>+91 9822304077 (WhatsApp ONLY)</span>
                            </div>
                        </a>

                        <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" style={{
                            textDecoration: 'none',
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            padding: '32px 24px',
                            borderRadius: '32px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '16px',
                            transition: 'all 0.2s ease'
                        }} className="hover-lift">
                            <Calendar style={{ color: 'var(--md-sys-color-primary)' }} size={32} />
                            <div>
                                <span style={{ fontWeight: 600, display: 'block', fontSize: '18px' }}>Google Meet Call</span>
                                <span style={{ fontSize: '14px', opacity: 0.6 }}>Weekends (Satara Time)</span>
                            </div>
                        </a>
                    </div>
                </section>

                {/* FOOTER NOTE */}
                <footer style={{ marginTop: '80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
                    <p style={{ fontSize: '14px', opacity: 0.4 }}>
                        RePrompt is built with ❤️ by Aawej from Satara, India.
                    </p>
                </footer>
            </main>

            <style jsx global>{`
                .hover-opacity-1:hover { opacity: 1 !important; }
                .hover-lift:hover { 
                    border-color: var(--md-sys-color-primary) !important;
                    background-color: rgba(99, 102, 241, 0.05) !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
}
