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
  required?: boolean;
  zod: ZodField;
  description?: string | React.ReactNode;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'email' | 'date';
  options?: { label: string; value: string; disabled?: boolean }[];
  maxSize?: number;
  placeholder?: string;
};
