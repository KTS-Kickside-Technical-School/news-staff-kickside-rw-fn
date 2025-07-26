import { useState, useEffect } from 'react';
import { subscribeToNewsLetter } from '../utils/requests/newsLetterRequests';

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    text: string;
    type: 'error' | 'success';
  } | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null); // null = untouched
  const [emailError, setEmailError] = useState<string>('');

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (!email) {
      setEmailValid(null);
      setEmailError('');
    } else if (!isValidEmail(email)) {
      setEmailValid(false);
      setEmailError('Invalid email format');
    } else {
      setEmailValid(true);
      setEmailError('');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!email.trim()) {
      setFormMessage({ text: 'Please enter an email address.', type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      setFormMessage({
        text: 'Please enter a valid email address.',
        type: 'error',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await subscribeToNewsLetter(email);

      if (response.status !== 201) {
        throw new Error(response.message || 'Subscription failed');
      }

      setFormMessage({
        text: 'Successfully subscribed to our newsletter!',
        type: 'success',
      });
      setEmail('');
    } catch (err: any) {
      setFormMessage({
        text: err.message || 'Subscription failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#3E60F4] py-16 mt-10">
      <div className="container mx-auto px-6">
        <div className="max-w-lg mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-2xl font-semibold mb-3 animate-fade-in">
            Subscribe to our Newsletter
          </h2>
          <p className="text-sm mb-6 animate-fade-in delay-200">
            Stay updated with the latest from Kickside. You can unsubscribe
            anytime.
          </p>

          {formMessage && (
            <div
              className={`text-sm mb-4 px-4 py-2 rounded-md transition-all duration-300 ${
                formMessage.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              } animate-slide-down`}
            >
              {formMessage.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in delay-300"
          >
            <div className="w-full sm:w-2/3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-md bg-white text-gray-800 focus:outline-none transition-all border ${
                  emailValid === null
                    ? 'border-gray-300'
                    : emailValid
                    ? 'border-green-500 ring-1 ring-green-400'
                    : 'border-red-500 ring-1 ring-red-400'
                }`}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-red-300 mt-1 text-left">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-1/3 px-6 py-3 bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all focus:ring-2 focus:ring-blue-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
