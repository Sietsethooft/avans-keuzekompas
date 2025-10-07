import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom px-4 py-2 position-fixed w-100 top-0">
      <div className="container-fluid d-flex align-items-center">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src="/img_logo.png" alt="Avans logo" width={130} height={40} className="mt-1" />
        </Link>
        {/* Navigatie */}
        <nav className="ms-4 flex-grow-1">
          <ul className="navbar-nav flex-row gap-4">
            <li className="nav-item">
              <Link href="/electives" className={`nav-link fw-semibold ${styles.navLink}`}>Keuzemodules</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className={`nav-link fw-semibold ${styles.navLink}`}>About</Link>
            </li>
          </ul>
        </nav>
        <div className="d-flex align-items-center gap-3">
          {/* Profiel */}
          <Link
            href="/profile"
            className={`mt-1 btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-1 ${styles.avansProfileBtn}`}
          >
            <span className={`bi bi-person-circle ${styles.profileIcon}`}></span>
            <span className="fw-semibold">Sietse</span>
          </Link>
        </div>
      </div>
    </header>
  );
}