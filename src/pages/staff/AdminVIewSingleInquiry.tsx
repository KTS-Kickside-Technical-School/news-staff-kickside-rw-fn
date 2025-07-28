import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  adminViewSingleInquiry,
  markInquiryAsRead,
} from '../../utils/requests/inquiryRequest';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  MdOutlineMarkEmailRead,
  MdOutlinePendingActions,
} from 'react-icons/md';
import { AiOutlinePrinter } from 'react-icons/ai';

const AdminViewSingleInquiry = () => {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);

  const fetchSingleInquiry = async () => {
    try {
      const response = await adminViewSingleInquiry(id || '');
      if (response?.data?.inquiry) {
        setInquiry(response.data.inquiry);
      } else {
        toast.error('Inquiry not found!');
      }
    } catch (error) {
      console.error('Error fetching single inquiry:', error);
      toast.error('Failed to fetch single inquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    setMarkingRead(true);
    try {
      await markInquiryAsRead(id || '');
      toast.success('Inquiry marked as read successfully!');
      fetchSingleInquiry();
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
      toast.error('Failed to mark inquiry as read');
    } finally {
      setMarkingRead(false);
    }
  };

  useEffect(() => {
    fetchSingleInquiry();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Inquiry Details</h1>

      {loading ? (
        <div>
          <Skeleton height={30} width={200} className="mb-2" />
          <Skeleton height={20} count={4} className="mb-2" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              <strong>Status:</strong>{' '}
              {inquiry?.status === 'solved' ? (
                <span className="text-green-600 flex items-center gap-2">
                  <MdOutlineMarkEmailRead /> Solved
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-2">
                  <MdOutlinePendingActions /> Pending
                </span>
              )}
            </h2>
          </div>
          <p className="mb-2">
            <strong>Name:</strong> {inquiry?.firstName} {inquiry?.lastName}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {inquiry?.email}
          </p>
          <p className="mb-4">
            <strong>Message:</strong> {inquiry?.message}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              <AiOutlinePrinter /> Print Inquiry
            </button>
            {inquiry.status !== 'solved' && (
              <button
                onClick={handleMarkAsRead}
                disabled={markingRead}
                className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                  markingRead
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {markingRead ? (
                  'Marking...'
                ) : (
                  <>
                    <MdOutlineMarkEmailRead /> Mark as Read
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewSingleInquiry;
