'use client';

import { useState } from 'react';

import { SubmitHandler, useForm, useFieldArray, ControllerRenderProps } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, CircleSlash, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/classnames';

import { postOrganizations } from '@/types/generated/organization';
import { OrganizationRequest, OrganizationRequestData } from '@/types/generated/strapi.schemas';

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
  zod?: ZodField | z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
  description?: string | React.ReactNode;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'email';
  options?: { label: string; value: string }[];
  maxSize?: number;
  placeholder?: string;
};

const projectRoleOptions = [
  { label: 'Coordinator', value: 'lead_projects' },
  { label: 'Partner', value: 'partner_projects' },
  { label: 'Funder', value: 'funded_projects' },
];

export default function OrganisationForm() {
  const { organizationTypes, organizationThemes, countries, projects } = useFormGetFields() || {};
  const OtherId = organizationTypes?.find((type) => type?.name === 'Other')?.id?.toString();
  const hasData = organizationTypes && organizationThemes && countries && projects;
  const [error, setError] = useState<AxiosError | undefined>();
  const fields: { [key: string]: Field } | undefined = hasData && {
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
    user_email: {
      label: 'Email',
      required: true,
      zod: z.string().nonempty('User email').email('Please, enter a valid email.').max(255, {
        message: 'Email is limited to 255 characters.',
      }),
      type: 'email',
    },
  };

  const projectFields: { [key: string]: Field } | undefined = hasData && {
    project: {
      label: 'Project',
      // zod will be added from projectsArraySchema
      type: 'select',
      options: projects.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    role: {
      label: 'Role',
      // zod will be added from projectsArraySchema
      type: 'select',
      options: projectRoleOptions,
    },
  };

  const projectsArraySchema = z.array(
    z.object({
      project: z
        .enum(projects?.map((type) => type?.id?.toString()) as [string, ...string[]])
        .optional()
        .superRefine((project, context) => {
          const index = context.path[1];
          const role = watch(`projects.${index}.role`);
          if (!project && !!role) {
            return context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Please, select a project for the role.',
            });
          }
          return context;
        }),

      role: z
        .enum(projectRoleOptions?.map((role) => role.value) as [string, ...string[]])
        .optional()
        .superRefine((role, context) => {
          const index = context.path[1];
          const project = watch(`projects.${index}.project`);
          if (!role && !!project) {
            return context.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Please, select a role for the project.',
            });
          }
          return context;
        }),
    }),
  );

  const formFieldsSchema = fields
    ? Object.keys(fields).reduce((acc: { [key: string]: Field['zod'] }, field) => {
      if (fields) {
        acc[field] = fields[field].zod;
      }
      return acc;
    }, {})
    : {};

  const formSchema = z.object({
    ...formFieldsSchema,
    ...(fields ? { projects: projectsArraySchema } : {}),
  });

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: [
        {
          project: undefined,
          role: undefined,
        },
      ],
    },
  });
  const { control, handleSubmit, watch } = form;

  const {
    append,
    remove,
    fields: projectFormFields,
  } = useFieldArray<FormType>({
    name: 'projects',
    control,
    rules: {
      validate: (value) => {
        if (value.length < 2) {
          return 'More values please';
        }
        return true;
      },
    },
  });

  const router = useRouter();

  if (!hasData || !fields) {
    return null;
  }

  type DataType = Omit<OrganizationRequestData, 'projects'> & {
    projects: { project: string; role: string }[];
  };
  const onSubmit: SubmitHandler<FormType> = (data) => {
    const typedData: DataType = data as unknown as DataType;
    const normalizedData = {
      ...typedData,
      url:
        !typedData.url || typedData.url.startsWith('http')
          ? typedData.url
          : `https://${typedData.url}`,
    };

    type ProjectRole = 'lead_projects' | 'partner_projects' | 'funded_projects';

    const projects: Record<ProjectRole, string[] | undefined> = {
      lead_projects: undefined,
      partner_projects: undefined,
      funded_projects: undefined,
    };

    (normalizedData.projects as { project: string; role: ProjectRole }[]).forEach(
      ({ project: projectData, role: projectRole }) => {
        if (projectData) {
          projects[projectRole] = (projects[projectRole] || []).concat(projectData);
        }
      },
    );

    // clean projects attribute from normalizedData
    delete (normalizedData as typeof data).projects;

    const dataWithProjects = {
      ...normalizedData,
      ...projects,
    };

    postOrganizations({
      data: dataWithProjects,
    } as unknown as OrganizationRequest)
      .then(() => {
        router.push(`/network/new/organisation/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
  };

  const renderField = ({
    key,
    projectNumber,
    id,
    index,
  }: {
    key: string;
    projectNumber?: number;
    id?: string;
    index?: number;
  }) => {
    const isProject = projectNumber !== undefined;
    const field = isProject ? (projectFields?.[key] as Field) : fields[key];
    if (!isProject && !field) return null;
    const { label, required, type, options, placeholder, maxSize, description } = field;
    return (
      <FormField
        key={id || key}
        name={isProject ? `projects.${projectNumber}.${key}` : key}
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
                      { [x: string]: string | undefined },
                      string
                    >
                  }
                  key={id}
                  index={index}
                  name={key}
                  type={type}
                  required={required}
                  options={options}
                  watch={watch}
                  maxSize={maxSize}
                  placeholder={placeholder}
                  register={form.register}
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
              .filter((key) => key !== 'user_email' && !key.startsWith('project'))
              .map((key) => {
                if (key === 'organization_type_other' && watch('organization_type') !== OtherId) {
                  return null;
                }
                return renderField({ key });
              })}
            <h2 className="mt-10 font-serif text-2xl text-gray-700">Organisation network</h2>
            <div className="flex w-full gap-3 rounded-md bg-peach-50 p-4">
              <AlertCircle className="w-min-fit h-5 w-5 pt-0.5 text-peach-700" />
              <div className="flex font-serif text-sm leading-6 text-gray-600">
                If the project you are looking for is not on the list, please use the project form
                after you submit this organisation form.
              </div>
            </div>
            {projectFormFields.map((project, index) => {
              const { id } = project;
              return (
                <div className="mt-10" key={`project-${id}`}>
                  {renderField({ key: 'project', projectNumber: index, id })}
                  {renderField({ key: 'role', projectNumber: index, id })}

                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="secondary"
                    className="flex gap-4"
                  >
                    <Trash2 className="h-6 w-6" />
                    Remove project
                  </Button>
                </div>
              );
            })}
            <div className="flex w-full justify-end">
              <Button
                type="button"
                onClick={() => append({ project: undefined, role: undefined })}
                variant="secondary"
                className="gap-4"
              >
                <Plus className="h-6 w-6" />
                Add another project
              </Button>
            </div>
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
