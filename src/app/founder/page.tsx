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
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--md-sys-color-primary), #ec4899)',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
                    }}>
                        A
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-1px' }}>
                        The Founder's Story
                    </h1>
                    <p style={{ fontSize: '18px', opacity: 0.6, maxWidth: '600px', margin: '0 auto' }}>
                        A mission to democratize high-end AI tools, built from a bedroom in Satara.
                    </p>
                </header>

                {/* THE STORY */}
                <section style={{ lineHeight: 1.8, fontSize: '17px', opacity: 0.9 }}>
                    <p style={{ marginBottom: '24px' }}>
                        Hi, I'm <strong>Aawej</strong>. I'm a 10th-grade student at <strong>St. Paul's School & Jr. College, Satara</strong>.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        I don't have a big office, a venture capital check, or even a professional domain name yet. What I do have is a PC, an internet connection, and a burning desire to build something that actually helps people.
                    </p>

                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '24px',
                        padding: '32px',
                        marginBottom: '40px',
                        marginTop: '40px'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck style={{ color: 'var(--md-sys-color-primary)' }} />
                            Radical Transparency
                        </h3>
                        <p style={{ fontSize: '15px', opacity: 0.7, marginBottom: '16px' }}>
                            You might notice our URL ends in <code>.vercel.app</code> and that our login screen says <strong>"Development Mode"</strong>. Here is the honest truth:
                        </p>
                        <ul style={{ fontSize: '15px', opacity: 0.7, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
                            <li>I currently cannot afford the $15-20 required for a professional <code>.com</code> or <code>.ai</code> domain.</li>
                            <li>Clerk (our secure auth provider) requires a custom domain to enable "Production Mode."</li>
                            <li>Because of this, you see a warning—but the security is exactly the same as a multi-million dollar app.</li>
                        </ul>
                        <p style={{ fontSize: '15px', opacity: 0.7, marginTop: '16px', fontWeight: 500, color: 'var(--md-sys-color-primary)' }}>
                            Every single "Pro" subscription directly funds the purchase of our professional domain and code-signing certificates.
                        </p>
                    </div>

                    <p style={{ marginBottom: '24px' }}>
                        I built RePrompt because I was tired of context-switching between my work and an AI chat tab. I wanted the AI to live where I live—in my code editor, my browser, and my documents.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        Thank you for taking a chance on a student project. Your trust means everything to me, and I promise to keep building, keep shipping, and keep improving RePrompt until it's the best tool on your desktop.
                    </p>
                </section>

                {/* HEART */}
                <div style={{ textAlign: 'center', margin: '64px 0' }}>
                    <Heart style={{ color: '#ec4899' }} size={32} />
                </div>

                {/* CONTACT SECTION */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginTop: '64px'
                }}>
                    <a href="mailto:pathanaawej0@gmail.com" style={{
                        textDecoration: 'none',
                        color: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                    }} className="hover-lift">
                        <Mail style={{ color: 'var(--md-sys-color-primary)' }} />
                        <span style={{ fontWeight: 600 }}>Email Me Directly</span>
                        <span style={{ fontSize: '14px', opacity: 0.6 }}>pathanaawej0@gmail.com</span>
                        <span style={{ fontSize: '12px', color: 'var(--md-sys-color-primary)' }}>Expected reply: &lt; 24hrs</span>
                    </a>

                    <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: 'none',
                        color: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                    }} className="hover-lift">
                        <Calendar style={{ color: 'var(--md-sys-color-primary)' }} />
                        <span style={{ fontWeight: 600 }}>Request a Meet</span>
                        <span style={{ fontSize: '14px', opacity: 0.6 }}>Stuck? Let's fix it on a call.</span>
                        <span style={{ fontSize: '12px', color: 'var(--md-sys-color-primary)' }}>Available on weekends</span>
                    </a>
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
