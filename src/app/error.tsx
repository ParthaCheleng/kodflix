"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Silently log errors without crashing the UI
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
            <h2 className="text-4xl font-bold mb-4 text-red-600">Something went wrong</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                We encountered an issue loading content. This is usually temporary – please try again.
            </p>
            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}
