'use client';

import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, CircleSlash } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/classnames';

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
  description?: string | React.ReactNode;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'email';
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
      label: 'Email',
      required: true,
      zod: z.string().nonempty('User email').email('Please, enter a valid email.').max(255, {
        message: 'Email is limited to 255 characters.',
      }),
      type: 'email',
    },
    name: {
      label: 'Organisation name',
      required: true,
      zod: z.string().nonempty('Organisation name is mandatory.').max(255, {
        message: 'Organisation name is limited to 255 characters.',
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
        .max(255, {
          message: 'Organisation type: Other is limited to 255 characters.',
        })
        .optional(),
      type: 'text',
      maxSize: 255,
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
      description: (
        <div className="leading-normal text-gray-500">
          Accepted URLs format:
          <ul className="ml-4 list-disc">
            <li>https://irc-orcasa.eu/ or https://www.irc-orcasa.eu/</li>
            <li>www.irc-orcasa.eu/</li>
            <li>irc-orcasa.eu/</li>
          </ul>
        </div>
      ),
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
    const normalizedData = {
      ...data,
      url: !data.url || data.url.startsWith('http') ? data.url : `https://${data.url}`,
    };
    postOrganizations({
      data: normalizedData,
    } as unknown as OrganizationRequest)
      .then(() => {
        router.push(`/network/new/organisation/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
  };

  const renderField = (key: string) => {
    const { label, required, type, options, placeholder, maxSize, description } = fields[key];
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
                required={required}
                options={options}
                watch={form.watch}
                maxSize={maxSize}
                placeholder={placeholder}
              />
            </FormControl>
            <FormDescription className="text-sm text-slate-500">{description}</FormDescription>
            <FormMessage className="max-w-[632px]" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <>
      <Form {...form}>
        <form
          noValidate
          className="min-w-[632px] max-w-[632px] pb-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="fixed top-0 z-30 -ml-1 w-[calc(632px+8px)] bg-white px-1">
            <div className="mb-2 flex items-center justify-between border-b border-dashed border-gray-300  pb-6 pt-20">
              <h1 className="font-serif text-3.5xl text-blue-500">New Organisation</h1>
              <Button type="submit" variant="primary" className="gap-2 bg-blue-500">
                <Check className="h-6 w-6" />
                <div>Submit</div>
              </Button>
            </div>
            {!!error && (
              <div className="mt-3 flex w-full gap-3 rounded-md bg-pink-50 p-4 text-red-700">
                <CircleSlash className="relative h-5 w-5" />
                <div className="text-sm">
                  <div className="mb-2 font-semibold">Something went wrong</div>
                  <div className="text-gray-600">{error?.message}</div>
                </div>
              </div>
            )}
          </div>
          <div
            className={cn('space-y-6', {
              'mt-36': !error,
              'mt-56': !!error,
            })}
          >
            <div className="font-serif text-2xl leading-10 text-gray-700">
              Organisation information
            </div>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            {Object.keys(fields)
              .filter((f) => f !== 'user_email')
              .map((key) => {
                if (
                  key === 'organization_type_other' &&
                  form.watch('organization_type') !== OtherId
                ) {
                  return null;
                }
                return renderField(key);
              })}
            <div className="mt-10 font-serif text-2xl text-gray-700">Organisation network</div>
            <div>Network Fields</div>
            <div className="space-y-6 border-t border-dashed border-gray-300">
              <div className="mt-6 font-serif text-2xl text-gray-700">Contact Information</div>
              <div className="text-gray-700">
                The information you have added is going to be reviewed and validated. This process
                could require clarifications from our team, please enter your email so we can
                contact you about it.
              </div>
              {renderField('user_email')}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
