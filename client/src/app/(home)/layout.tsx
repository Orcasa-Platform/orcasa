import Footer from '@/components/home/footer';
import NavBar from '@/components/home/nav-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed h-screen w-screen overflow-x-hidden overflow-y-scroll bg-white"
      id="main-scroll"
    >
      <NavBar />
      <div className="mt-[56px] space-y-8 bg-white lg:mt-[60px] lg:space-y-20">
        {children}
        <Footer />
      </div>
    </div>
  );
}
