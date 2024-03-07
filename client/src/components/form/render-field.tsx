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
  variant,
}: {
  id: string;
  index?: number;
  fields: {
    [x: string]: Omit<Field, 'options'> & {
      options?: Field['options'] | (() => undefined | { label: string; value: string }[]);
    };
  };
  form: ReturnType<typeof useForm>;
  variant: 'network-initiative' | 'network-organization';
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
  const Label = () => {
    const labelContent = (
      <>
        {label}
        {required && (
          <>
            {' '}
            <span className="text-red-700">*</span>
          </>
        )}
      </>
    );
    return type === 'wysiwyg' ? (
      <button
        type="button"
        className="cursor-default"
        onClick={() => richEditorRef?.current?.focus()}
      >
        {labelContent}
      </button>
    ) : (
      <span>{labelContent}</span>
    );
  };
  return (
    <FormField
      key={id}
      name={id}
      control={form.control}
      render={(f) => {
        const { field } = f;
        return (
          <FormItem>
            <FormLabel className="flex justify-between">
              <Label />
              {!required && <span className="text-sm text-gray-700">Optional</span>}
            </FormLabel>
            <FormControl>
              <InputComponent
                field={
                  field as unknown as ControllerRenderProps<
                    { [x: string]: string | string[] | undefined },
                    string
                  >
                }
                variant={variant}
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
            <FormDescription className="text-sm text-slate-500">{description}</FormDescription>
            <FormMessage className="max-w-[632px]" />
          </FormItem>
        );
      }}
    />
  );
};

export default RenderField;
