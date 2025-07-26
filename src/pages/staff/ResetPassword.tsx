import { useState } from 'react';
import { BiLockAlt } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '/logo.svg';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { userResetPassword } from '../../utils/requests/authRequest'; // Adjust the endpoint to handle resetting passwords
import ButtonSpinner from '../../components/ButtonSpinner';
import SEO from '../../utils/SEO';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid or missing token');
      console.error('Token missing:', token);
      return;
    }

    try {
      setIsLoading(true);
      const response = await userResetPassword(token, newPassword);

      if (response.status !== 200) {
        toast.error(response.message || 'Failed to reset password');
      } else {
        setIsResetSuccessful(true);
        toast.success('Password reset successfully');
      }
    } catch (error) {
      console.error('Error during password reset:', error); // Debugging log
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
      <ToastContainer />
      <SEO
        mainData={{
          title: 'Staff: Reset Password as Kickside Staff - Kickside News',
        }}
      />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {isResetSuccessful ? (
          <div className="text-center space-y-4">
            <AiOutlineCheckCircle
              size={48}
              className="text-green-500 mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Password Reset Successful!
            </h1>
            <p className="text-gray-500 text-sm">
              You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <img src={Logo} alt="Kickside Logo" className="w-16 h-16 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm">
                Set your new password below.
              </p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <ButtonSpinner />
                ) : (
                  <>
                    <BiLockAlt size={20} />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              Remembered your password?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
