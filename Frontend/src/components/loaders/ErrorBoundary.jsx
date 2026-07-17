
import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
                    <div className="max-w-md text-center space-y-4">

                        <h1 className="text-4xl font-bold text-error">
                            Oops!
                        </h1>

                        <p className="opacity-70">
                            Something went wrong while rendering this page.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>

                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}