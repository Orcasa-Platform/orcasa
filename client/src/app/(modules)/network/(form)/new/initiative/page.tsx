'use client';

import { useCallback, useState, useEffect, useRef } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Check } from 'lucide-react';
import { z } from 'zod';

import { useIsFormDirty } from '@/store/network';

import { getProjects, postProjects } from '@/types/generated/project';
import { ProjectRequest, ProjectRequestData } from '@/types/generated/strapi.schemas';

import useBeforeUnloadDirtyForm from '@/hooks/navigation';
import { useValidate } from '@/hooks/networks';
import { useProjectFormGetFields } from '@/hooks/networks/forms';

import RenderField from '@/components/form/render-field';
import { Field } from '@/components/form/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Alert from '@/styles/icons/alert.svg';
import Email from '@/styles/icons/email.svg';
import Info from '@/styles/icons/info.svg';
import Notebook from '@/styles/icons/notebook.svg';
import Users from '@/styles/icons/users.svg';

export default function ProjectForm() {
  const formContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    countries,
    organizations,
    regions,
    areasOfIntervention,
    sustainableDevelopmentGoals,
    projectTypes,
    practices,
    landUseTypes,
  } = useProjectFormGetFields() || {};

  const queryClient = useQueryClient();

  const otherId = areasOfIntervention
    ?.find((type) => type?.name === 'Other (to be specified)')
    ?.id?.toString();
  const hasData =
    countries && organizations && regions && areasOfIntervention && sustainableDevelopmentGoals;
  const [error, setError] = useState<AxiosError | undefined>();
  const secondaryAreasOfIntervention = areasOfIntervention?.filter(
    (type) => type?.id?.toString() !== otherId,
  );

  const fieldValues: {
    [key: string]: Omit<Field, 'options'> & {
      options?:
        | Field['options']
        // Some options of some fields are dynamic (i.e. based on other fields) so here we allow
        // `options` to be a function that returns the list of options
        | (() => undefined | { label: string; value: string }[]);
    };
  } = {
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
        .array(z.enum(organizations?.map((type) => type?.id?.toString()) as [string, ...string[]]))
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
        .array(z.enum(organizations?.map((type) => type?.id?.toString()) as [string, ...string[]]))
        .optional(),
      type: 'multiselect',
      options: organizations?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
    },
    project_coordinator_email: {
      label: 'Generic email',
      zod: z
        .string()
        .email('Please, enter a valid email.')
        .max(255, {
          message: 'Email is limited to 255 characters.',
        })
        .optional()
        .or(z.literal(''))
        .superRefine((value, refinementContext) => {
          const projectCoordinatorWebsite = watch('project_coordinator_website');
          if (value && projectCoordinatorWebsite) {
            return refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Only one of the two fields can be filled: Generic email or Contact url.',
            });
          }
          return refinementContext;
        }),
      type: 'email',
      description:
        'Please use a generic email (e.g., info@initiative.com) and avoid personal emails.',
      validationDependantField: 'project_coordinator_website',
    },
    project_coordinator_website: {
      label: 'Contact url',
      zod: z
        .string()
        .max(255, {
          message: 'Website is limited to 255 characters.',
        })
        .regex(
          new RegExp(
            '^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(\\/[a-zA-Z0-9-]*)*$',
          ),
          {
            message: 'Please, enter a valid URL.',
          },
        )
        .superRefine((value, refinementContext) => {
          const projectCoordinatorEmail = watch('project_coordinator_email');
          if (value && projectCoordinatorEmail) {
            return refinementContext.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Only one of the two fields can be filled: Generic Email or Contact url.',
            });
          }
          return refinementContext;
        })
        .optional()
        .or(z.literal('')),
      type: 'text',
      maxSize: 255,
      description: 'You can paste here the url of the contact section from the initiative website.',
      validationDependantField: 'project_coordinator_email',
    },
    name: {
      label: 'Name',
      required: true,
      zod: z.string().nonempty('Field is required').max(150, {
        message: 'Name is limited to 150 characters.',
      }),
      type: 'text',
      maxSize: 150,
    },
    website: {
      label: 'Website',
      required: true,
      zod: z
        .string()
        .max(255, {
          message: 'Website is limited to 255 characters.',
        })
        .regex(
          new RegExp(
            '^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+(\\/[a-zA-Z0-9-]*)*$',
          ),
          {
            message: 'Please, enter a valid URL.',
          },
        ),
      type: 'text',
      maxSize: 255,
      description: (
        <>
          Accepted URLs format:
          <ul className="ml-4 list-disc">
            <li>https://irc-orcasa.eu/ or https://www.irc-orcasa.eu/</li>
            <li>www.irc-orcasa.eu/</li>
            <li>irc-orcasa.eu/</li>
          </ul>
        </>
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
      label: 'Extended description and outcomes',
      zod: z
        .string()
        .max(3000, {
          message: 'Description is limited to 3000 characters.',
        })
        .optional(),
      type: 'wysiwyg',
      richEditorConfig: {
        modules: {
          toolbar: [[{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        },
        formats: ['list', 'bullet', 'clean'],
      },
      maxSize: 3000,
    },
    project_type: {
      label: 'Initiative type',
      labelDescription: projectTypes?.some(({ description }) => !!description) ? (
        <>
          <h1 className="font-serif text-2xl leading-10">Initiative types</h1>
          {projectTypes
            ?.filter(({ description }) => !!description)
            .map(({ name, description }) => (
              <div key={name}>
                <h2 className="mb-2 text-sm font-semibold leading-7">{name}</h2>
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-650">{description}</p>
              </div>
            ))}
        </>
      ) : undefined,
      zod: z.enum(projectTypes?.map((type) => type.id.toString()) as [string, ...string[]]),
      type: 'select',
      options: projectTypes?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
      required: true,
    },
    practices: {
      label: 'Practices',
      zod: z
        .array(
          z.enum(practices?.map((practice) => practice.id.toString()) as [string, ...string[]]),
        )
        .optional(),
      type: 'multiselect',
      allowSelectAll: false,
      options: practices?.map((practice) => ({
        label: practice.title,
        value: practice.id.toString(),
      })),
      required: false,
    },
    land_use_types: {
      label: 'Land use types',
      zod: z
        .array(z.enum(landUseTypes?.map((type) => type?.id?.toString()) as [string, ...string[]]))
        .optional(),
      type: 'multiselect',
      options: landUseTypes?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      })),
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
      zod: z.enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]]),
      type: 'select',
      required: true,
      options: countries?.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
    },
    region_of_interventions: {
      label: 'Region of intervention',
      zod: z
        .array(z.enum(regions?.map((type) => type?.id?.toString()) as [string, ...string[]]))
        .optional(),
      type: 'multiselect',
      options: regions?.map((region) => ({
        label: region?.name,
        value: region?.id?.toString(),
      })),
    },
    country_of_interventions: {
      label: 'Country of intervention',
      zod: z
        .array(z.enum(countries?.map((type) => type?.id?.toString()) as [string, ...string[]]))
        .optional(),
      type: 'multiselect',
      options: countries?.map((country) => ({
        label: country?.name,
        value: country?.id?.toString(),
      })),
    },
    main_area_of_intervention: {
      label: 'Main area of intervention',
      zod: z.enum(
        areasOfIntervention?.map((type) => type?.id?.toString()) as [string, ...string[]],
      ),
      type: 'select',
      options: () =>
        areasOfIntervention?.map((area) => ({
          label: area?.name,
          value: area?.id?.toString(),
          disabled:
            area?.id?.toString() === watch('secondary_area_of_intervention') ||
            area?.id?.toString() === watch('third_area_of_intervention'),
        })),
      required: true,
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
            mainArea === otherId &&
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
        .enum(
          secondaryAreasOfIntervention?.map((type) => type?.id?.toString()) as [
            string,
            ...string[],
          ],
        )
        .optional(),
      type: 'select',
      options: () =>
        secondaryAreasOfIntervention?.map((area) => ({
          label: area?.name,
          value: area?.id?.toString(),
          disabled:
            area?.id?.toString() === watch('main_area_of_intervention') ||
            area?.id?.toString() === watch('third_area_of_intervention'),
        })),
    },
    third_area_of_intervention: {
      label: 'Third area of intervention',
      zod: z
        .enum(
          secondaryAreasOfIntervention?.map((type) => type?.id?.toString()) as [
            string,
            ...string[],
          ],
        )
        .optional(),
      type: 'select',
      options: () =>
        secondaryAreasOfIntervention?.map((area) => ({
          label: area?.name,
          value: area?.id?.toString(),
          disabled:
            area?.id?.toString() === watch('main_area_of_intervention') ||
            area?.id?.toString() === watch('secondary_area_of_intervention'),
        })),
    },
    sustainable_development_goals: {
      label: 'Sustainable development goals',
      zod: z
        .array(
          z.enum(
            sustainableDevelopmentGoals?.map((type) => type?.id?.toString()) as [
              string,
              ...string[],
            ],
          ),
        )
        .optional(),
      type: 'multiselect',
      options: sustainableDevelopmentGoals
        ?.sort((a, b) => {
          // Sort by the SDG number
          const numA = parseInt(a?.name?.match(/\d+/)?.[0] || '0', 10);
          const numB = parseInt(b?.name?.match(/\d+/)?.[0] || '0', 10);
          return numA - numB;
        })
        .map((sdg) => ({
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
      description: (
        <div className="mt-6">
          Only the team in charge of the administration of Impact4Soil may access your email. You
          have the right to ask for deletion of your email by writing to:{' '}
          <a href="mailto:impact4soil@groupes.renater.fr" className="font-semibold text-green-700">
            impact4soil@groupes.renater.fr
          </a>
        </div>
      ),
    },
  };

  const fields = hasData && fieldValues;
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
    // Use custom useEffect to set focus and scroll to the first error as the order was failing
    shouldFocusError: false,
  });
  const {
    handleSubmit,
    watch,
    setFocus,
    formState: { errors },
  } = form;

  const validateName = useCallback(
    async (projectName: string | undefined) => {
      if (!projectName) {
        return false;
      }

      const data = await queryClient.fetchQuery({
        queryKey: ['organization', 'count', projectName],
        queryFn: () =>
          getProjects({
            fields: ['id'],
            'pagination[pageSize]': 1,
            filters: {
              name: {
                $eqi: projectName,
              },
            },
          }),
        // Cache the result for 10 minutes
        staleTime: 1000 * 3600 * 10,
      });

      return !(data?.meta?.pagination?.total === 0);
    },
    [queryClient],
  );

  useValidate(form, 'name', validateName, 'That initiative already exists.');

  useEffect(() => {
    const firstError = (Object.keys(errors) as Array<keyof typeof errors>).reduce<
      keyof typeof errors | null
    >((field, a) => {
      const fieldKey = field as keyof typeof errors;
      return !!errors[fieldKey] ? fieldKey : a;
    }, null);

    if (firstError) {
      setFocus(String(firstError));
      const field = document.querySelector(`[name="${firstError}"]`);
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors, setFocus]);

  const router = useRouter();

  const [, setIsFormDirty] = useIsFormDirty();
  useBeforeUnloadDirtyForm(form);

  useEffect(() => {
    if (error) {
      formContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error, formContainerRef]);

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
        setIsFormDirty(false);
        router.push(`/network/new/initiative/thank-you`);
      })
      .catch((err) => {
        setError(err);
        console.error('error', err);
      });
  };

  const renderFields = (fieldsArray: (keyof typeof fields)[]) =>
    Object.keys(fields)
      .filter((key) => fieldsArray.includes(key))
      .map((key) => <RenderField key={key} id={key} form={form} fields={fields} />);
  return (
    <>
      <Form {...form}>
        <form
          noValidate
          className="min-w-[500px] max-w-[500px] pb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="sticky top-0 z-30 -ml-1 w-[calc(500px+8px)] bg-gray-700 px-1">
            <div className="mb-2 flex items-center justify-between pb-4 pt-10">
              <h1 className="font-serif text-4xl">New initiative</h1>
              <Button type="submit" variant="primary" className="gap-2">
                <Check className="h-4 w-4" />
                <span>Submit</span>
              </Button>
            </div>
          </div>
          <div ref={formContainerRef} className="scroll-mt-[108px] space-y-8">
            {!!error && (
              <div className="flex gap-4 rounded-md bg-red-700 p-4 text-sm leading-7 text-white">
                <Alert className="h-6 w-6" />
                <div aria-live="polite">
                  <div className="mb-2 font-semibold">Something went wrong</div>
                  <p>{error?.message}</p>
                </div>
              </div>
            )}
            <div className="text-sm text-gray-300">
              <span>Fields marked with </span>
              <span className="text-red-500">*</span>
              <span> are mandatory.</span>
            </div>
            <div className="flex gap-4 rounded-md bg-gray-650 p-4 text-sm leading-7 text-white">
              <Info className="h-6 w-6 shrink-0" />
              <div>
                If the organisation you are looking for is not on the list, please use the{' '}
                <Link
                  href="/network/new/organisation"
                  className="text-sm font-semibold text-green-700"
                >
                  organisation form
                </Link>{' '}
                to add it first.
              </div>
            </div>
            <h2 className="flex items-center justify-start border-b border-gray-650 pb-4 font-serif text-xl">
              <Users aria-hidden className="mr-2 h-6 w-6" />
              Initiative network
            </h2>
            {renderFields(['lead_partner', 'partners', 'funders'])}
            <h2 className="flex items-center justify-start border-b border-gray-650 pb-4 font-serif text-xl">
              <Email aria-hidden className="mr-2 h-6 w-6" />
              Initiative&apos;s contact
            </h2>
            <p className="text-sm text-gray-300">You can add one of the next options:</p>
            {renderFields(['project_coordinator_email', 'project_coordinator_website'])}
            <h2 className="flex items-center justify-start border-b border-gray-650 pb-4 font-serif text-xl">
              <Notebook aria-hidden className="mr-2 h-6 w-6" />
              Initiative information
            </h2>
            {renderFields([
              'name',
              'website',
              'short_description',
              'description',
              'project_type',
              'practices',
              'start_date',
              'end_date',
              'country_of_coordination',
              'region_of_interventions',
              'country_of_interventions',
              'main_area_of_intervention',
              ...(watch('main_area_of_intervention') === otherId
                ? ['main_area_of_intervention_other']
                : []),
              'secondary_area_of_intervention',
              'third_area_of_intervention',
              'sustainable_development_goals',
              'land_use_types',
            ])}

            <div className="space-y-6">
              <h2 className="flex items-center justify-start border-b border-gray-650 pb-4 font-serif text-xl">
                <Email aria-hidden className="mr-2 h-6 w-6" />
                Contact Information
              </h2>
              <div className="text-sm text-gray-300">
                The information you have added is going to be reviewed and validated. This process
                could require clarifications from our team, please enter your email so we can
                contact you about it.
              </div>
              <RenderField id="user_email" form={form} fields={fields} />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
