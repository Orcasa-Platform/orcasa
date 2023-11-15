/* eslint-disable @next/next/no-img-element */

import { getHomeStats } from '@/types/generated/home-stat';

import ImageSlider from '@/components/home/image-slider';
import HomeNavBar from '@/components/home/nav-bar';

import Footer from './footer';
import HeroSection from './hero-section';
import ModulesSection from './modules-section';
import RecommendSection from './recommend-section';
import SolutionsSection from './solutions-section';

export default async function HomePage() {
  const data = await getHomeStats({ populate: '*' });
  const stats = data?.data?.map((item) => ({
    title: item?.attributes?.title,
    value: item?.attributes?.value,
    class: item?.attributes?.class,
  }));

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-white">
      <HomeNavBar />
      <div className="mt-[72px] space-y-[120px] bg-white">
        <HeroSection stats={stats} />
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
