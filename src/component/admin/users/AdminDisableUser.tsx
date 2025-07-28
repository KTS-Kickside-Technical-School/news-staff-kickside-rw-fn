const AdminDisableUser = ({
  disableReason,
  setDisableReason,
  setShowModal,
  saveDisableReason,
  isFormLoading,
}: any) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          Reason for Disabling User
        </h3>
        <textarea
          className="w-full p-3 border rounded-md outline-0 border-gray-300 focus:border-indigo-500"
          placeholder="Provide a reason for disabling this user..."
          rows={4}
          value={disableReason}
          onChange={(e) => setDisableReason(e.target.value)}
        />
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            onClick={saveDisableReason}
          >
            {isFormLoading ? 'Please wait...' : 'Disable User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDisableUser;
