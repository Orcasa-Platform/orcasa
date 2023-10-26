import { MutableRefObject, useCallback, useEffect, useState } from 'react';

export const useIsOverTwoLines = (
  ref: MutableRefObject<HTMLDivElement | null>,
  hasEllipsis = false,
) => {
  const [isOverTwoLines, setIsOverTwoLines] = useState(false);

  const checkIsOverTwoLines = useCallback(() => {
    const getBoundingClientRect = ref.current?.getBoundingClientRect();

    const { height } = getBoundingClientRect || {};
    let lineHeight;
    const style = ref.current && window.getComputedStyle(ref.current);
    if (style) {
      lineHeight = parseFloat(style.lineHeight) * 2;
    }
    setIsOverTwoLines(!!(height && lineHeight && height > lineHeight));
  }, [ref]);

  useEffect(() => {
    if (hasEllipsis) {
      checkIsOverTwoLines();
      window.addEventListener('resize', checkIsOverTwoLines);

      return () => {
        window.removeEventListener('resize', checkIsOverTwoLines);
      };
    }
  }, [checkIsOverTwoLines, hasEllipsis]);

  return isOverTwoLines;
};
