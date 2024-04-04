import { useRef } from 'react';

import { useForm, ControllerRenderProps } from 'react-hook-form';
import ReactQuill from 'react-quill';

import InputComponent from '@/components/form/input-component';
import {
  FormDescription,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Field } from './types';

const RenderField = ({
  id,
  index,
  fields,
  form,
}: {
  id: string;
  index?: number;
  fields: {
    [x: string]: Omit<Field, 'options'> & {
      options?: Field['options'] | (() => undefined | { label: string; value: string }[]);
    };
  };
  form: ReturnType<typeof useForm>;
}) => {
  const field = fields[id];
  const {
    label,
    required,
    type,
    options,
    placeholder,
    maxSize,
    description,
    richEditorConfig,
    allowSelectAll,
    validationDependantField,
  } = field;
  const richEditorRef = useRef<ReactQuill | null>(null);

  return (
    <FormField
      key={id}
      name={id}
      control={form.control}
      render={(f) => {
        const { field } = f;
        return (
          <FormItem>
            <FormLabel
              className="flex justify-between"
              {...(type === 'wysiwyg' ? { onClick: () => richEditorRef?.current?.focus() } : {})}
            >
              <span className="text-gray-300">
                {label}
                {required && (
                  <>
                    {' '}
                    <span className="text-red-500">*</span>
                  </>
                )}
              </span>
              {!required && <span className="text-sm text-gray-300">Optional</span>}
            </FormLabel>
            <FormControl>
              <InputComponent
                field={
                  field as unknown as ControllerRenderProps<
                    { [x: string]: string | string[] | undefined },
                    string
                  >
                }
                variant="dark"
                key={id}
                index={index}
                name={id}
                validationDependantField={validationDependantField}
                label={type === 'multiselect' ? label : id}
                type={type}
                allowSelectAll={allowSelectAll}
                required={required}
                options={Array.isArray(options) || options === undefined ? options : options()}
                form={form}
                ref={richEditorRef}
                richEditorConfig={richEditorConfig}
                maxSize={maxSize}
                placeholder={placeholder}
              />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage className="max-w-[632px]" />
          </FormItem>
        );
      }}
    />
  );
};

export default RenderField;
