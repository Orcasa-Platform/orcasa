export type ZodField =
  | z.ZodString
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodOptional<z.ZodString>
  | z.ZodOptional<z.ZodEnum<[string, ...string[]]>>
  | z.ZodOptional<z.ZodDate>
  | z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>
  | z.ZodDate;

export type Field = {
  label: string;
  labelDescription?: string | React.ReactNode;
  required?: boolean;
  zod: ZodField;
  description?: string | React.ReactNode;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'email' | 'date' | 'wysiwyg';
  options?: { label: string; value: string; disabled?: boolean; description?: string }[];
  maxSize?: number;
  allowSelectAll?: boolean;
  richEditorConfig?: ReactQuill.QuillOptions;
  placeholder?: string;
  // The onBlur of the current field will trigger the validation of the connected field
  // This is made for interconnected dependant fields
  validationDependantField?: string;
};
