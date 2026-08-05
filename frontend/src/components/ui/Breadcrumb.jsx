import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 mb-4">
      <Link to="/dashboard" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
        <FiHome className="text-sm" /> Dashboard
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center gap-2">
            <FiChevronRight className="text-slate-600 text-xs" />
            {isLast ? (
              <span className="font-semibold text-slate-200">{formatted}</span>
            ) : (
              <Link to={to} className="hover:text-cyan-400 transition-colors">
                {formatted}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
