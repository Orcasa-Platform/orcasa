import ImageSlider from '@/components/home/image-slider';

import HeroSection from './hero-section';
import ModulesSection from './modules-section';
import RecommendSection from './recommend-section';
import SolutionsSection from './solutions-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImageSlider />
      <ModulesSection />
      <SolutionsSection />
      <div
        className="relative h-[408px] w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/plant.jpg')" }}
      />
      <RecommendSection />
    </>
  );
}
