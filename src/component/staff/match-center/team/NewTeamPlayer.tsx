import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ICountry, ITeam } from '../../../../utils/types/Tournaments';
import SEO from '../../../../utils/SEO';
import { uploadImageToCloudinary } from '../../../../utils/helpers/cloudinary';
import { toast } from 'react-toastify';
import { playerPositions } from '../../../../utils/helpers/teamHelpers';

interface NewTeamPlayerProps {
  countries: ICountry[];
  team: ITeam;
  newPlayer: any;
  setNewPlayer: (val: any) => void;
  setShowModal: (val: boolean) => void;
  handleCreatePlayer: () => void;
}

const NewTeamPlayer = ({
  countries,
  team,
  newPlayer,
  setNewPlayer,
  setShowModal,
  handleCreatePlayer,
}: NewTeamPlayerProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Foot preference options
  const footOptions = ['Right', 'Left', 'Both'];

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress (in a real implementation, you'd use axios with onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const { url } = await uploadImageToCloudinary(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      return url;
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

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
        setNewPlayer({ ...newPlayer, image: url });
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    },
    [handleImageUpload, newPlayer, setNewPlayer]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <>
      <SEO mainData={{ title: 'New Team Player' }} />
      <div className="fixed inset-0 bg-gray-500 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-fadeIn border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <img
              src={team.logo}
              alt={team.name}
              className="w-14 h-14 rounded-lg object-contain"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Player to {team.name}
              </h2>
              <p className="text-gray-600 text-sm">
                Fill in the player details below
              </p>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-5 bg-blue-500 rounded-full mr-2"></span>
                Personal Information
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">First Name *</label>
              <input
                type="text"
                value={newPlayer.firstName}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, firstName: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Last Name *</label>
              <input
                type="text"
                value={newPlayer.lastName}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, lastName: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Nationality</label>
              <select
                value={newPlayer.nationality}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, nationality: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Nationality</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Birth Date</label>
              <input
                type="date"
                value={newPlayer.dateOfBirth}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, dateOfBirth: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={newPlayer.height}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, height: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 185"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Weight (kg)</label>
              <input
                type="number"
                min="40"
                max="120"
                value={newPlayer.weight}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, weight: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 75"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Preferred Foot</label>
              <select
                value={newPlayer.preferredFoot}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, preferredFoot: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select preferred foot</option>
                {footOptions.map((foot) => (
                  <option key={foot} value={foot}>
                    {foot}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Information Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-5 bg-green-500 rounded-full mr-2"></span>
                Team Information
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Jersey Number</label>
              <input
                type="number"
                min="1"
                max="99"
                value={newPlayer.jerseyNumber}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, jerseyNumber: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Position</label>
              <select
                value={newPlayer.position}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, position: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select position</option>
                {playerPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Player Value (RWF)
              </label>
              <input
                type="number"
                value={newPlayer.playerValue}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, playerValue: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 5000000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Contract Status</label>
              <select
                value={newPlayer.contractStatus}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, contractStatus: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Loaned">Loaned</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Stint Details Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-5 bg-purple-500 rounded-full mr-2"></span>
                Contract Details
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                value={newPlayer.contractStartDate}
                onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    contractStartDate: e.target.value,
                  })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                value={newPlayer.contractEndDate}
                onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    contractEndDate: e.target.value,
                  })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isStillPlaying"
                checked={newPlayer.isStillPlaying || false}
                onChange={(e) =>
                  setNewPlayer({
                    ...newPlayer,
                    isStillPlaying: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-500 bg-gray-50 border-gray-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="isStillPlaying" className="text-sm text-gray-600">
                Still Playing for this team
              </label>
            </div>

            {/* Player Image Upload Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-5 bg-yellow-500 rounded-full mr-2"></span>
                Player Image
              </h3>

              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
              >
                <input {...getInputProps()} />

                {newPlayer.image ? (
                  <div className="w-full text-center">
                    <div className="relative inline-block">
                      <img
                        src={newPlayer.image}
                        alt="Uploaded player"
                        className="max-w-full h-40 object-contain mx-auto mb-4 rounded-lg"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      Click or drag to replace the image
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 mb-3 flex items-center justify-center bg-gray-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-1">
                      {isDragActive
                        ? 'Drop the image here'
                        : 'Drag & drop an image here'}
                    </p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                    <p className="text-gray-400 text-xs mt-2">
                      Max file size: 5MB
                    </p>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 text-center">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePlayer}
              disabled={
                !newPlayer.firstName || !newPlayer.lastName || isUploading
              }
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save Player'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default NewTeamPlayer;
