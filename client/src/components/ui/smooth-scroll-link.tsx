'use client';

import { handleSmoothScroll } from '@/lib/utils/ui';

type SmoothScrollLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const SmoothScrollLink = ({ children, ...rest }: SmoothScrollLinkProps) => (
  <a onClick={handleSmoothScroll} {...rest}>
    {children}
  </a>
);

export default SmoothScrollLink;
