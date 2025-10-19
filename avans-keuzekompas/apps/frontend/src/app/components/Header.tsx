/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function decodeJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  // Re-check token and fetch user on route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthed(!!token);

    if (token) {
      const payload = decodeJwt(token);
      const userId =
        payload?.sub ||
        payload?.id ||
        payload?.userId ||
        payload?._id ||
        localStorage.getItem("userId") ||
        null;

      if (userId) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`;
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data?.data?.firstName) setFirstName(data.data.firstName);
            else setFirstName(null);
          })
          .catch(() => setFirstName(null));
      } else {
        setFirstName(null);
      }
    } else {
      setFirstName(null);
    }
  }, [pathname]);

  // Cross-tab updates
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') setIsAuthed(!!e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthed(false);
    setFirstName(null);
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

        {/* Rechts: login of profiel */}
        {isAuthed ? (
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 px-3 py-1 ${styles.avansProfileBtn}`}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className={`bi bi-person-circle ${styles.profileIcon}`}></i>
              <span className="fw-semibold">{firstName ?? "Profiel"}</span>
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
        ) : (
          <div className={`d-flex align-items-center gap-3`}>
            <Link
              href="/login"
              className={`btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-1 ${styles.avansLoginBtn}`}
            >
              <span className="fw-semibold">Inloggen</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}