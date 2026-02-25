'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, Bot, Key, CreditCard, BarChart2 } from 'lucide-react';

interface Agent {
    id: string;
    name: string;
    shortcut: string;
    shortcut_key: string;
    system_prompt: string;
    is_built_in: boolean;
    enabled: boolean;
    icon?: string;
    parent_id?: string;
}

export default function DashboardPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    // Core State
    const [credits, setCredits] = useState<number | null>(null);
    const [plan, setPlan] = useState<'free' | 'pro'>('free');
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // UI State
    const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'keys' | 'pricing' | 'analytics'>('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditingAgentId, setCurrentEditingAgentId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        icon: '🤖',
        shortcutKey: '',
        systemPrompt: ''
    });

    // Auth Protection
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    const fetchUserData = useCallback(async () => {
        if (!user) return;
        try {
            const [creditsRes, agentsRes, keysRes, analyticsRes] = await Promise.all([
                fetch('/api/user/credits'),
                fetch('/api/agents'),
                fetch('/api/user/keys'),
                fetch('/api/user/analytics')
            ]);

            if (creditsRes.ok) {
                const creditData = await creditsRes.json();
                setCredits(creditData.credits);
                setPlan(creditData.plan || 'free');
            }
            if (agentsRes.ok) {
                const agentsData = await agentsRes.json();
                setAgents(agentsData.agents || []);
            }
            if (keysRes.ok) {
                const keysData = await keysRes.json();
                setApiKeys(keysData.keys || []);
            }
            if (analyticsRes.ok) {
                const data = await analyticsRes.json();
                setAnalytics(data);
            } else {
                console.error('Analytics API failed:', await analyticsRes.text());
                setAnalytics({ error: true });
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        } finally {
            setLoading(false);
        }
    }, [user, setCredits, setAgents, setApiKeys, setLoading]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Handlers
    const openAgentModal = (agent?: Agent) => {
        if (agent) {
            setCurrentEditingAgentId(agent.id);
            setFormData({
                name: agent.name,
                icon: agent.icon || '🤖',
                shortcutKey: agent.shortcut_key,
                systemPrompt: agent.system_prompt
            });
        } else {
            setCurrentEditingAgentId(null);
            setFormData({
                name: '',
                icon: '🤖',
                shortcutKey: '',
                systemPrompt: ''
            });
        }
        setIsModalOpen(true);
    };

    const saveAgent = async () => {
        const shortcutKey = formData.shortcutKey.toUpperCase();

        // Client-side duplicate check (Case-insensitive)
        const duplicateAgent = agents.find(a =>
            a.shortcut_key?.toUpperCase() === shortcutKey &&
            a.id !== currentEditingAgentId
        );

        if (duplicateAgent) {
            alert(`Shortcut 'Alt+Shift+${shortcutKey}' is already in use by agent "${duplicateAgent.name}".`);
            return;
        }

        const payload = {
            id: currentEditingAgentId || crypto.randomUUID(),
            name: formData.name.toUpperCase(),
            icon: formData.icon,
            shortcut: `Alt+Shift+${shortcutKey}`,
            shortcut_key: shortcutKey,
            system_prompt: formData.systemPrompt,
            enabled: true
        };

        try {
            const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Failed to save agent'}`);
                return;
            }

            setIsModalOpen(false);
            await fetchUserData(); // Refresh list
        } catch (error) {
            console.error('Failed to process agent node', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const deleteAgent = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
            await fetchUserData();
        } catch (error) {
            console.error('Failed to delete agent', error);
        }
    };

    const toggleAgent = async (agent: any) => {
        try {
            const newEnabledState = !agent.enabled;
            // Optimistic UI
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, enabled: newEnabledState } : a));

            const res = await fetch('/api/agents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...agent,
                    enabled: newEnabledState
                })
            });

            if (!res.ok) {
                // Revert on failure
                fetchUserData();
                const data = await res.json();
                alert(`Failed to toggle agent: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to toggle agent', error);
            fetchUserData();
        }
    };

    const deleteKey = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to revoke access for ${name}?`)) return;
        try {
            await fetch(`/api/user/keys?id=${id}`, { method: 'DELETE' });
            await fetchUserData();
        } catch (error) {
            console.error('Failed to purge key', error);
        }
    };

    const handleUpgrade = async () => {
        try {
            const res = await fetch('/api/checkout', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Failed to initiate checkout: No URL returned.');
                }
            } else {
                const errData = await res.json();
                alert(`Failed to initiate checkout: ${errData.error || res.statusText}`);
            }
        } catch (err) {
            console.error('Failed to initiate checkout:', err);
            alert('An error occurred. Please try again later.');
        }
    };

    if (!isLoaded || !isSignedIn) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
                <div className="spinner"></div>
                <p className="sys-headline" style={{ fontSize: '32px' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* MD3 Nav Rail */}
            <nav className="nav-rail">
                <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px', marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                    <Image src="/logo.svg" alt="RePrompt Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
                </Link>

                <div className="nav-destinations">
                    <button className={`nav-destination ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                        <div className="nav-indicator"><User size={20} strokeWidth={2} /></div>
                        <span className="nav-label">Profile</span>
                    </button>
                    <button className={`nav-destination ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
                        <div className="nav-indicator"><Bot size={20} strokeWidth={2} /></div>
                        <span className="nav-label">Agents</span>
                    </button>
                    <button className={`nav-destination ${activeTab === 'keys' ? 'active' : ''}`} onClick={() => setActiveTab('keys')}>
                        <div className="nav-indicator"><Key size={20} strokeWidth={2} /></div>
                        <span className="nav-label">Keys</span>
                    </button>
                    <button className={`nav-destination ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>
                        <div className="nav-indicator"><CreditCard size={20} strokeWidth={2} /></div>
                        <span className="nav-label">Pricing</span>
                    </button>
                    <button className={`nav-destination ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                        <div className="nav-indicator"><BarChart2 size={20} strokeWidth={2} /></div>
                        <span className="nav-label">Analytics</span>
                    </button>
                </div>

                <div className="nav-spacer"></div>

                <div style={{ marginBottom: '24px', width: '100%', padding: '0 12px' }}>
                    <SignOutButton>
                        <button className="md-btn md-btn-tonal" style={{ width: '100%', padding: '10px 0', fontSize: '11px' }}>Sign Out</button>
                    </SignOutButton>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content-wrapper">
                <main className="main-content">
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px' }}>
                        <div>
                            <h1 className="sys-headline">{activeTab === 'overview' ? 'User Profile' : activeTab === 'agents' ? 'My Agents' : activeTab === 'pricing' ? 'Upgrade Plan' : activeTab === 'analytics' ? 'Usage Metrics' : 'Security Keys'}</h1>
                            <p className="sys-subhead" style={{ marginTop: '16px', maxWidth: '600px' }}>
                                {activeTab === 'overview'
                                    ? 'Manage your account and subscription preferences.'
                                    : activeTab === 'agents'
                                        ? 'Create and manage your custom AI agents.'
                                        : activeTab === 'pricing'
                                            ? 'Increase your limits to accelerate your workflow.'
                                            : activeTab === 'analytics'
                                                ? 'Track your token consumption and optimized prompts.'
                                                : 'Manage connected desktop applications.'}
                            </p>
                        </div>
                    </header>

                    {activeTab === 'overview' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

                            {/* Profile MD Card */}
                            <div className="md-card">
                                <h2 className="sys-title" style={{ marginBottom: '32px' }}>Account Info</h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={user.imageUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                    <div>
                                        <h3 className="sys-title" style={{ fontSize: '20px' }}>{user.fullName || 'Unknown User'}</h3>
                                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--md-sys-color-primary)', fontSize: '14px' }}>{user.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                                <div className="md-divider"></div>
                                <p style={{ fontFamily: 'var(--font-body)', opacity: 0.6, fontSize: '12px', wordBreak: 'break-all' }}>ID: {user.id}</p>
                            </div>

                            {/* Credits Card */}
                            <div className="md-card md-card-glass">
                                <h2 className="sys-title" style={{ marginBottom: '32px' }}>Your Credits</h2>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
                                    <span className="sys-headline accent" style={{ fontSize: '72px' }}>
                                        {loading ? '...' : credits?.toLocaleString()}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, letterSpacing: '1px' }}>CREDITS REMAINING</span>
                                </div>
                                <div className="md-divider" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: plan === 'pro' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-background)' }}>
                                        Current Plan: <span style={{ fontWeight: 600 }}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
                                    </span>
                                    {plan === 'free' && (
                                        <button className="md-btn md-btn-filled" onClick={() => setActiveTab('pricing')}>Upgrade to Pro</button>
                                    )}
                                </div>
                            </div>

                            {/* Desktop Sync Card */}
                            <div className="md-card" style={{ gridColumn: '1 / -1' }}>
                                <h2 className="sys-title" style={{ marginBottom: '16px' }}>Desktop Application</h2>
                                <p style={{ marginBottom: '32px', fontSize: '16px', maxWidth: '800px', color: 'var(--md-sys-color-on-background)', opacity: 0.8 }}>
                                    RePrompt works best as an invisible background utility. Install our desktop client to enable zero-friction, cross-app text accelerators tied directly to your keyboard.
                                </p>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <a href="/RePrompt-Setup-1.0.0.exe" download className="md-btn md-btn-tonal">Download for Windows</a>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'agents' && (
                        <div className="md-card">
                            <div style={{ padding: '0 0 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--md-sys-color-outline-variant)', marginBottom: '32px' }}>
                                <h2 className="sys-title" style={{ margin: 0 }}>My Agents</h2>
                                <button className="md-btn md-btn-filled" onClick={() => openAgentModal()}>+ Create Agent</button>
                            </div>

                            <div>
                                {loading && <p style={{ padding: '48px 0', textAlign: 'center', fontSize: '24px', animation: 'pulse 1.5s infinite', color: '#666' }}>Loading...</p>}
                                {!loading && agents.length === 0 && (
                                    <div style={{ padding: '80px 0', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <h3 className="sys-headline" style={{ fontSize: '48px', color: 'rgba(255,255,255,0.1)' }}>No Agents Found</h3>
                                        <p style={{ marginTop: '24px', fontSize: '18px' }}>Create a new agent to get started.</p>
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {agents.map((agent, index) => (
                                        <div key={agent.id} className={agent.enabled ? '' : 'agent-item-disabled'} style={{
                                            display: 'flex', alignItems: 'center', padding: '24px 0',
                                            borderBottom: index !== agents.length - 1 ? '1px solid var(--md-sys-color-outline-variant)' : 'none'
                                        }}>
                                            <div style={{ fontSize: '28px', marginRight: '32px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '50%' }}>
                                                {agent.icon || '🤖'}
                                            </div>
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <h3 className="sys-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
                                                        {agent.name}
                                                    </h3>
                                                    {agent.is_built_in && <span className="md-chip">Built-in</span>}
                                                </div>
                                                <p style={{ color: 'var(--md-sys-color-primary)', fontSize: '13px', fontWeight: 500 }}>Shortcut: <kbd style={{ background: 'var(--md-sys-color-surface-container-high)', color: 'var(--md-sys-color-on-background)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-body)' }}>ALT+SHIFT+{agent.shortcut_key}</kbd></p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                <div
                                                    className={`sys-switch ${agent.enabled ? 'active' : ''}`}
                                                    onClick={() => toggleAgent(agent)}
                                                    title={agent.enabled ? 'Disable Agent' : 'Enable Agent'}
                                                />
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <button className="md-btn md-btn-tonal" onClick={() => openAgentModal(agent)}>Edit</button>
                                                    {!agent.is_built_in && (
                                                        <button className="md-btn md-btn-outlined" onClick={() => deleteAgent(agent.id, agent.name)}>Delete</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'keys' && (
                        <div className="md-card">
                            <div style={{ padding: '0 0 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--md-sys-color-outline-variant)', marginBottom: '32px' }}>
                                <h2 className="sys-title" style={{ margin: 0 }}>Connected Devices</h2>
                                <button className="md-btn md-btn-filled" onClick={() => alert('Missing secure connection code.\n\nPlease launch the RePrompt Desktop application and click "Log In to Connect" so it can securely link to your account.')}>+ Connect Desktop App</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {loading && <p>Loading...</p>}
                                {!loading && apiKeys.length === 0 && (
                                    <p style={{ opacity: 0.6, fontSize: '18px', padding: '24px 0' }}>No connected devices found. Click the button above to connect your desktop app.</p>
                                )}
                                {!loading && apiKeys.map((key, index) => (
                                    <div key={key.id} style={{
                                        display: 'flex', alignItems: 'center', padding: '24px 0',
                                        borderBottom: index !== apiKeys.length - 1 ? '1px solid var(--md-sys-color-outline-variant)' : 'none'
                                    }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <h3 className="sys-title" style={{ fontSize: '20px', marginBottom: '8px' }}>{key.device_name || 'UNKNOWN DEVICE'}</h3>
                                            <p style={{ color: 'var(--md-sys-color-primary)', fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: 500 }}>LAST ACTIVE: {key.last_used ? new Date(key.last_used).toLocaleString() : 'NEVER'}</p>
                                        </div>
                                        <button className="md-btn md-btn-outlined" onClick={() => deleteKey(key.id, key.device_name)}>Revoke Access</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginTop: '32px' }}>
                            {/* Free Tier */}
                            <div className="md-card" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                opacity: plan === 'free' ? 1 : 0.6
                            }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 500, marginBottom: '8px' }}>Basic</h2>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '32px', fontWeight: 400, marginBottom: '24px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '24px' }}>
                                    $0 <span style={{ fontSize: '14px', color: '#888' }}>/month</span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1, marginBottom: '48px', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '2' }}>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> 10 Credits / month
                                    </li>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> RePrompt Agent 1.0 Access
                                    </li>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> Basic Agents
                                    </li>
                                </ul>
                                <button className="md-btn md-btn-outlined" disabled style={{ opacity: plan === 'free' ? 0.5 : 1, cursor: plan === 'free' ? 'default' : 'pointer' }}>
                                    {plan === 'free' ? 'Current Plan' : 'Downgrade'}
                                </button>
                            </div>

                            {/* Pro Tier */}
                            <div className="md-card md-card-glass" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                borderColor: plan === 'pro' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                                boxShadow: plan === 'pro' ? '0 0 40px rgba(168, 199, 250, 0.05)' : 'none'
                            }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 500, marginBottom: '8px', color: 'var(--md-sys-color-primary)' }}>Pro Plan</h2>
                                <p style={{ fontFamily: 'var(--font-body)', fontSize: '32px', fontWeight: 400, marginBottom: '24px', borderBottom: '1px solid var(--md-sys-color-outline-variant)', paddingBottom: '24px' }}>
                                    $15 <span style={{ fontSize: '14px', color: '#888' }}>/month</span>
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1, marginBottom: '48px', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: '2' }}>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> 1500 Credits / month
                                    </li>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> Priority RePrompt Agent 1.0
                                    </li>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> Unlimited Agents
                                    </li>
                                    <li style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--md-sys-color-primary)', marginRight: '16px', fontSize: '18px' }}>✓</span> Fast Support
                                    </li>
                                </ul>
                                <button className={plan === 'pro' ? "md-btn md-btn-tonal" : "md-btn md-btn-filled"} onClick={plan === 'pro' ? undefined : handleUpgrade} disabled={plan === 'pro'} style={{ opacity: plan === 'pro' ? 0.5 : 1, cursor: plan === 'pro' ? 'default' : 'pointer' }}>
                                    {plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>

                            {!analytics ? <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0', opacity: 0.5 }}><div className="spinner"></div></div> : analytics.error ? (
                                <div className="md-card" style={{ padding: '24px', backgroundColor: 'var(--md-sys-color-error)', color: 'var(--md-sys-color-on-error)' }}>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Failed to load analytics</h3>
                                    <p>Please check the server logs for more details.</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                        <div className="md-card" style={{ marginBottom: 0, padding: '24px' }}>
                                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--md-sys-color-on-background)', opacity: 0.8, marginBottom: '8px' }}>TOTAL OPTIMIZATIONS</p>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 400, color: 'var(--md-sys-color-primary)' }}>{analytics.total?.prompts || 0}</h3>
                                        </div>
                                        <div className="md-card" style={{ marginBottom: 0, padding: '24px' }}>
                                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--md-sys-color-on-background)', opacity: 0.8, marginBottom: '8px' }}>PROMPT TOKENS</p>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400 }}>{analytics.total?.promptTokens?.toLocaleString() || 0}</h3>
                                        </div>
                                        <div className="md-card" style={{ marginBottom: 0, padding: '24px' }}>
                                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--md-sys-color-on-background)', opacity: 0.8, marginBottom: '8px' }}>GENERATED TOKENS</p>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 400 }}>{analytics.total?.completionTokens?.toLocaleString() || 0}</h3>
                                        </div>
                                    </div>

                                    <div className="md-card">
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 500, marginBottom: '48px' }}>7-Day Optimization Volume</h3>

                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '250px', gap: '16px' }}>
                                            {analytics.chartData?.map((day: any, i: number) => {
                                                const maxPrompts = Math.max(...analytics.chartData.map((d: any) => d.promptsOptimized), 10);
                                                const heightPercentage = Math.max((day.promptsOptimized / maxPrompts) * 100, 1);

                                                const dateObj = new Date(day.date + 'T00:00:00');
                                                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

                                                return (
                                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, height: '100%', justifyContent: 'flex-end' }}>
                                                        <div style={{
                                                            width: '100%',
                                                            maxWidth: '48px',
                                                            height: `${heightPercentage}%`,
                                                            backgroundColor: day.promptsOptimized > 0 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-container-high)',
                                                            borderRadius: '8px 8px 0 0',
                                                            transition: 'height 1s cubic-bezier(0.2, 0, 0, 1)',
                                                            position: 'relative'
                                                        }}>
                                                            {day.promptsOptimized > 0 && (
                                                                <span style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: 'var(--md-sys-color-on-background)' }}>
                                                                    {day.promptsOptimized}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span style={{ marginTop: '16px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '12px', color: 'var(--md-sys-color-on-background)', opacity: 0.6 }}>{dayName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Overlay inline for Web */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="md-card" style={{
                        width: '100%', maxWidth: '600px', margin: '24px',
                        boxShadow: 'var(--md-sys-elevation-2)'
                    }}>
                        <h2 className="sys-headline" style={{ fontSize: '32px', marginBottom: '32px' }}>
                            {currentEditingAgentId ? 'Edit Agent' : 'Create Agent'}
                        </h2>

                        <div className="md-textfield">
                            <label>Name</label>
                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. English Grammar Fixer" />
                        </div>

                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div className="md-textfield" style={{ width: '120px' }}>
                                <label>Icon Emoji</label>
                                <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} maxLength={2} />
                            </div>
                            <div className="md-textfield" style={{ flexGrow: 1 }}>
                                <label>Shortcut Key (Alt+Shift+X)</label>
                                <input value={formData.shortcutKey} onChange={e => setFormData({ ...formData, shortcutKey: e.target.value.toUpperCase() })} maxLength={1} placeholder="X" />
                            </div>
                        </div>

                        <div className="md-textfield" style={{ marginBottom: '48px' }}>
                            <label>System Prompt Details</label>
                            <textarea
                                value={formData.systemPrompt}
                                onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                                rows={6}
                                placeholder="Enter instructions..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                            <button className="md-btn md-btn-tonal" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="md-btn md-btn-filled" onClick={saveAgent}>{currentEditingAgentId ? 'Save Edits' : 'Create Agent'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
