import { useCallback, useRef, useState } from 'react';

import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from 'rooks';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Cross from '@/styles/icons/cross.svg';
type SearchProps = {
  defaultValue?: string;
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
};

const Search = ({
  defaultValue = '',
  className,
  containerClassName,
  placeholder = 'Search by keyword',
  onChange,
}: SearchProps) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedOnChange = useDebounce((newValue: string) => {
    onChange(newValue);
  }, 250);

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setValue(value);
      debouncedOnChange(value);
    },
    [setValue, debouncedOnChange],
  );

  const onClearInput = useCallback(() => {
    setValue('');
    debouncedOnChange('');
    inputRef.current?.focus();
  }, [setValue, debouncedOnChange, inputRef]);

  return (
    <div className={cn('relative', containerClassName)}>
      <Input
        ref={inputRef}
        className={cn('pr-14 search-cancel:hidden', className)}
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        icon={<SearchIcon />}
        value={value}
        onChange={onChangeInput}
      />
      {value.length > 0 && (
        <Button
          type="button"
          size="icon-sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
          onClick={onClearInput}
        >
          <span className="sr-only">Clear search</span>
          <Cross className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export { Search };
