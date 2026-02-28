"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black">
                <div className="flex flex-col items-center justify-center min-h-screen text-white px-6">
                    <h2 className="text-4xl font-bold mb-4 text-red-600">Something went wrong</h2>
                    <p className="text-gray-400 mb-8 text-center max-w-md">
                        An unexpected error occurred. Please try refreshing.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
