import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Shared';

export const NotFound = () => {
  useEffect(() => {
    document.title = "404 — VaultScope";
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center pt-32 pb-24">
      <p className="text-xs font-medium text-foreground/25 uppercase tracking-widest mb-6">404</p>
      <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-6 leading-[0.9] max-w-lg">
        Page not found.
      </h1>
      <p className="text-lg text-foreground/40 font-light mb-12 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
};
