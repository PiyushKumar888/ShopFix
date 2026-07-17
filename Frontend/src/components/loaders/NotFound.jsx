
import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">

            <div className="text-center space-y-5">

                <h1 className="text-7xl font-black text-primary">
                    404
                </h1>

                <h2 className="text-3xl font-bold">
                    Page Not Found
                </h2>

                <p className="opacity-70">
                    The page you're looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    className="btn btn-primary"
                >
                    Go Home
                </Link>

            </div>

        </div>
    );
};