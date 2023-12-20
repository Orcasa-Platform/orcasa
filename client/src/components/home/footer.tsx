import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink } from 'lucide-react';
import EuropeFlag from 'public/images/europe-flag.svg';
import LinkedinIcon from 'public/images/linkedin-icon.svg';
import MailIcon from 'public/images/mail-icon.svg';
import XIcon from 'public/images/x-icon.svg';

const Footer = () => (
  <div id="about">
    <div className="flex w-full flex-col items-center justify-center gap-[20px] bg-gray-800 px-10 py-[74px]">
      <Link
        className="flex items-center justify-center gap-2.5 hover:opacity-90"
        href="https://irc-orcasa.eu/"
        target="_blank"
      >
        <div className="font-serif text-lg leading-[42px] text-green-700">
          Impact4Soil has been created thanks to the ORCaSa project
        </div>
        <ExternalLink className="relative h-6 w-6 text-green-700" />
      </Link>
      <Link href="https://irc-orcasa.eu/" target="_blank">
        <Image src="/images/orcasa-logo-with-text.png" alt="ORCaSa logo" width={255} height={77} />
        <span className="sr-only">ORCaSa</span>
      </Link>
    </div>
    <div className="flex w-full items-center justify-between bg-gray-700 px-10 py-8">
      <div className="flex items-center justify-center gap-4">
        <EuropeFlag className="h-[48px] min-w-[72px]" />
        <div className="max-w-[543px] text-xs leading-[18px] text-gray-300">
          Impact4Soil has been developed in the framework of ORCaSa project which received funding
          from the European Union’s Horizon Europe research programme under grant agreement
          n°101059863.
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center gap-6 border-r border-white border-opacity-20 pr-5">
          <Link href="https://twitter.com/IRC_ORCaSa" target="_blank">
            <XIcon className="min-w-4 h-4 w-4" />
            <span className="sr-only">X</span>
          </Link>
          <Link
            href="https://www.linkedin.com/showcase/orcasa-project-irc/?viewAsMember=true"
            target="_blank"
          >
            <LinkedinIcon className="min-w-4 h-4 w-4" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="#">
            <MailIcon className="min-w-5 h-4 w-5 hover:opacity-90" />
          </Link>
        </div>
        <div className="flex items-center justify-start gap-4">
          <Link
            href="/legal-details"
            className="border-r border-white border-opacity-20 px-5 text-sm text-white hover:text-gray-100"
          >
            Legal Details
          </Link>
          <Link href="/personal-data" className="text-sm text-white hover:text-gray-100">
            Personal Data Protection
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
