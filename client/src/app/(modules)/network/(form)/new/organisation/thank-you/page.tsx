import NewButtons from '@/components/new-buttons';
import CircleCheck from '@/styles/icons/circle-check.svg';
import Glasses from '@/styles/icons/glasses.svg';
import Upload from '@/styles/icons/upload.svg';

export default async function ThankYouPage() {
  return (
    <div className="flex w-[580px] flex-col space-y-4">
      <h1 className="pt-10 font-serif text-4xl">Organisation submitted!</h1>
      <div className="flex items-center justify-between pb-16 pt-20">
        <div className="flex flex-shrink-0 flex-col items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 p-4">
            <Upload className="h-6 w-6 text-gray-200" />
          </div>
          <span className="text-sm leading-7 text-gray-300">Submitted</span>
        </div>
        <div className="-mt-8 h-px flex-grow border-t border-dashed border-gray-300" />
        <div className="flex flex-shrink-0 flex-col items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 p-4">
            <Glasses className="h-6 w-6 text-gray-200" />
          </div>
          <div className="text-sm leading-7 text-gray-300">Reviewed</div>
        </div>
        <div className="-mt-8 h-px flex-grow border-t border-dashed border-gray-300" />
        <div className="flex flex-shrink-0 flex-col items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 p-4">
            <CircleCheck className="h-6 w-6 text-gray-200" />
          </div>
          <div className="text-sm leading-7 text-gray-300">Published</div>
        </div>
      </div>
      <div className="space-y-4 border-t border-gray-650 pt-8">
        <h2 className="font-serif text-xl text-white">Keep building the network</h2>
        <ul className="mx-6 list-disc text-sm leading-7 text-gray-300">
          <li>
            Associate the organisation to an initiative by suggesting changes on the
            initiative&apos;s details, or
          </li>
          <li>Add new organisations and initiatives to the network</li>
        </ul>
        <NewButtons className="flex justify-end pt-4" />
      </div>
    </div>
  );
}
