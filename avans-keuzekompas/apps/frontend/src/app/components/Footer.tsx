import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <span>© Avans Hogeschool, 2025</span>
          <nav className={styles.nav}>
            <Link href="/electives" className={styles.link}>Keuzemodules</Link>
            <Link href="/about" className={styles.link}>About</Link>
          </nav>
        </div>
        <div className={styles.logo}>
          avans <span className={styles.logoSub}>hogeschool</span>
        </div>
      </div>
    </footer>
  );
}