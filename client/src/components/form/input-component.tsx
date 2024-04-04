import React from 'react';

import { ControllerRenderProps, useForm } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { ComboboxProps, MultiCombobox } from '@/components/ui/multi-combobox';
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

const ReactQuill = typeof window !== 'undefined' ? require('react-quill') : undefined;

interface InputComponentProps {
  field: ControllerRenderProps<{ [x: string]: string | string[] | undefined }, string>;
  type: Field['type'];
  required?: Field['required'];
  allowSelectAll?: boolean;
  options?: Field['options'];
  maxSize?: Field['maxSize'];
  placeholder?: Field['placeholder'];
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  index?: number;
  name: string;
  label?: string;
  form: ReturnType<typeof useForm>;
  variant?: ComboboxProps<unknown>['variant'];
  richEditorConfig?: typeof ReactQuill.QuillOptions;
  validationDependantField?: string;
}

const InputComponent = React.forwardRef<typeof ReactQuill, InputComponentProps>((props, ref) => {
  const {
    field,
    type,
    required,
    options,
    maxSize,
    placeholder,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    form,
    variant,
    label,
    richEditorConfig,
    allowSelectAll,
    validationDependantField,
  } = props;

  const { watch } = form;
  const { name, onChange, value } = field;
  if (type === 'wysiwyg' && window !== undefined) {
    const watchField = watch(name) as string;
    const counterId = `${name} - counter`;
    const onlyTextCount = watchField?.replace(/<[^>]*>?/gm, '').length || 0;
    const hasError: boolean = !!watchField && !!maxSize && +onlyTextCount > maxSize;
    return (
      <>
        <ReactQuill
          {...field}
          id={id}
          tabIndex={0}
          ref={ref}
          theme="snow"
          onKeyDown={(e: React.KeyboardEvent) => {
            // On esc key press, blur the editor for accessibility
            if (e.key === 'Escape' && typeof ref === 'object' && ref !== null && 'current' in ref) {
              ref?.current?.blur();
            }
          }}
          preserveWhitespace
          {...richEditorConfig}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!ariaInvalid}
        />
        {maxSize && (
          <div
            id={counterId}
            className={cn('text-xs text-gray-300', {
              'text-red-500': hasError,
            })}
          >
            {watchField ? onlyTextCount : '0'} / {maxSize}
          </div>
        )}
      </>
    );
  }

  if (type === 'select') {
    return (
      <Select
        onValueChange={onChange}
        defaultValue={value as string | undefined}
        required={required}
      >
        <SelectTrigger
          id={id}
          name={name}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!ariaInvalid}
          className="h-10 text-sm"
        >
          <span className="max-w-full truncate">
            <SelectValue placeholder={placeholder || 'Select'} />
          </span>
        </SelectTrigger>
        <SelectContent variant={variant} className="w-[var(--radix-select-trigger-width)]">
          {options?.map(({ label, value, disabled, description }) => (
            <SelectItem
              key={value}
              value={value}
              disabled={disabled}
              variant={variant}
              description={description}
              className="w-full"
            >
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
            className={cn('text-xs text-gray-300', {
              'text-red-500': hasError,
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
        allowSelectAll={allowSelectAll}
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
              'group relative flex h-10 w-full justify-between rounded-lg border border-gray-500 bg-gray-700 px-3 py-2 text-left text-base hover:!bg-gray-700 focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-green-700 data-[state=open]:border-gray-400',
              { 'border-red-500': ariaInvalid },
            )}
            id={id}
          >
            <span className="text-white">
              {value ? format({ id: 'formatDate', value }) : 'Select date'}
            </span>
            <ChevronDown className="absolute right-4 top-1/2 h-6 w-6 flex-shrink-0 -translate-y-1/2 group-data-[state=open]:rotate-180" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="my-2.5 w-[330px] overflow-y-auto rounded-lg border border-gray-400 bg-gray-650 p-0 text-base shadow-none"
          side="bottom"
          sideOffset={-1}
          align="start"
        >
          <Calendar
            initialFocus
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
      onBlur={() => {
        if (validationDependantField) {
          form.trigger(validationDependantField);
          form.trigger(field.name);
        }
        field.onBlur();
      }}
      className="text-sm"
    />
  );
});

InputComponent.displayName = 'InputComponent';

export default InputComponent;
