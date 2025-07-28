import { useState } from 'react';
import { BiLogIn } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { userForgotPassword } from '../../utils/requests/authRequest';
import ButtonSpinner from '../../component/ButtonSpinner';
import SEO from '../../utils/SEO';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isMailSent, setIsMailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await userForgotPassword(email);
      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        setEmail('');
        setIsMailSent(true);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
      <ToastContainer />
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SEO
        mainData={{
          title: 'Staff: Forgot password as Kickside Staff - Kickside Rwanda',
        }}
      />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {isMailSent ? (
          <div className="text-center space-y-4">
            <AiOutlineCheckCircle
              size={48}
              className="text-green-500 mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Verification Email Sent!
            </h1>
            <p className="text-gray-500 text-sm">
              Please check your email for a verification link. If you don’t see
              it in your inbox, check your spam folder.
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
                Forgot Password
              </h1>
              <p className="text-gray-500 text-sm">
                Did you forget your password? You are in the right place!
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
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
                    <BiLogIn size={20} />
                    <span>Send Verification Email</span>
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              Want to log in? Click{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                here
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
