// React from 'react' is not needed in React 17+ for JSX, but types might be.
// Keeping it simple.
import * as React from 'react';

interface StorySectionProps {
    title: string;
    subtitle: string;
    mono?: string;
    align?: 'left' | 'right' | 'center';
}

export const StorySection: React.FC<StorySectionProps> = ({ title, subtitle, mono, align = 'left' }) => {
    return (
        <div className="full-viewport">
            <div className={`container`} style={{ textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start', display: 'flex', flexDirection: 'column' }}>
                {mono && <span className="text-mono" style={{ marginBottom: '1rem' }}>[{mono}]</span>}
                <h2 className="text-section-title">{title}</h2>
                <p className="text-body">{subtitle}</p>
            </div>
        </div>
    );
};

interface TechCardProps {
    title: string;
    description: string;
    tag: string;
}

export const TechCard: React.FC<TechCardProps> = ({ title, description, tag }) => {
    return (
        <div className="border-box">
            <span className="text-mono" style={{ fontSize: '0.7rem' }}>FILE_TYPE: {tag}</span>
            <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{description}</p>
        </div>
    );
};
