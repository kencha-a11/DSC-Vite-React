// src/components/Loader.jsx
import React from 'react';

const SIZE_MAP = {
    sm: { spinner: 'w-6 h-6 border-2', text: 'text-sm' },
    md: { spinner: 'w-10 h-10 border-4', text: 'text-base' },
    lg: { spinner: 'w-14 h-14 border-4', text: 'text-lg' },
};

export default function Loader({
    variant = 'spinner',
    size = 'md',
    text = '',
    className = '',
    overlay = false, // 👈 use this for full-screen transparent overlay
}) {
    const cfg = SIZE_MAP[size] || SIZE_MAP.md;

    const spinner = (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
            role="status"
            aria-live="polite"
            aria-label={text || 'Loading'}
        >
            <div
                className={`inline-block ${cfg.spinner} rounded-full border-gray-300 dark:border-gray-600 border-t-transparent animate-spin`}
            />
            {text ? (
                <span className={`${cfg.text} text-gray-600 dark:text-gray-300`}>
                    {text}
                </span>
            ) : null}
        </div>
    );

    // Overlay mode (transparent, no blur)
    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
                {spinner}
            </div>
        );
    }

    return spinner;
}
