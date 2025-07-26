import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import SEO from '../../utils/SEO';
import {
  userChangePassword,
  userUpdateProfile,
  userViewProfile,
} from '../../utils/requests/authRequest';
import { uploadImageToCloudinary } from '../../utils/helpers/cloudinary';
import { BsCamera } from 'react-icons/bs';
import Avatar from '/avatar.svg';

const Settings = () => {
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const coverImage = '/cover-image.jpg';
  const [profileImage, setProfileImage] = useState(Avatar);
  const [newProfileImage, setNewProfileImage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [originalState, setOriginalState] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    profileImage: '',
  });

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await userViewProfile();
      const user = response.data.user;
      setProfile(user);
      setFirstName(user?.firstName || '');
      setLastName(user?.lastName || '');
      setBio(user?.bio || '');
      setPhone(user?.phone || '');
      setProfileImage(user?.profile || Avatar);
      setOriginalState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        profileImage: user?.profile || Avatar,
      });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const imageUrl = await handleImageUpload(file);
        setNewProfileImage(imageUrl);
      }
    } catch {
      toast.error('Image upload failed. Please try again.');
    }
  };

  const handleImageUpload = async (file: File) => {
    const { url } = await uploadImageToCloudinary(file);
    return url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await userUpdateProfile({
        firstName,
        lastName,
        bio,
        phone,
        profile: newProfileImage || profileImage,
      });
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setOriginalState({
        firstName,
        lastName,
        bio,
        phone,
        profileImage: newProfileImage || profileImage,
      });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      firstName !== originalState.firstName ||
      lastName !== originalState.lastName ||
      bio !== originalState.bio ||
      phone !== originalState.phone ||
      (newProfileImage && newProfileImage !== originalState.profileImage)
    );
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    try {
      const response = await userChangePassword({
        password: currentPassword,
        newPassword,
      });

      if (response.status !== 200) {
        toast.error(response.message || 'Failed to change password.');
        return;
      }

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('An error occurred while changing password.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <SEO mainData={{ title: 'My Profile - Kickside Rwanda Staff' }} />
      <ToastContainer />
      {loadingProfile ? (
        <div className="animate-pulse">
          <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
          <div className="w-24 h-24 bg-gray-300 rounded-full mt-8 mx-auto"></div>
          <div className="space-y-4 mt-8">
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="relative">
            <img
              src={coverImage}
              alt="Cover Image"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <img
                  src={newProfileImage || profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                >
                  <BsCamera />
                </label>
                <input
                  id="profileImage"
                  type="file"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-16">
            <h2 className="text-2xl font-semibold">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-500 mt-2">{bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 pr-3">
                <label className="block text-sm font-semibold text-gray-600">
                  Email
                </label>
                <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 cursor-not-allowed text-gray-700 flex items-center">
                  {profile?.email || 'N/A'}
                </div>
              </div>
              <div className="flex-1 pl-3">
                <label className="block text-sm font-semibold text-gray-600">
                  Rank
                </label>
                <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 cursor-not-allowed text-gray-700 flex items-center">
                  {profile?.rank || 'Not Assigned'}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Role
              </label>
              <div className="mt-1 p-2 border rounded-md w-full bg-gray-100 cursor-not-allowed text-gray-700 flex items-center">
                {profile?.role || 'User'}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!hasChanges() || saving}
                className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-700'
                } text-white`}
              >
                {saving && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="mt-10 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="mt-4 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
