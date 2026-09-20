import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen grid place-items-center">
            <div className="text-center">
                <h1 className="text-6xl font-black">404</h1>
                <p className="mt-3 text-lg">Page not found</p>
                <Link to="/" className="mt-5 inline-block rounded-xl bg-ink px-5 py-3 font-bold text-white">
                    Go Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;