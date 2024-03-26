'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname?.split('/').filter((segment) => segment !== '');
  const startCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replaceAll('-', ' ');
  };
  return (
    <nav className="ml-10 pt-6">
      <ul className="flex gap-2 text-sm">
        <li>
          <Link href="/" className="font-semibold">
            Home
          </Link>
        </li>
        <span className="text-gray-500">{'>'}</span>
        {segments?.map((segment, index) => (
          <li key={index} className="text-gray-500">
            <Link href={`/${segments.slice(0, index + 1).join('/')}`}>{startCase(segment)}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
