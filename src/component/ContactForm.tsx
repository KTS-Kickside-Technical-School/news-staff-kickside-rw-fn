import React, { useState } from 'react';
import { sendInquiry } from '../utils/requests/inquiryRequest';
import { toast, ToastContainer } from 'react-toastify';
import ButtonSpinner from './ButtonSpinner';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  inquiry: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    inquiry: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    inquiry: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    if (e.target.value.trim() !== '') {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormValues = {
      firstName: formValues.firstName.trim() === '' ? 'First name is required' : '',
      lastName: formValues.lastName.trim() === '' ? 'Last name is required' : '',
      email: formValues.email.trim() === '' ? 'Email is required' : '',
      inquiry: formValues.inquiry.trim() === '' ? 'Inquiry topic is required' : '',
      message: formValues.message.trim() === '' ? 'Message is required' : '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoading(true); 
      const response = await sendInquiry(formValues);

      if (response.status !== 201) {
        toast.error('Error sending the inquiry');
        return;
      }

      toast.success("Your Inquiry was successfully sent, We will reach out to you soon");
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        inquiry: '',
        message: '',
      });

      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        inquiry: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error: ' + error.message);
      toast.error('Error sending inquiry');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-md space-y-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-black">
            First Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-700'
              } text-black focus:outline-none focus:ring-2 ${errors.firstName ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-black">
            Last Name <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-700'
              } text-black focus:outline-none focus:ring-2 ${errors.lastName ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email <span className="text-red-700">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-700'
              } text-black focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="inquiry" className="block text-sm font-medium text-black">
            What is your inquiry about? <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="inquiry"
            name="inquiry"
            value={formValues.inquiry}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.inquiry ? 'border-red-500' : 'border-gray-700'
              } text-black focus:outline-none focus:ring-2 ${errors.inquiry ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.inquiry && <p className="text-red-500 text-sm mt-1">{errors.inquiry}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-black">
            Message <span className="text-red-700">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formValues.message}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded-md ${errors.message ? 'border-red-500' : 'border-gray-700'
              } text-black focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className={`bg-[#3E60F4] hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-2xl flex items-center justify-center`}
          disabled={isLoading}
        >
          {isLoading ? <ButtonSpinner /> : 'Submit'}
        </button>
      </form>
    </>
  );
};

export default ContactForm;
