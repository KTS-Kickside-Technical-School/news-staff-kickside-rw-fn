import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { createNewUser } from '../../utils/requests/usersRequest';
import { BiPlusCircle } from 'react-icons/bi';
import SEO from '../../utils/SEO';

// Backend validation schema
const createUserSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().optional(),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['Journalist', 'Editor', 'Admin'], 'Invalid role')
    .required('Role is required'),
});

const AdminNewUser = () => {
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Journalist',
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await createNewUser(values);
      if (response.status === 201) {
        toast.success('User created successfully!');
        setInitialValues({
          firstName: '',
          lastName: '',
          email: '',
          role: 'Journalist',
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('An error occurred', error);
      toast.error('An error occurred saving the user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer />
      <SEO mainData={{ title: 'New User - Kickside News' }} />
      <h2 className="text-2xl font-bold text-center mb-6">Create New User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={createUserSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaUser className="text-gray-500 ml-2" />
                <Field
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  className="w-full p-2 outline-none"
                />
              </div>
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <MdEdit className="text-gray-500 ml-2" />
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  className="w-full p-2 outline-none"
                />
              </div>
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <FaEnvelope className="text-gray-500 ml-2" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full p-2 outline-none"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <Field
                as="select"
                name="role"
                className="w-full p-2 border border-primary outline-0 rounded-md"
              >
                <option value="Journalist">Journalist</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-40 py-2 rounded-md text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? (
                  'Creating...'
                ) : (
                  <span className="flex text-center justify-center">
                    <BiPlusCircle className="mt-1 mx-1" />
                    <span>Create User</span>
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminNewUser;
