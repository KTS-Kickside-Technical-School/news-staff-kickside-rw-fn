import { useState } from 'react';
import { toast } from 'react-toastify';
import { saveTournamentYear } from '../../utils/requests/tournaments/tournamentsRequests';

const SetupTournamentYear = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    startYear: '',
    endYear: '',
    isLatest: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === 'startYear') {
      const year = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        startYear: value,
        endYear: !isNaN(year) ? String(year + 1) : prev.endYear, // auto set endYear
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const validateForm = () => {
    const start = parseInt(formData.startYear);
    const end = parseInt(formData.endYear);

    if (!start || !end) {
      toast.error('Start year and End year are required');
      return false;
    }
    if (isNaN(start) || isNaN(end)) {
      toast.error('Years must be valid numbers');
      return false;
    }
    if (start > currentYear) {
      toast.error('Start year cannot be in the future');
      return false;
    }
    if (end <= start) {
      toast.error('End year must be greater than Start year');
      return false;
    }
    return true;
  };

  const handleSaveYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await saveTournamentYear(formData);

      if (response.status === 201) {
        toast.success('Tournament year saved successfully');
        setFormData({ startYear: '', endYear: '', isLatest: false });
        return;
      }
      throw new Error(response.message || 'Error saving the tournament year');
    } catch (error: any) {
      toast.error(error.message || 'Error saving the tournament year');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Setup Tournament Years</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSaveYear}
      >
        {/* Start Year */}
        <div className="flex flex-col">
          <label htmlFor="startYear" className="mb-2 font-medium">
            Start Year
          </label>
          <input
            type="number"
            id="startYear"
            name="startYear"
            value={formData.startYear}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="e.g. 2024"
            required
          />
        </div>

        {/* End Year */}
        <div className="flex flex-col">
          <label htmlFor="endYear" className="mb-2 font-medium">
            End Year
          </label>
          <input
            type="number"
            id="endYear"
            name="endYear"
            value={formData.endYear}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="Auto-filled from start year"
            required
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            id="isLatest"
            name="isLatest"
            checked={formData.isLatest}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="isLatest" className="font-medium">
            Is the year latest?
          </label>
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Year
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupTournamentYear;
