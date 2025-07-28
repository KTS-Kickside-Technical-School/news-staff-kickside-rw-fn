import { useState } from 'react';
import { BiLogIn } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../../utils/requests/authRequest';
import ButtonSpinner from '../../component/ButtonSpinner';
import SEO from '../../utils/SEO';
import { Helmet } from 'react-helmet-async';

interface StaffLoginProps {}

const StaffLogin = ({}: StaffLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      setIsLoading(false);
      return;
    }
    if (!password) {
      toast.error('Password is required');
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
      const response = await userLogin({ email, password });

      if (response.status !== 200) {
        toast.error(response.message);
      } else {
        setEmail('');
        setPassword('');
        sessionStorage.setItem('token', response.session.content);

        const { password: _, ...userWithoutPassword } = response.user;
        sessionStorage.setItem('profile', JSON.stringify(userWithoutPassword));

        toast.success(response.message);
        if (userWithoutPassword.role === 'Editor') {
          navigate('/editor/dashboard');
        } else if (userWithoutPassword.role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (userWithoutPassword.role === 'Journalist') {
          navigate('/journalist/dashboard');
        } else {
          throw new Error('Error occured trying to login');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
        <ToastContainer />
        <SEO
          mainData={{
            title: ` Login to your journalist account  - Kickside News`,
            type: 'article',
          }}
          canonicalUrl={`https://www.kickside.rw/login`}
        />{' '}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <Link to="/">
              <img src={Logo} alt="Kickside Logo" className="w-16 h-16 mb-2" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Staff Login</h1>
            <p className="text-gray-500 text-sm">
              Welcome back! Please log in to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 border-gray-300 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link
                to="/staff/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
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
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Need help?{' '}
            <Link to="/support" className="text-blue-500 hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffLogin;
