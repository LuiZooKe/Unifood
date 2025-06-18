import toast from 'react-hot-toast';

export const notify = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast(msg),
  warning: (msg) =>
    toast(msg, {
      icon: '⚠️',
      style: {
        border: '1px solid #facc15',
        padding: '16px',
        color: '#713200',
      },
      iconTheme: {
        primary: '#facc15',
        secondary: '#FFFAEE',
      },
    }),
};
