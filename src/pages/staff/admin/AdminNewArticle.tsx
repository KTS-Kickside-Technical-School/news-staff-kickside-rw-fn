import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadImageToCloudinary } from '../../../utils/helpers/cloudinary';
import { publishArticle } from '../../../utils/requests/articlesRequest';
import SEO from '../../../utils/SEO';
import RichTextEditor from '../../../component/staff/RichTextEditor';
import ButtonSpinner from '../../../component/ButtonSpinner';

const AdminNewArticle = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: any) => {
    try {
      setUploadProgress(0);
      const { url } = await uploadImageToCloudinary(file);
      setUploadProgress(100);
      return url;
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
      throw error;
    }
  };

  const handleDrop = async (acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB.');
        return;
      }

      try {
        toast.info('Uploading image...');
        const url = await handleImageUpload(file);
        setCoverImage(url);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploadProgress(0);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: handleDrop,
  });

  const validateForm = () => {
    const newErrors: any = {};
    if (!title) newErrors.title = 'Title is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!coverImage) newErrors.coverImage = 'Cover image is required.';
    if (!content) newErrors.content = 'Content is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    setLoading(true);
    try {
      const response = await publishArticle({
        coverImage,
        content,
        title,
        category,
      });
      if (response.status !== 201) {
        toast.error(response.message);
        setLoading(false);
        return;
      }
      toast.success('Article saved successfully!');
      setCoverImage('');
      setContent('');
      setTitle('');
      setCategory('');
      setErrors({});
    } catch (error: any) {
      console.error('Error publishing article:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <SEO mainData={{ title: 'New Article - Kickside News' }} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Article
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div
                {...getRootProps()}
                className="relative border-2 border-gray-300 border-dashed rounded-lg p-4 flex justify-center items-center cursor-pointer"
              >
                <input {...getInputProps()} />
                {coverImage ? (
                  <div className="w-full text-center">
                    <img
                      src={coverImage}
                      alt="Uploaded Cover"
                      className="max-w-full h-auto mx-auto mb-2 rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Drag & Drop or Click to Upload an Image
                  </p>
                )}
              </div>
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">
                    Uploading: {uploadProgress}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-md">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="h-2 bg-blue-500 rounded-md"
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <input
                list="categories"
                name="category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Select a category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="categories">
                <option value="Technology" />
                <option value="Sports" />
                <option value="Entertainment" />
                <option value="Scholarship" />
              </datalist>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Enter article contents"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
              disabled={loading}
            >
              {loading ? (
                <ButtonSpinner />
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewArticle;
