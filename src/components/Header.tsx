'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [['/', 'Inicio'], ['/grupos', 'Grupos'], ['/llaves', 'Llaves'], ['/metodologia', 'Metodología']];

export function Header() {
  const path = usePathname();
  return (
    <header>
      <div className="wrap hd">
        <Link href="/" className="logo plain">
          <div className="ball">⚽</div>
          <div>MUNDIAL 2026<small>CENTRO DE ANÁLISIS</small></div>
        </Link>
        <nav>
          {LINKS.map(([href, label]) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return <Link key={href} href={href} className={active ? 'active' : ''}>{label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
