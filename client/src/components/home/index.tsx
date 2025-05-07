import ImageSlider from '@/components/home/image-slider';

import HeroSection from './hero-section';
import ModulesSection from './modules-section';
import RecommendSection from './recommend-section';
import SolutionsSection from './solutions-section';
import UsersSection from './users-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ModulesSection />
      <div className="lg:hidden">
        <ImageSlider isMobile />
      </div>
      <div className="hidden lg:block">
        <ImageSlider />
      </div>
      <UsersSection />
      <SolutionsSection />
      <div
        className="relative !mt-0 h-[605px] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/plant.jpg')" }}
      />
      <RecommendSection />
    </>
  );
}
