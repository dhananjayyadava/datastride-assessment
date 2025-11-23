import { X } from "lucide-react";

const LogoutModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Confirm Logout</h3>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
