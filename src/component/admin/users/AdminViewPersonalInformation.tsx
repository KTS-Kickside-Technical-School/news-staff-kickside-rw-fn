import SEO from '../../../utils/SEO';

const AdminViewPersonalInformation = ({
  isEditing,
  editedUser,
  user,
  handleInputChange,
  formatDateToCustomString,
}: any) => {
  return (
    <>
      <SEO
        mainData={{
          title: `Journalist Personal Information - Admin : Kickside Rwanda`,
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="block w-full border p-2 rounded-md mt-1 outline-0 border-gray-300"
                    value={editedUser.email || user.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {user.email || 'No email'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Rank
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="block w-full border p-2 rounded-md mt-1 outline-0 border-gray-300"
                    value={editedUser.rank || user.rank || ''}
                    onChange={(e) => handleInputChange('rank', e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {user.rank || 'No rank assigned'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    className="block w-full border p-2 rounded-md mt-1 outline-0 border-gray-300 h-24"
                    value={editedUser.bio || user.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                ) : (
                  <p className="mt-1 text-gray-800 whitespace-pre-line">
                    {user.bio || 'No bio available.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {user.isDisabled && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                Account Status
              </h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Account Disabled
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Reason: {user.disableReason || 'No reason provided'}
                      </p>
                      <p className="mt-1">
                        Disabled on: {formatDateToCustomString(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Activity Summary
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="text-gray-800">2 hours ago</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Article Published</p>
                <p className="text-gray-800">3 days ago</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Preferred Working Hours</p>
                <p className="text-gray-800">9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Recent Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">
                  Top performer in Politics category this month
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">
                  Article featured on homepage last week
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">
                  Met 100% of deadlines this quarter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewPersonalInformation;
