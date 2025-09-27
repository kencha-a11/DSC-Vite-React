// src/components/Loader.jsx
import React from 'react';

/**
 * Loader
 * Props:
 * - variant: 'spinner' | 'skeleton' (default 'spinner')
 * - size: 'sm' | 'md' | 'lg' (default 'md')
 * - text: optional loading text
 * - className: additional class names
 */
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
}) {
    const cfg = SIZE_MAP[size] || SIZE_MAP.md;

    if (variant === 'skeleton') {
        return (
            <div
                className={`flex flex-col gap-3 items-start ${className}`}
                aria-busy="true"
                aria-label="Loading content"
            >
                <div className="flex items-center gap-4 w-full">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ width: 48, height: 48 }} />
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    </div>
                </div>

                <div className="w-full space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-11/12" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-10/12" />
                </div>
            </div>
        );
    }

    // default spinner variant
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
            role="status"
            aria-live="polite"
            aria-label={text || 'Loading'}
        >
            <div className={`inline-block ${cfg.spinner} rounded-full border-gray-300 dark:border-gray-600 border-t-transparent animate-spin`} />
            {text ? <span className={`${cfg.text} text-gray-600 dark:text-gray-300`}>{text}</span> : null}
        </div>
    );
}
