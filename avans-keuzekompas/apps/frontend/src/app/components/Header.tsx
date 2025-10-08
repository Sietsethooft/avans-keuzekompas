'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Header() {
  const router = useRouter();

  // Laad Bootstrap JS (dropdowns) alleen op de client
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="navbar navbar-expand-lg bg-white border-bottom px-4 py-2 position-fixed w-100 top-0 z-3">
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
        <div className="dropdown">
          <button
            className={`btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 px-3 py-1 ${styles.avansProfileBtn}`}
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className={`bi bi-person-circle ${styles.profileIcon}`}></i>
            <span className="fw-semibold">Profiel</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link href="/profile" className="dropdown-item">
                Profiel
              </Link>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Uitloggen
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}