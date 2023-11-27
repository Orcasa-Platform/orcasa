'use client';

import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, CircleSlash } from 'lucide-react';
import { z } from 'zod';

import { postOrganizations } from '@/types/generated/organization';
import { OrganizationRequest } from '@/types/generated/strapi.schemas';

import { useFormGetFields } from '@/hooks/networks/forms';

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

type ZodField =
  | z.ZodString
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodOptional<z.ZodString>
  | z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;

export type Field = {
  label: string;
  required?: boolean;
  zod: ZodField;
  description?: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: { label: string; value: string }[];
  maxSize?: number;
  placeholder?: string;
};

export default function OrganisationForm() {
  const { organizationTypes, organizationThemes, countries } = useFormGetFields() || {};
  const OtherId = organizationTypes?.find((type) => type?.name === 'Other')?.id?.toString();
  const hasData = organizationTypes && organizationThemes && countries;
  const [error, setError] = useState<AxiosError | undefined>();
  const fields: { [key: string]: Field } | undefined = hasData && {
    user_email: {
      label: 'User email',
      required: true,
      zod: z.string().nonempty('User email').email('Please, enter a valid email.').max(150, {
        message: 'Email is limited to 150 characters.',
      }),
      type: 'text',
      maxSize: 150,
    },
    name: {
      label: 'Organisation name',
      required: true,
      zod: z.string().nonempty('Organisation name is mandatory.').max(150, {
        message: 'Organisation name is limited to 150 characters.',
      }),
      description: "Please, add the acronym first. E.g. CEA - Commissariat à l'Energie Atomique.",
      type: 'text',
    },
    organization_type: {
      label: 'Organisation type',
      required: true,
      zod: z.enum(organizationTypes?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      options: organizationTypes.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    organization_type_other: {
      label: 'Organisation type: Other',
      required: true,
      placeholder: 'Please, specify a type',
      zod: z
        .string()
        .max(150, {
          message: 'Organisation type: Other is limited to 150 characters.',
        })
        .optional(),
      type: 'text',
      maxSize: 150,
    },
    main_organization_theme: {
      label: 'Main thematic',
      zod: z
        .enum(organizationThemes?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: organizationThemes.map((theme) => ({
        label: theme?.name,
        value: theme?.id?.toString(),
      })),
    },
    secondary_organization_theme: {
      label: 'Secondary thematic',
      zod: z
        .enum(organizationThemes?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: organizationThemes.map((theme) => ({
        label: theme?.name,
        value: theme?.id?.toString(),
      })),
    },
    short_description: {
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
      zod: z
        .enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: countries.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
    },
    url: {
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
  const formSchema = z
    .object(
      (fields ? Object.keys(fields) : []).reduce((acc: { [key: string]: Field['zod'] }, field) => {
        if (fields) {
          acc[field] = fields[field].zod;
        }
        return acc;
      }, {}),
    )
    .superRefine(({ organization_type, organization_type_other }, refinementContext) => {
      if (organization_type === OtherId && typeof organization_type_other === 'undefined') {
        return refinementContext.addIssue({
          code: 'custom',
          message: 'Organisation type: Other is mandatory when the organisation type is Other.',
          path: ['organization_type_other'],
        });
      }
      return refinementContext;
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  if (!hasData || !fields) {
    return null;
  }

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    postOrganizations({
      data,
    } as unknown as OrganizationRequest)
      .then(() => {
        router.push(`/network/new/organisation/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
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
            {!!error && (
              <div className="mt-3 flex w-full gap-3 rounded-md bg-pink-50 p-4 text-red-700">
                <CircleSlash className="relative h-5 w-5" />
                <div className="text-sm">
                  <div className="mb-2 font-semibold">Something went wrong</div>
                  <div className="text-gray-600">{error?.message}</div>
                </div>
              </div>
            )}
            <div className="font-serif text-2xl leading-10 text-gray-700">
              Organisation information
            </div>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            {Object.keys(fields).map((key) => {
              if (
                key === 'organization_type_other' &&
                form.watch('organization_type') !== OtherId
              ) {
                return null;
              }
              const { label, required, type, options, placeholder, maxSize, description } =
                fields[key];
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
                          placeholder={placeholder}
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
