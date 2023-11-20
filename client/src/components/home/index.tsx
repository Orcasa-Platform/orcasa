import ImageSlider from '@/components/home/image-slider';
import HomeNavBar from '@/components/home/nav-bar';

import Footer from './footer';
import HeroSection from './hero-section';
import ModulesSection from './modules-section';
import RecommendSection from './recommend-section';
import SolutionsSection from './solutions-section';
export default function HomePage() {
  return (
    <div
      className="fixed h-screen w-screen overflow-x-hidden overflow-y-scroll bg-white"
      id="main-scroll"
    >
      <HomeNavBar />
      <div className="mt-[72px] space-y-[120px] bg-white">
        <HeroSection />
        <ImageSlider />
        <ModulesSection />
        <SolutionsSection />
        <div
          className="relative h-[408px] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/plant.jpg')" }}
        />
        <RecommendSection />
        <Footer />
      </div>
    </div>
  );
}
