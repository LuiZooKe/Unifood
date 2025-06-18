import { useLayoutEffect } from 'react';

const useLockBodyScroll = (ativo: boolean) => {
  useLayoutEffect(() => {
    if (!ativo) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow || '';
    };
  }, [ativo]);
};

export default useLockBodyScroll;
