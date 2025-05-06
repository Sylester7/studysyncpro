import { Toaster } from 'react-hot-toast';

export const toastConfig = {
  position: 'top-right',
  duration: 4000,
  style: {
    background: '#333',
    color: '#fff',
  },
};

export const ToastContainer = () => (
  <Toaster
    position={toastConfig.position}
    toastOptions={{
      duration: toastConfig.duration,
      style: toastConfig.style,
    }}
  />
); 