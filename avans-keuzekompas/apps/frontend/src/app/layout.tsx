import './global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'Avans-keuzeKompas',
  description: 'Avans-keuzeKompas helpt studenten bij het maken van de juiste studiekeuze. Vind uitgebreide informatie, vergelijk opleidingen en ontdek jouw mogelijkheden bij Avans Hogeschool.',
  keywords: 'Avans, studiekeuze, opleidingen, hogeschool, keuze, studie, kompas, onderwijs, vergelijken, studenten',
  author: 'Avans Hogeschool',
  icons: {
    icon: '/img_logo_web.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/img_logo_web.png" type="image/png" />
      </head>
      <body>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Header />
        <main className="main-container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}