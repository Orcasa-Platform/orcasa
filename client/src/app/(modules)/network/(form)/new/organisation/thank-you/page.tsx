import { Upload, Glasses, CheckCircle } from 'lucide-react';

import NewButtons from '@/components/new-buttons';

export default async function ThankYouPage() {
  return (
    <div className="flex w-[632px] flex-col space-y-4">
      <h1 className="w-[632px] font-serif text-3.5xl text-blue-500">
        Organisation successfully submitted!
      </h1>
      <div className="flex w-full items-center justify-between pb-16 pt-20">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-14 w-14 items-center gap-2 bg-blue-500 p-4">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm text-gray-700">Submitted</div>
        </div>
        <div className="-mt-8 h-px w-[198px] border-t border-blue-500" />
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-14 w-14 items-center gap-2 bg-gray-100 p-4">
            <Glasses className="h-6 w-6 text-gray-300" />
          </div>
          <div className="text-sm text-gray-700">Reviewed</div>
        </div>
        <div className="-mt-8 h-px w-[198px] border-t border-dashed border-gray-300" />
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex h-14 w-14 items-center gap-2 bg-gray-100 p-4">
            <CheckCircle className="h-6 w-6 text-gray-300" />
          </div>
          <div className="text-sm text-gray-700">Published</div>
        </div>
      </div>
      <div className="space-y-6 border-t border-dashed border-gray-300 py-10">
        <div className="font-serif text-2xl leading-10 text-gray-700">
          Keep building the network
        </div>
        <ul className="mx-6 list-disc">
          <li>
            Associate the organisation to an initiative by suggesting changes on the
            initiative&apos;s details, or
          </li>
          <li>Add new organisations and initiatives to the network</li>
        </ul>
        <NewButtons className="ml-0 flex justify-end" />
      </div>
    </div>
  );
}
