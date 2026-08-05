import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Unauthorized = () => {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-8xl font-black text-amber-500 tracking-tighter">403</h1>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 text-sm max-w-md">
          You do not possess the required authorization to view this page or resource.
        </p>
        <Link to="/profile">
          <Button className="mt-2">Back to My Profile</Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
