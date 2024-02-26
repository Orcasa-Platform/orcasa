'use client';

import { Pencil } from 'lucide-react';

import { useGetNetworkSuggestion } from '@/types/generated/network-suggestion';

import { Button } from '@/components/ui/button';

const SuggestButton = ({
  data,
  id,
  label,
}: {
  data: { name: string };
  id: number;
  label: 'project' | 'organisation';
}) => {
  const networkEmails = useGetNetworkSuggestion();
  const emails = networkEmails.data?.data?.attributes?.edit_suggestion_email_recipients as
    | string[]
    | undefined;
  if (!emails) return null;
  return (
    <Button variant="secondary" asChild>
      <a
        href={`mailto:${emails.join(',')}?subject=${encodeURIComponent(
          `Impact4Soil - Network - Change suggestion for ${label} "${data.name}", ID: ${id}`,
        )}&body=${encodeURIComponent(
          `Kindly provide comprehensive details below regarding the changes you'd like to suggest. Include your name, your affiliated organisation, and an email address for potential contact. Thank you for assisting us in keeping the Soil Carbon Network up-to-date! Sincerely, The Impact4Soil Team.`,
        )}`}
      >
        <Pencil className="mr-2 h-6 w-6" />
        Suggest changes
      </a>
    </Button>
  );
};

export default SuggestButton;
