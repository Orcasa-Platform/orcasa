import { useMemo } from 'react';

import { debounce } from 'lodash';
import { Search as SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
type SearchProps = {
  className?: string;
  onChange: (newValue: string) => void;
};

const Search = ({ className, onChange }: SearchProps) => {
  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: string) => {
        onChange(newValue);
      }, 500),
    [onChange],
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(event.target.value);
  };

  return (
    <Input
      className={className}
      type="text"
      placeholder="Search by keyword"
      icon={<SearchIcon />}
      onChange={handleInputChange}
    />
  );
};

export { Search };
