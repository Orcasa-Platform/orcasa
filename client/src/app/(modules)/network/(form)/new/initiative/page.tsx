'use client';

import { useCallback, useState, useEffect } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AlertCircle, Check, CircleSlash, Info } from 'lucide-react';
import { z } from 'zod';

import { cn } from '@/lib/classnames';

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
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ProjectForm() {
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

  const [openInfo, setInfoOpen] = useState(false);
  const handleInfoClick = () => setInfoOpen((prevOpen) => !prevOpen);
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
    project_coordinator_website: {
      label: 'Website',
      zod: z
        .string()
        .max(255, {
          message: 'Website is limited to 255 characters.',
        })
        .regex(new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+\\/?$'), {
          message: 'Please, enter a valid URL.',
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
        .regex(new RegExp('^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+\\/?$'), {
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
      zod: z.enum(projectTypes?.map((type) => type.id.toString()) as [string, ...string[]]),
      type: 'select',
      options: projectTypes?.map((type) => ({
        label: type.name,
        value: type.id.toString(),
        description: type.description,
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
      .map((key) => (
        <RenderField key={key} id={key} form={form} fields={fields} variant="network-initiative" />
      ));
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
              <h1 className="font-serif text-3.5xl text-peach-700">New Initiative</h1>
              <Button
                type="submit"
                variant="primary"
                className="gap-2 bg-peach-700 hover:bg-peach-900"
              >
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
            <h2 className="font-serif text-2xl leading-10 text-gray-700">Initiative network</h2>
            <div className="text-gray-700">
              <span>Fields marked with </span>
              <span className="text-red-700">*</span>
              <span> are mandatory.</span>
            </div>
            <div className="flex w-full gap-3 rounded-md bg-peach-50 p-4">
              <AlertCircle className="w-min-fit h-5 w-5 pt-0.5 text-peach-700" />
              <div className="font-serif text-sm leading-6 text-gray-600">
                If the organisation you are looking for is not on the list, please use the{' '}
                <Link
                  href="/network/new/organisation"
                  className="text-sm font-semibold text-peach-700"
                >
                  organisation form
                </Link>{' '}
                to add it first.
              </div>
            </div>
            {renderFields(['lead_partner', 'partners', 'funders'])}
            <h2 className="mt-10 flex items-center gap-2 font-serif text-2xl text-gray-700">
              Manager contact details
              <TooltipProvider>
                <Tooltip delayDuration={0} open={openInfo} onOpenChange={setInfoOpen}>
                  <TooltipTrigger asChild onClick={handleInfoClick}>
                    <Button type="button" size="auto" variant="icon">
                      <span className="sr-only">Coordinator contact details info</span>
                      <Info />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent variant="dark" className="max-w-[227px] font-sans">
                    <p>Contact details of the person responsible for initiative management.</p>
                    <TooltipArrow variant="dark" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h2>
            <h3 className="mt-10 font-serif text-base font-semibold text-gray-700">
              Initiative manager:
            </h3>
            {renderFields(['project_coordinator_email', 'project_coordinator_website'])}
            <h2 className="mt-10 font-serif text-2xl text-gray-700">Initiative information</h2>
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

            <div className="space-y-6 border-t border-dashed border-gray-300">
              <h2 className="mt-6 font-serif text-2xl text-gray-700">Contact Information</h2>
              <div className="text-gray-700">
                The information you have added is going to be reviewed and validated. This process
                could require clarifications from our team, please enter your email so we can
                contact you about it.
              </div>
              <RenderField
                id="user_email"
                form={form}
                fields={fields}
                variant="network-initiative"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
