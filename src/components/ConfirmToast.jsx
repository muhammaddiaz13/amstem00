import toast from "react-hot-toast";

export const ConfirmToast = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col justify-center p-4 bg-white rounded-xl w-80">
        <p className="text-lg font-semibold mb-4 text-center">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
              toast.success("Task deleted!");
            }}
          >
            Yes
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity
    }
  );
};