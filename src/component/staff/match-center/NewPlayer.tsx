import { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { savePlayer } from '../../../utils/requests/tournaments/tournamentsRequests';

const NewPlayer = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    nationality: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await savePlayer(formData);
      if (response.status === 201) {
        toast.success('Player created successfully');
        setFormData({
          firstname: '',
          lastname: '',
          birthdate: '',
          nationality: '',
        });
        return;
      }
      throw new Error(response.message || 'Failed to create player');
    } catch (error: any) {
      toast.error(error.message || 'Error in creating player');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">New Player</h2>
      <form onSubmit={handleSavePlayer} className="space-y-4">
        <div>
          <label
            htmlFor="firstname"
            className="block text-gray-700 font-bold mb-2"
          >
            Firstname
          </label>
          <input
            type="text"
            id="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-gray-700 font-bold mb-2"
          >
            Lastname
          </label>
          <input
            type="text"
            id="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="birthdate"
            className="block text-gray-700 font-bold mb-2"
          >
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="nationality"
            className="block text-gray-700 font-bold mb-2"
          >
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            <FaSave /> Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlayer;
