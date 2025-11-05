import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white p-16 rounded-lg shadow-2xl max-w-xl w-full text-center border-t-4 border-red-600">

                {/* Authority Icon */}
                <svg
                    className="w-16 h-16 mx-auto mb-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Lock icon representing restriction/security */}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>

                {/* Error Code and Title */}
                <p className="text-7xl font-light mb-3 text-gray-900">
                    **403**
                </p>
                <h1 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-4">
                    Access Forbidden
                </h1>

                {/* Formal Message */}
                <p className="text-lg mb-10 text-gray-600 leading-relaxed">
                    The action you are attempting to execute requires **elevated permissions**. Your current user profile does not possess the necessary credentials to view this resource.
                    <br className="my-2" />
                    Please verify your authentication status or contact your system administrator for assistance.
                </p>

                {/* Primary Action Button */}
                <Link
                    to="/dashboard"
                    className="inline-block px-10 py-3 bg-blue-700 text-white font-medium text-lg tracking-wide uppercase rounded-md shadow-lg hover:bg-blue-800 transition duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
