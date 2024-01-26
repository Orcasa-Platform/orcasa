import Footer from '@/components/home/footer';
import NavBar from '@/components/home/nav-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed h-screen w-screen overflow-x-hidden overflow-y-scroll bg-white"
      id="main-scroll"
    >
      <NavBar />
      <div className="mt-[72px] space-y-8 bg-white lg:space-y-[120px]">
        {children}
        <Footer />
      </div>
    </div>
  );
}
