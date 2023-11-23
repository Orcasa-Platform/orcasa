'use client';

import { SubmitHandler } from 'react-hook-form';

import { Check } from 'lucide-react';
import { z } from 'zod';

import {
  useFormGetOrganizationTypes,
  type Field,
  useGetForm,
  useFormGetThemes,
  useFormGetCountries,
} from '@/hooks/networks/forms';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import InputComponent from './input-component';

export default function OrganisationForm() {
  const organizationTypes = useFormGetOrganizationTypes();
  const organizationThemes = useFormGetThemes();
  const countries = useFormGetCountries();
  const hasData = organizationTypes && organizationThemes;
  const fields: { [key: string]: Field } | undefined = hasData && {
    'organisation-name': {
      label: 'Organisation name',
      required: true,
      zod: z.string().nonempty('Organisation name is mandatory.').max(150, {
        message: 'Organisation name is limited to 150 characters.',
      }),
      description: "Please, add the acronym first. E.g. CEA - Commissariat à l'Energie Atomique.",
      type: 'text',
    },
    'organisation-type': {
      label: 'Organisation type',
      required: true,
      zod: z.enum(organizationTypes).optional(),
      type: 'select',
      options: organizationTypes?.map((type) => ({ label: type, value: type })),
    },
    'main-thematic': {
      label: 'Main thematic',
      zod: z.enum(organizationThemes).optional(),
      type: 'select',
      options: organizationThemes?.map((theme) => ({ label: theme, value: theme })),
    },
    'secondary-thematic': {
      label: 'Secondary thematic',
      zod: z.enum(organizationThemes).optional(),
      type: 'select',
      options: organizationThemes?.map((theme) => ({ label: theme, value: theme })),
    },
    'short-description': {
      label: 'Brief description',
      required: true,
      zod: z.string().nonempty('Field is required').max(350, {
        message: 'Brief description is limited to 350 characters.',
      }),
      type: 'textarea',
      maxSize: 350,
    },
    description: {
      label: 'Extended description',
      zod: z
        .string()
        .max(3000, {
          message: 'Extended description is limited to 3000 characters.',
        })
        .optional(),
      type: 'textarea',
      maxSize: 3000,
    },
    country: {
      label: 'Country',
      zod: z.enum(countries).optional(),
      type: 'select',
      options: countries?.map((country) => ({ label: country, value: country })),
    },
    website: {
      label: 'Website',
      zod: z
        .string()
        .max(255, {
          message: 'Organisation name is limited to 255 characters.',
        })
        .regex(new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+$'), {
          message: 'Please, enter a valid URL.',
        })
        .max(255, {
          message: 'Website is limited to 255 characters.',
        })
        .optional(),
      type: 'text',
      maxSize: 255,
    },
  };

  const [form, schema] = useGetForm(fields);
  if (!hasData || !fields) {
    return null;
  }

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    // TODO: submit data
    console.log(data);
    return data;
  };

  return (
    <>
      <Form {...form}>
        <form className="min-w-[632px] max-w-[632px]" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-2 flex w-full items-center justify-between border-b border-dashed border-gray-300 pb-6">
            <h1 className="font-serif text-3.5xl text-blue-500">New Organisation</h1>
            <Button type="submit" variant="primary" className="gap-2 bg-blue-500">
              <Check className="h-6 w-6" />
              <div>Submit</div>
            </Button>
          </div>
          <div className="space-y-6">
            <div className="font-serif text-2xl leading-10 text-gray-700">
              Organisation information
            </div>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            {Object.keys(fields).map((key) => {
              const { type, label, required, description, options, maxSize } = fields[key];
              return (
                <FormField
                  key={key}
                  name={key}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between">
                        <span>
                          {label}
                          {required && (
                            <>
                              {' '}
                              <span className="text-red-700">*</span>
                            </>
                          )}
                        </span>
                        {!required && <span className="text-sm text-gray-700">Optional</span>}
                      </FormLabel>
                      <FormControl>
                        <InputComponent
                          field={field}
                          type={type}
                          options={options}
                          watch={form.watch}
                          maxSize={maxSize}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-slate-500">
                        {description}
                      </FormDescription>
                      <FormMessage className="max-w-[632px]" />
                    </FormItem>
                  )}
                />
              );
            })}
            <div>Fields</div>
            <div className="mt-10 font-serif text-2xl text-gray-700">Organisation network</div>
            <div>Network Fields</div>
          </div>
        </form>
      </Form>
    </>
  );
}
