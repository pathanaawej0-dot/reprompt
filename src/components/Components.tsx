import * as React from 'react';

interface StorySectionProps {
    title: string;
    subtitle: string;
    label?: string;
    align?: 'left' | 'center';
}

export const StorySection: React.FC<StorySectionProps> = ({ title, subtitle, label, align = 'left' }) => {
    return (
        <section style={{
            padding: '120px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : 'flex-start',
            textAlign: align
        }}>
            <div className="md-container" style={{ maxWidth: '800px', margin: align === 'center' ? '0 auto' : '0' }}>
                {label && (
                    <div style={{ marginBottom: '16px' }}>
                        <span className="md-chip success">{label}</span>
                    </div>
                )}
                <h2 className="md-display-large" style={{ marginBottom: '24px' }}>{title}</h2>
                <p className="md-body-large" style={{ fontSize: '20px', lineHeight: 1.6 }}>{subtitle}</p>
            </div>
        </section>
    );
};

interface TechCardProps {
    title: string;
    description: string;
    icon: string;
}

export const TechCard: React.FC<TechCardProps> = ({ title, description, icon }) => {
    return (
        <div className="md-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
            <h3 className="md-title-large" style={{ marginBottom: '12px' }}>{title}</h3>
            <p className="md-body-large">{description}</p>
        </div>
    );
};
