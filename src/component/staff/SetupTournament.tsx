import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { saveTournament } from '../../utils/requests/tournaments/tournamentsRequests';
import { getCountries } from '../../utils/requests/tournaments/countriesRequest';
import { ICountry } from '../../utils/types/Tournaments';

const SetupTournament = () => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    type: '',
    description: '',
    foundedYear: '',
  });
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        });
        return;
      }
      throw new Error(response.message || 'Error saving the tournament');
    } catch (error: any) {
      toast.error(error.message || 'Error saving the tournament');
    }
  };

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

        <div className="flex flex-col col-span-2">
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
