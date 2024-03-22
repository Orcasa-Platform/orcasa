import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink } from 'lucide-react';
import EuropeFlag from 'public/images/europe-flag.svg';
import LinkedinIcon from 'public/images/linkedin-icon.svg';
import MailIcon from 'public/images/mail-icon.svg';
import XIcon from 'public/images/x-icon.svg';

const Footer = () => (
  <div id="about">
    <div className="flex w-full flex-col-reverse items-center justify-center gap-[20px] bg-gray-800 px-10 py-[74px] text-center lg:flex-col lg:text-left">
      <Link
        className="block items-center justify-center gap-2.5 hover:opacity-90 lg:flex"
        href="https://irc-orcasa.eu/"
        target="_blank"
      >
        <div className="inline font-serif text-sm leading-[32px] text-green-700 lg:text-lg lg:leading-[42px]">
          Impact4Soil has been created thanks to the ORCaSa project
        </div>
        <ExternalLink className="relative ml-2 inline h-6 w-6 text-green-700 lg:ml-0" />
      </Link>
      <Link href="https://irc-orcasa.eu/" target="_blank">
        <Image
          src="/images/orcasa-logo-with-text.png"
          alt="ORCaSa logo"
          width={255}
          height={77}
          className="h-[57px] w-[188px] lg:h-[77px] lg:w-[255px]"
        />
        <span className="sr-only">ORCaSa</span>
      </Link>
    </div>
    <div className="flex w-full flex-col items-start justify-between space-y-4 bg-gray-700 px-4 py-8 lg:flex-row lg:items-center lg:space-y-0 lg:px-10">
      <div className="flex flex-col items-start justify-center gap-4 lg:flex-row lg:items-center">
        <EuropeFlag className="h-[48px] min-w-[72px]" />
        <div className="max-w-[543px] text-xs leading-[18px] text-gray-300">
          The ORCaSa project has received funding from the European Union’s Horizon Europe research
          programme under grant agreement n°101059863.
        </div>
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0">
        <div className="flex items-center gap-6 border-white border-opacity-20 pr-5 lg:border-r">
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
            className="border-r border-white border-opacity-20 pl-0 pr-5 text-sm text-white hover:text-gray-100 lg:px-5"
          >
            Legal Details
          </Link>
          <Link href="/personal-data-protection" className="text-sm text-white hover:text-gray-100">
            Personal Data Protection
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
