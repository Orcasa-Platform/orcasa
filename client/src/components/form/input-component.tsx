import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { type Field } from './types';

const InputComponent = ({
  field,
  type,
  required,
  options,
  maxSize,
  placeholder,
  id,
  index,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  form,
  variant,
  label,
}: {
  field: ControllerRenderProps<
    {
      [x: string]: string | string[] | undefined;
    },
    string
  >;
  type: Field['type'];
  required?: Field['required'];
  options?: Field['options'];
  maxSize?: Field['maxSize'];
  placeholder?: Field['placeholder'];
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  index?: number;
  name: string;
  label?: string;
  form: UseFormReturn<
    { [K in string | `projects.${string}` | 'projects']?: string | Date | undefined },
    string,
    undefined
  >;
  variant?: 'network-organization' | 'network-project';
}) => {
  const { watch, register } = form;
  const { name, onChange, value } = field;
  if (type === 'select') {
    const registerProjectsField =
      id && variant === 'network-organization' ? register(`projects.${index}.${name}`) : undefined;
    return (
      <Select
        name={name}
        onValueChange={onChange}
        defaultValue={value as string | undefined}
        {...registerProjectsField}
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
    const watchField = watch(name) as string;
    const counterId = `${name} - counter`;
    const hasError: boolean = !!watchField && !!maxSize && watchField.length > maxSize;
    return (
      <>
        <Textarea
          {...field}
          value={value ?? ''}
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
  if (type === 'multiselect') {
    return (
      <MultiCombobox
        id={id}
        name={label}
        value={(value as string[]) ?? []}
        ariaDescribedBy={ariaDescribedBy}
        ariaInvalid={!!ariaInvalid}
        onChange={onChange}
        variant={variant}
        options={options ?? []}
        showSelected
      />
    );
  }
  if (type === 'date') {
    const startDate = form.watch('start_date');
    const endDate = form.watch('end_date');
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="vanilla"
            size="auto"
            className={cn(
              'relative w-full justify-start border border-gray-300 p-4 pr-12 text-base focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[3px] data-[state=open]:border-gray-400',
              { 'border-destructive': ariaInvalid },
            )}
            id={id}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon />
              {value ? (
                format({ id: 'formatDate', value })
              ) : (
                <span className="text-gray-500">Select date</span>
              )}
            </span>
            <ChevronDown className="absolute right-4 top-4 h-6 w-6 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[330px] overflow-y-auto rounded-none p-0 text-base shadow-md"
          side="bottom"
          sideOffset={-1}
          align="start"
        >
          <Calendar
            initialFocus
            variant="project-date"
            mode="single"
            captionLayout="dropdown-buttons"
            defaultMonth={value ? new Date(value as string) : undefined}
            // `fromDate` and `toDate` are required to allow the user to quickly jump
            // between years and months (see the `captionLayout` prop)
            fromDate={
              name === 'start_date' || !startDate
                ? new Date(+new Date() - 100 * 365 * 24 * 3600 * 1000)
                : // We're making sure the user can't select the same date in both date
                  // pickers because the API considers the max date as exclusive
                  new Date(+new Date(startDate) + 24 * 3600 * 1000)
            }
            toDate={
              name === 'end_date' || !endDate
                ? new Date(+new Date() + 100 * 365 * 24 * 3600 * 1000)
                : // We're making sure the user can't select the same date in both date
                  // pickers because the API considers the max date as exclusive
                  new Date(+new Date(endDate) - 24 * 3600 * 1000)
            }
            selected={value ? new Date(value as string) : undefined}
            onSelect={(date: Date | undefined) =>
              onChange(
                date
                  ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
                      2,
                      '0',
                    )}-${`${date.getDate()}`.padStart(2, '0')}`
                  : undefined,
              )
            }
          />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Input
      {...field}
      value={value ?? ''}
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
