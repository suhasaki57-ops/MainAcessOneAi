import { Header } from '../common/Header';
import { Footer } from '../common/Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
