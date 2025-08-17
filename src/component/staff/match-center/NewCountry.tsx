import { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';
import {
  FaTimes,
  FaFlag,
  FaCode,
  FaCloudUploadAlt,
  FaSpinner,
  FaTrash,
} from 'react-icons/fa';
import { uploadImageToCloudinary } from '../../../utils/helpers/cloudinary';
import SEO from '../../../utils/SEO';

interface CountryFormData {
  name: string;
  code: string;
  flagUrl: string;
}

interface NewCountryProps {
  onClose: () => void;
  onSave: (data: CountryFormData) => Promise<void> | void;
}

const NewCountry = ({ onClose, onSave }: NewCountryProps) => {
  const [formData, setFormData] = useState<CountryFormData>({
    name: '',
    code: '',
    flagUrl: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (file: File) => {
    if (!file?.type?.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const result = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, flagUrl: result.url }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter a country name');
      return;
    }

    if (!formData.code.trim()) {
      setError('Please enter a country code');
      return;
    }

    if (!formData.flagUrl) {
      setError('Please upload a flag image');
      return;
    }

    try {
      setIsUploading(true);
      await onSave(formData);
      setFormData({ name: '', code: '', flagUrl: '' });
      setPreviewImage(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save country');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <SEO
        mainData={{
          title: 'New Country - Kickside News',
          description: 'Create a new country for your sports news website.',
        }}
      />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
            disabled={isUploading}
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Country
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                <span className="flex-grow">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Dismiss error"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country Name
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <FaFlag className="text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Rwanda"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                    required
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country Code
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <FaCode className="text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    id="code"
                    name="code"
                    placeholder="e.g. RW"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent uppercase"
                    maxLength={3}
                    required
                    disabled={isUploading}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  2-3 letter country code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Flag
                </label>
                <div
                  className={`border-2 rounded-xl p-5 text-center transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={!previewImage ? triggerFileInput : undefined}
                >
                  {isUploading && !previewImage ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl mb-2" />
                      <p className="text-sm text-gray-600">
                        Uploading image...
                      </p>
                    </div>
                  ) : previewImage ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-3">
                        <img
                          src={previewImage}
                          alt="Flag preview"
                          className="h-20 w-auto object-contain rounded border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(null);
                            setFormData((prev) => ({ ...prev, flagUrl: '' }));
                          }}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50 text-red-500 transition-colors"
                          disabled={isUploading}
                          aria-label="Remove flag"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        disabled={isUploading}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="cursor-pointer">
                      <FaCloudUploadAlt className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-sm text-gray-600 mb-3">
                        Drag & drop flag image here, or click to browse
                      </p>
                      <div className="text-xs text-gray-500 mb-3">
                        (JPEG, PNG, max 5MB)
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        Select Image
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={
                    isUploading ||
                    !formData.name.trim() ||
                    !formData.code.trim() ||
                    !formData.flagUrl
                  }
                >
                  {isUploading && <FaSpinner className="animate-spin" />}
                  Save Country
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCountry;
