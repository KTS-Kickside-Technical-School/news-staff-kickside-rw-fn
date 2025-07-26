import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const StaffNotFound = () => {
  const redirectTo = "/staff/dashboard";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
      </p>
      <Link
        to={redirectTo}
        className="flex items-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
      >
        <FiHome className="mr-2" />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default StaffNotFound;
