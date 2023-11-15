import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from 'rooks';

import { Input } from '@/components/ui/input';
type SearchProps = {
  defaultValue?: string;
  className?: string;
  containerClassName?: string;
  onChange: (newValue: string) => void;
};

const Search = ({ defaultValue, className, containerClassName, onChange }: SearchProps) => {
  const debouncedOnChange = useDebounce((newValue: string) => {
    onChange(newValue);
  }, 250);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(event.target.value);
  };

  return (
    <Input
      className={className}
      containerClassName={containerClassName}
      type="text"
      aria-label="Search by keyword"
      placeholder="Search by keyword"
      icon={<SearchIcon />}
      defaultValue={defaultValue}
      onChange={handleInputChange}
    />
  );
};

export { Search };
