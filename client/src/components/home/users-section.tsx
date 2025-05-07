'use client';

const usersInfo = {
  'policy-makers':
    'Explore concrete use cases and assess the impact of specific actions on the ground to shape effective policies and monitor activities related to soil health; identify research organizations who could provide with useful data, up to date methods, results, activities, and best practices to take informed decisions.',
  'funding-agencies':
    'Visualize what kind of projects are being funded to be able to promote cooperation and networking, and to identify funders from other countries to cooperate on new calls.',
  researchers:
    'Have a quick and easy access to the most relevant publications in the domain of soil carbon; visualize the impact/effect that different types of interventions/drivers have on soil carbon; see ongoing related projects.',
  ngos: 'Access and share reliable data on soil carbon to support evidence-based decision-making, discover efficient practices to increase soil carbon, promote sustainable practices, and foster collaboration among stakeholders.',
  companies:
    'Visualize the location of experimental trials on soil carbon to identify areas where the effect of agricultural practices on carbon has been extensively studied and areas where it has not; add and edit information about relevant projects and stakeholders; discover efficient practices to increase soil carbon.',
};

const Paragraph = ({ title, slug }: { title: string; slug: keyof typeof usersInfo }) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      {usersInfo[slug] && <p className="text-sm leading-[22px] text-gray-500">{usersInfo[slug]}</p>}
    </div>
  );
};

const UsersSection = () => (
  <div id="users" className="scroll-mt-[100px] px-4 lg:px-0">
    <div className="flex items-center justify-center pb-6 lg:mb-[120px]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center font-serif text-3xl font-semibold text-gray-700 lg:text-left lg:text-3.5xl">
            How can Impact4Soil benefit different users?
          </h2>
        </div>
      </div>
    </div>
    <div className="container relative grid w-full grid-cols-1 gap-8 lg:w-[80%] lg:grid-cols-3 lg:gap-16 xl:w-[1000px]">
      <Paragraph title="Policy makers" slug="policy-makers" />
      <Paragraph title="Funding agencies" slug="funding-agencies" />
      <Paragraph title="Researchers" slug="researchers" />
      <Paragraph title="NGOs" slug="ngos" />
      <Paragraph title="Companies" slug="companies" />
    </div>
  </div>
);

export default UsersSection;
