import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-50 to-white px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-extrabold text-violet-600">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Oops! Page not found
        </h2>

        <p className="mt-3 text-gray-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/app"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
