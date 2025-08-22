import React, { useState } from 'react';
import { Button } from '../../../ui';

interface UpdateStatusFormProps {
  currentStatus: string;
  onUpdate: (newStatus: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'finished', label: 'Finished' },
  { value: 'postponed', label: 'Postponed' },
];

const UpdateMatchScoreForm: React.FC<UpdateStatusFormProps> = ({
  currentStatus,
  onUpdate,
  onCancel,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Match Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || selectedStatus === currentStatus}
        >
          {isLoading ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateMatchScoreForm;
