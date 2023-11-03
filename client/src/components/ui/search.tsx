import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from 'rooks';

import { Input } from '@/components/ui/input';
type SearchProps = {
  className?: string;
  containerClassName?: string;
  onChange: (newValue: string) => void;
};

const Search = ({ className, containerClassName, onChange }: SearchProps) => {
  const debouncedOnChange = useDebounce((newValue: string) => {
    onChange(newValue);
  }, 250);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(event.target.value);
  };

  return (
    <Input
      containerClassName={containerClassName}
      className={className}
      type="text"
      aria-label="Search by keyword"
      placeholder="Search by keyword"
      icon={<SearchIcon />}
      onChange={handleInputChange}
    />
  );
};

export { Search };
