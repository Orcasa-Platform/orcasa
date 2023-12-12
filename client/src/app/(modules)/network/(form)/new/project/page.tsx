'use client';

import { useState } from 'react';

import { SubmitHandler, useForm, ControllerRenderProps } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, CircleSlash, AlertCircle } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/classnames';

import { postProjects } from '@/types/generated/project';
import { ProjectRequest, ProjectRequestData } from '@/types/generated/strapi.schemas';

import { useProjectFormGetFields } from '@/hooks/networks/forms';

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

const projectRoleOptions = [
  { label: 'Coordinator', value: 'lead_projects' },
  { label: 'Partner', value: 'partner_projects' },
  { label: 'Funder', value: 'funded_projects' },
];

export default function ProjectForm() {
  const { countries, organizations, regions, areasOfIntervention, sustainableDevelopmentGoals } =
    useProjectFormGetFields() || {};
  const OtherId = areasOfIntervention?.find((type) => type?.name === 'Other')?.id?.toString();
  const hasData =
    countries && organizations && regions && areasOfIntervention && sustainableDevelopmentGoals;
  const [error, setError] = useState<AxiosError | undefined>();
  const fieldValues: { [key: string]: Field } = {
    lead_partner: {
      label: 'Coordinator',
      required: true,
      zod: z.enum(organizations?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      options: organizations?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    partners: {
      label: 'Partners',
      zod: z
        .enum(organizations?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'multiselect',
      options: organizations?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    funders: {
      label: 'Funders',
      zod: z
        .enum(organizations?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'multiselect',
      options: organizations?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    project_coordinator_name: {
      label: 'Name',
      zod: z
        .string()
        .max(255, {
          message: 'Name is limited to 255 characters.',
        })
        .optional(),
      type: 'text',
      maxSize: 255,
    },
    project_coordinator_email: {
      label: 'Email',
      zod: z
        .string()
        .email('Please, enter a valid email.')
        .max(255, {
          message: 'Email is limited to 255 characters.',
        })
        .optional(),
      type: 'email',
    },
    second_project_coordinator_name: {
      label: 'Name',
      zod: z
        .string()
        .max(255, {
          message: 'Name is limited to 255 characters.',
        })
        .optional(),
      type: 'text',
      maxSize: 255,
    },
    second_project_coordinator_email: {
      label: 'Email',
      zod: z
        .string()
        .email('Please, enter a valid email.')
        .max(255, {
          message: 'Email is limited to 255 characters.',
        })
        .optional(),
      type: 'email',
    },
    name: {
      label: 'Name',
      required: true,
      zod: z.string().nonempty('Field is required').max(255, {
        message: 'Name is limited to 255 characters.',
      }),
      type: 'text',
      maxSize: 255,
    },
    website: {
      label: 'Website',
      required: true,
      zod: z
        .string()
        .max(255, {
          message: 'Website is limited to 255 characters.',
        })
        .regex(new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+$'), {
          message: 'Please, enter a valid URL.',
        }),
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
    short_description: {
      label: 'Brief description',
      required: true,
      zod: z
        .string()
        .max(350, {
          message: 'Brief description is limited to 350 characters.',
        })
        .nonempty('Field is required'),
      type: 'textarea',
      maxSize: 350,
    },
    description: {
      label: 'Description',
      zod: z
        .string()
        .max(3000, {
          message: 'Description is limited to 3000 characters.',
        })
        .optional(),
      type: 'textarea',
      maxSize: 3000,
    },
    project_type: {
      label: 'Project type',
      zod: z.enum(projectRoleOptions.map((type) => type.value) as [string, ...string[]]),
      type: 'select',
      options: projectRoleOptions,
    },
    start_date: {
      label: 'Start date',
      required: true,
      zod: z.string(),
      type: 'date',
    },
    end_date: {
      label: 'End date',
      zod: z.string().optional(),
      type: 'date',
    },
    country_of_coordination: {
      label: 'Country of coordination',
      zod: z
        .enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: countries?.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
    },
    regions_of_intervention: {
      label: 'Regions of intervention',
      zod: z.enum(regions?.map((type) => type?.id?.toString()) as [string, ...string[]]).optional(),
      type: 'multiselect',
      options: regions?.map((region) => ({
        label: region?.name,
        value: region?.id?.toString(),
      })),
    },
    countries_of_intervention: {
      label: 'Countries of intervention',
      zod: z
        .enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'multiselect',
      options: countries?.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
    },
    main_area_of_intervention: {
      label: 'Main area of intervention',
      zod: z
        .enum(areasOfIntervention?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'select',
      options: areasOfIntervention?.map((area) => ({
        label: area?.name,
        value: area?.id?.toString(),
      })),
    },
    main_area_of_intervention_other: {
      label: 'Main area of intervention: Other',
      required: true,
      placeholder: 'Please, specify a type',
      zod: z
        .string()
        .max(255, {
          message: 'Main area of intervention: Other is limited to 255 characters.',
        })
        .optional()
        .superRefine((mainAreaOther, refinementContext) => {
          const mainArea = watch('main_area_of_intervention');
          if (
            mainArea === OtherId &&
            (typeof mainAreaOther === 'undefined' || mainAreaOther.length === 0)
          ) {
            return refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                'Main area of intervention: Other is mandatory when the main area of intervention is Other.',
            });
          }
          return refinementContext;
        }),
      type: 'text',
      maxSize: 255,
    },
    secondary_area_of_intervention: {
      label: 'Secondary area of intervention',
      zod: z
        .enum(areasOfIntervention?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'multiselect',
      options: areasOfIntervention?.map((area) => ({
        label: area?.name,
        value: area?.id?.toString(),
      })),
    },
    third_area_of_intervention: {
      label: 'Third area of intervention',
      zod: z
        .enum(areasOfIntervention?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional(),
      type: 'multiselect',
      options: areasOfIntervention?.map((area) => ({
        label: area?.name,
        value: area?.id?.toString(),
      })),
    },
    sustainable_development_goal: {
      label: 'Sustainable development goal',
      zod: z
        .enum(
          sustainableDevelopmentGoals?.map((type) => type?.id?.toString()) as [string, ...string[]],
        )
        .optional(),
      type: 'multiselect',
      options: sustainableDevelopmentGoals?.map((sdg) => ({
        label: sdg?.name,
        value: sdg?.id?.toString(),
      })),
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
  const formSchema = z.object(
    Object.keys(fieldValues).reduce((acc: { [key: string]: Field['zod'] }, field) => {
      if (field in fieldValues) {
        acc[field] = fieldValues[field].zod;
      }
      return acc;
    }, {}),
  );

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(fields ? formSchema : z.object({})),
  });
  const { handleSubmit, watch } = form;

  const router = useRouter();

  if (!hasData || !fields) {
    return null;
  }
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const typedData: ProjectRequestData = data as unknown as ProjectRequestData;
    const normalizedData = {
      ...typedData,
      website:
        !typedData.website || typedData.website.startsWith('http')
          ? typedData.website
          : `https://${typedData.website}`,
    };

    postProjects({
      data: normalizedData,
    } as unknown as ProjectRequest)
      .then(() => {
        router.push(`/network/new/project/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
  };

  const renderField = ({ key, id, index }: { key: string; id?: string; index?: number }) => {
    const field = fields[key];
    const { label, required, type, options, placeholder, maxSize, description } = field;
    return (
      <FormField
        key={key}
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
                  variant="network-project"
                  key={id}
                  index={index}
                  name={key}
                  label={type === 'multiselect' ? label : key}
                  type={type}
                  required={required}
                  options={options}
                  form={form}
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
  const renderFields = (fieldsArray: (keyof typeof fields)[]) =>
    Object.keys(fields)
      .filter((key) => fieldsArray.includes(key))
      .map((key) => renderField({ key }));
  return (
    <>
      <Form {...form}>
        <form
          noValidate
          className="min-w-[632px] max-w-[632px] pb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="fixed top-0 z-30 -ml-1 w-[calc(632px+8px)] bg-white px-1">
            <div className="mb-2 flex items-center justify-between border-b border-dashed border-gray-300  pb-6 pt-20">
              <h1 className="font-serif text-3.5xl text-peach-700">New Project</h1>
              <Button type="submit" variant="primary" className="gap-2 bg-peach-700">
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
            <h2 className="font-serif text-2xl leading-10 text-gray-700">Project network</h2>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            <div className="flex w-full gap-3 rounded-md bg-peach-50 p-4">
              <AlertCircle className="w-min-fit h-5 w-5 pt-0.5 text-peach-700" />
              <div className="flex font-serif text-sm leading-6 text-gray-600">
                If the organisation you are looking for is not on the list, please use the
                organisation form to add it first.
              </div>
            </div>
            {renderFields(['lead_partner', 'partners', 'funders'])}
            <h2 className="mt-10 font-serif text-2xl text-gray-700">Coordinator contact details</h2>
            <h3 className="mt-10 font-serif text-base text-gray-700">Project coordinator:</h3>
            {renderFields(['project_coordinator_name', 'project_coordinator_email'])}
            <h3 className="mt-10 font-serif text-base text-gray-700">
              Second project coordinator:
            </h3>
            {renderFields(['second_project_coordinator_name', 'second_project_coordinator_email'])}
            <h2 className="mt-10 font-serif text-2xl text-gray-700">Project information</h2>
            {renderFields([
              'name',
              'website',
              'short_description',
              'description',
              'project_type',
              'start_date',
              'end_date',
              'country_of_coordination',
              'regions_of_intervention',
              'countries_of_intervention',
              'main_area_of_intervention',
              'secondary_area_of_intervention',
              'third_area_of_intervention',
              'sustainable_development_goal',
            ])}

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
