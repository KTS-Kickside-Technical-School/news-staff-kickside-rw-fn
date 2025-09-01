import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { saveTournament } from '../../utils/requests/tournaments/tournamentsRequests';
import { getCountries } from '../../utils/requests/tournaments/countriesRequest';
import { ICountry } from '../../utils/types/Tournaments';
import { uploadImageToCloudinary } from '../../utils/helpers/cloudinary';
import { useDropzone } from 'react-dropzone';

const SetupTournament = () => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: '',
    description: '',
    foundedYear: '',
    logo: '',
  });
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [logoUrl, setLogoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to fetch countries');
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // clear error on change
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.type.trim()) newErrors.type = 'Tournament type is required';
    if (!formData.foundedYear.trim())
      newErrors.foundedYear = 'Founded year is required';
    else if (isNaN(Number(formData.foundedYear)))
      newErrors.foundedYear = 'Founded year must be a valid number';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.logo.trim()) newErrors.logo = 'Logo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await saveTournament(formData);
      if (response.status === 201) {
        toast.success('Tournament saved successfully');
        setFormData({
          name: '',
          country: '',
          type: '',
          description: '',
          foundedYear: '',
          logo: '',
        });
        setLogoUrl('');
        return;
      }
      throw new Error(response.message || 'Error saving the tournament');
    } catch (error: any) {
      toast.error(error.message || 'Error saving the tournament');
    }
  };

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
        setLogoUrl(url);
        setFormData((prev) => ({ ...prev, logo: url }));
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

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Setup Tournament</h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSaveTournament}
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.name ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
            placeholder="Tournament name"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="country" className="mb-2 font-medium">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.country ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country._id} value={country._id}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-sm text-red-500">{errors.country}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="mb-2 font-medium">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.type ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
          >
            <option value="">Select</option>
            <option value="League">League</option>
            <option value="Cup">Cup</option>
            <option value="Friendly">Friendly</option>
          </select>
          {errors.type && (
            <span className="text-sm text-red-500">{errors.type}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="foundedYear" className="mb-2 font-medium">
            Founded Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="foundedYear"
            name="foundedYear"
            value={formData.foundedYear}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.foundedYear ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
            placeholder="e.g. 1995"
          />
          {errors.foundedYear && (
            <span className="text-sm text-red-500">{errors.foundedYear}</span>
          )}
        </div>

        <div>
          <label htmlFor="foundedYear" className="mb-2 font-medium">
            Logo <span className="text-red-500">*</span>
          </label>
          <div
            {...getRootProps()}
            className="relative border-2 border-gray-300 border-dashed rounded-lg p-4 flex justify-center items-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {logoUrl ? (
              <div className="w-full text-center">
                <img
                  src={logoUrl}
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
          {errors.logo && (
            <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
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

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 focus:ring ${
              errors.description ? 'border-red-500' : 'focus:ring-blue-300'
            }`}
            rows={3}
            placeholder="Short description"
          />
          {errors.description && (
            <span className="text-sm text-red-500">{errors.description}</span>
          )}
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Tournament
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupTournament;
