'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';

function SyncContent() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const challenge = searchParams.get('challenge');

    const [status, setStatus] = useState('Authenticating RePrompt Desktop...');
    const [failed, setFailed] = useState(false);
    const [syncUrl, setSyncUrl] = useState('');

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            const redirectParams = challenge ? `?challenge=${challenge}` : '';
            router.push(`/sign-in?redirect_url=${encodeURIComponent('http://localhost:3000/auth-sync' + redirectParams)}`);
            return;
        }

        if (!challenge) {
            setStatus('Missing secure connection code. Please launch the RePrompt Desktop App and click "Log In to Connect" to start the sync process.');
            setFailed(true);
            return;
        }

        const syncToDesktop = async () => {
            try {
                const res = await fetch('/api/auth/desktop/init', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ challenge })
                });

                if (res.ok) {
                    const data = await res.json();
                    const code = data.authCode;

                    if (code) {
                        const deepLink = `reprompt-app://sync?code=${encodeURIComponent(code)}`;
                        setSyncUrl(deepLink);

                        // Attempt automatic redirect
                        window.location.href = deepLink;

                        setTimeout(() => {
                            if (!failed) {
                                setStatus('Connection signal sent! The app should open automatically.');
                                setFailed(false);
                            }
                        }, 2000);
                    } else {
                        setStatus('Failed to retrieve authentication token: Missing token in response.');
                        setFailed(true);
                    }
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    setStatus(`Server rejected sync. Error: ${errorData.error || res.statusText}`);
                    setFailed(true);
                }
            } catch (err: any) {
                console.error('Failed to sync:', err);
                setStatus(`Failed to connect with the desktop app. Error: ${err?.message || err}`);
                setFailed(true);
            }
        };

        syncToDesktop();
    }, [isLoaded, isSignedIn, router, challenge]);

    return (
        <div className="container" style={{ padding: '60px 40px', maxWidth: '400px', margin: '100px auto', textAlign: 'center', backgroundColor: 'transparent', borderTop: '2px solid var(--brutal-accent)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--brutal-fg)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect RePrompt</h2>
            <p style={{ fontFamily: 'var(--font-mono)', opacity: 0.6, marginBottom: failed ? '2rem' : '0' }}>{status}</p>

            {(!failed && !syncUrl) && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="spinner" style={{
                        width: '30px',
                        height: '30px',
                        border: '3px solid rgba(140, 252, 66, 0.3)',
                        borderTopColor: '#8CFC42',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style dangerouslySetInnerHTML={{
                        __html: `
                @keyframes spin { 
                    to { transform: rotate(360deg); } 
                }
            `}} />
                </div>
            )}

            {failed && syncUrl && (
                <a
                    href={syncUrl}
                    className="md-btn md-btn-outlined"
                    style={{ marginTop: '1rem', display: 'block' }}
                >
                    CLICK HERE IF NOT REDIRECTED
                </a>
            )}

            <button
                className="md-btn md-btn-tonal"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => router.push('/dashboard')}
            >
                Go to Dashboard
            </button>
        </div>
    );
}

export default function AuthSyncPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#000',
            color: 'white',
            fontFamily: 'var(--font-mono)'
        }}>
            <Suspense fallback={<div>Loading...</div>}>
                <SyncContent />
            </Suspense>
        </div>
    );
}
