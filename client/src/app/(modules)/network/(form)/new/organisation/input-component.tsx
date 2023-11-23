import { ControllerRenderProps, UseFormWatch } from 'react-hook-form';

import { cn } from '@/lib/classnames';

import { type Field } from '@/hooks/networks/forms';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const InputComponent = ({
  field,
  type,
  options,
  watch,
  maxSize,
}: {
  field: ControllerRenderProps<
    {
      [x: string]: string | undefined;
    },
    string
  >;
  type: Field['type'];
  options?: Field['options'];
  watch: UseFormWatch<{
    [x: string]: string | undefined;
  }>;
  maxSize?: number;
}) => {
  if (type === 'select') {
    return (
      <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger>
          <div className="max-w-full truncate">
            <SelectValue />
          </div>
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
    return (
      <>
        <Textarea {...field} />
        {maxSize && (
          <div
            className={cn('flex justify-end text-sm text-gray-500', {
              'text-red-500': watchField && watchField.length > maxSize,
            })}
          >
            {watchField ? watchField.length : '0'} / {maxSize}
          </div>
        )}
      </>
    );
  }
  return <Input {...field} />;
};

export default InputComponent;
