import Footer from '@/components/home/footer';
import HomeNavBar from '@/components/home/nav-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed h-screen w-screen overflow-x-hidden overflow-y-scroll bg-white"
      id="main-scroll"
    >
      <HomeNavBar />
      <div className="mt-[72px] space-y-[120px] bg-white">
        {children}
        <Footer />
      </div>
    </div>
  );
}
