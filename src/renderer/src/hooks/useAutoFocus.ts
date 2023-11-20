import { MutableRefObject, useEffect, useRef } from 'react';

const useAutoFocus = (): MutableRefObject<HTMLElement | null> => {
  const inputRef: MutableRefObject<HTMLElement | null> = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return inputRef;
};

export default useAutoFocus;
