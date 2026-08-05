import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

export const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-8xl font-black text-cyan-500 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md">
          The requested page could not be located. It might have been moved or does not exist.
        </p>
        <Link to={ROUTES.HOME}>
          <Button className="mt-2">Back to Home</Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
