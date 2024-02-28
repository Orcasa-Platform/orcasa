'use client';

import { useState } from 'react';

import { SubmitHandler, useForm, UseFormReturn, ControllerRenderProps } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, CircleSlash } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/classnames';

import { useIsFormDirty } from '@/store/network';

import { postOrganizations } from '@/types/generated/organization';
import { OrganizationRequest, OrganizationRequestData } from '@/types/generated/strapi.schemas';

import useBeforeUnloadDirtyForm from '@/hooks/navigation';
import { useOrganizationGetFormFields } from '@/hooks/networks/forms';

import InputComponent from '@/components/form/input-component';
import { Field } from '@/components/form/types';
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

export default function OrganisationForm() {
  const { organizationTypes, organizationThemes, countries } = useOrganizationGetFormFields() || {};

  const OtherId = organizationTypes?.find((type) => type?.name === 'Other')?.id?.toString();
  const hasData = organizationTypes && organizationThemes && countries;
  const [error, setError] = useState<AxiosError | undefined>();
  const fieldValues: { [key: string]: Field } = {
    name: {
      label: 'Organisation name',
      required: true,
      zod: z.string().nonempty('Organisation name is mandatory.').max(150, {
        message: 'Organisation name is limited to 150 characters.',
      }),
      description: "Please, add the acronym first. E.g. CEA - Commissariat à l'Energie Atomique.",
      type: 'text',
      maxSize: 150,
    },
    organization_type: {
      label: 'Organisation type',
      required: true,
      zod: z.enum(organizationTypes?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      options: organizationTypes?.map((type) => ({
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
        .optional()
        .superRefine((organizationTypeOther, refinementContext) => {
          const organizationType = watch('organization_type');
          if (
            organizationType === OtherId &&
            (typeof organizationTypeOther === 'undefined' || organizationTypeOther.length === 0)
          ) {
            return refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Organisation type: Other is mandatory when the organisation type is Other.',
            });
          }
          return refinementContext;
        }),
      type: 'text',
      maxSize: 255,
    },
    main_organization_theme: {
      label: 'Main thematic',
      zod: z.enum(organizationThemes?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      options: organizationThemes?.map((theme) => ({
        label: theme?.name,
        value: theme?.id?.toString(),
      })),
      required: true,
    },
    secondary_organization_theme: {
      label: 'Secondary thematic',
      zod: z
        .enum(organizationThemes?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: organizationThemes?.map((theme) => ({
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
      zod: z.enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      options: countries?.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
      required: true,
    },
    url: {
      label: 'Website',
      zod: z
        .string()
        .max(255, {
          message: 'Organisation name is limited to 255 characters.',
        })
        .regex(new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+\\/?$'), {
          message: 'Please, enter a valid URL.',
        })
        .max(255, {
          message: 'Website is limited to 255 characters.',
        }),
      type: 'text',
      maxSize: 255,
      required: true,
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
    user_email: {
      label: 'Email',
      required: true,
      zod: z.string().nonempty('User email').email('Please, enter a valid email.').max(255, {
        message: 'Email is limited to 255 characters.',
      }),
      type: 'email',
    },
  };
  const fields: { [key: string]: Field } | undefined = hasData && fieldValues;

  const formSchema = z.object({
    ...Object.keys(fieldValues).reduce((acc: { [key: string]: Field['zod'] }, field) => {
      if (fieldValues) {
        acc[field] = fieldValues[field].zod;
      }
      return acc;
    }, {}),
  });

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const [, setIsFormDirty] = useIsFormDirty();
  useBeforeUnloadDirtyForm(form);

  const { handleSubmit, watch } = form;

  if (!hasData || !fields) {
    return null;
  }

  type DataType = OrganizationRequestData;
  const onSubmit: SubmitHandler<FormType> = (data) => {
    const typedData: DataType = data as unknown as DataType;
    const normalizedData = {
      ...typedData,
      url:
        !typedData.url || typedData.url.startsWith('http')
          ? typedData.url
          : `https://${typedData.url}`,
    };

    postOrganizations({
      data: normalizedData,
    } as unknown as OrganizationRequest)
      .then(() => {
        setIsFormDirty(false);
        router.push(`/network/new/organisation/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
  };

  const renderField = ({ key, id, index }: { key: string; id?: string; index?: number }) => {
    const field = fields[key];
    if (!field) return null;
    const { label, required, type, options, placeholder, maxSize, description } = field;
    return (
      <FormField
        key={id || key}
        name={key}
        control={form.control}
        render={(f) => {
          const { field } = f;
          return (
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
                  field={
                    field as unknown as ControllerRenderProps<
                      { [x: string]: string | string[] | undefined },
                      string
                    >
                  }
                  variant="network-organization"
                  key={id}
                  index={index}
                  name={key}
                  type={type}
                  required={required}
                  options={options}
                  maxSize={maxSize}
                  placeholder={placeholder}
                  form={
                    form as UseFormReturn<
                      { [x: string]: string | Date | undefined },
                      string,
                      undefined
                    >
                  }
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

  return (
    <>
      <Form {...form}>
        <form
          noValidate
          className="min-w-[632px] max-w-[632px] pb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="fixed top-0 z-30 -ml-1 w-[calc(632px+8px)] bg-white px-1">
            <div className="mb-2 flex items-center justify-between border-b border-dashed border-gray-300 pb-6 pt-20">
              <h1 className="font-serif text-3.5xl text-blue-500">New Organisation</h1>
              <Button type="submit" variant="primary" className="gap-2 bg-blue-500">
                <Check className="h-6 w-6" />
                <div>Submit</div>
              </Button>
            </div>
            {!!error && (
              <div className="mt-3 flex w-full gap-3 rounded-md bg-pink-50 p-4 text-red-700">
                <CircleSlash className="relative h-5 w-5" />
                <div className="text-sm" aria-live="polite">
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
            <h2 className="font-serif text-2xl leading-10 text-gray-700">
              Organisation information
            </h2>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            {Object.keys(fields)
              .filter((key) => key !== 'user_email')
              .map((key) => {
                if (key === 'organization_type_other' && watch('organization_type') !== OtherId) {
                  return null;
                }
                return renderField({ key });
              })}
            <div className="space-y-6 border-t border-dashed border-gray-300">
              <h2 className="mt-6 font-serif text-2xl text-gray-700">Contact Information</h2>
              <div className="text-gray-700">
                The information you have added is going to be reviewed and validated. This process
                could require clarifications from our team, please enter your email so we can
                contact you about it.
              </div>
              {renderField({ key: 'user_email' })}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
