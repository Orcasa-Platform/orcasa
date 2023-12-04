import { ControllerRenderProps, UseFormWatch } from 'react-hook-form';

import { cn } from '@/lib/classnames';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { type Field } from './page';

const InputComponent = ({
  field,
  type,
  required,
  options,
  watch,
  maxSize,
  placeholder,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: {
  field: ControllerRenderProps<
    {
      [x: string]: string | undefined;
    },
    string
  >;
  type: Field['type'];
  required?: Field['required'];
  options?: Field['options'];
  maxSize?: Field['maxSize'];
  placeholder?: Field['placeholder'];
  watch: UseFormWatch<{
    [x: string]: string | undefined;
  }>;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}) => {
  if (type === 'select') {
    return (
      <Select
        name={field.name}
        onValueChange={field.onChange}
        defaultValue={field.value}
        required={required}
      >
        <SelectTrigger id={id} aria-describedby={ariaDescribedBy} aria-invalid={!!ariaInvalid}>
          <span className="max-w-full truncate">
            <SelectValue placeholder={placeholder || 'Select'} />
          </span>
        </SelectTrigger>
        <SelectContent className="max-w-[632px]">
          {options?.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (type === 'textarea') {
    const watchField = watch(field.name);
    const counterId = `${field.name}-counter`;
    const hasError: boolean = !!watchField && !!maxSize && watchField.length > maxSize;
    return (
      <>
        <Textarea
          {...field}
          value={field.value ?? ''}
          required={required}
          error={hasError}
          className={cn({ 'min-h-[172px]': maxSize && maxSize > 350 })}
          id={id}
          aria-describedby={ariaDescribedBy ? `${ariaDescribedBy} ${counterId}` : counterId}
          aria-invalid={!!ariaInvalid}
        />
        {maxSize && (
          <div
            id={counterId}
            className={cn('flex justify-end text-sm text-gray-500', {
              'text-destructive': hasError,
            })}
          >
            {watchField ? watchField.length : '0'} / {maxSize}
          </div>
        )}
      </>
    );
  }
  return (
    <Input
      {...field}
      value={field.value ?? ''}
      type={type}
      placeholder={placeholder}
      required={required}
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={!!ariaInvalid}
    />
  );
};

export default InputComponent;
