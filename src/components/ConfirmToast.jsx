// Karena react-hot-toast tidak diinstall, kita ubah file ini 
// untuk menggunakan konfirmasi bawaan browser (window.confirm)
// agar tidak menyebabkan error build.

export const ConfirmToast = (message, onConfirm) => {
  // Gunakan confirm bawaan browser
  if (window.confirm(message)) {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
  }
};

export default ConfirmToast;