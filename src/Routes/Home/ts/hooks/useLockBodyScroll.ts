import { useLayoutEffect } from 'react';

const useLockBodyScroll = (ativo: boolean) => {
  useLayoutEffect(() => {
    if (ativo) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';

      return () => {
        const scroll = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scroll || '0') * -1);
      };
    }
  }, [ativo]);
};

export default useLockBodyScroll;
