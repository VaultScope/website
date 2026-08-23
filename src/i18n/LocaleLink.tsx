import { Link, type LinkProps } from 'react-router-dom';
import { useLanguage } from './context';

export function LocaleLink({ to, ...props }: LinkProps) {
  const { localePath } = useLanguage();
  const resolved = typeof to === 'string' ? localePath(to) : to;
  return <Link to={resolved} {...props} />;
}
