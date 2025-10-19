import Link from "next/link";
import Image from "next/image";

export default function Index() {
  return (
    <div className={`container py-5`}>
      <div className="row d-flex align-items-center" style={{ minHeight: 400 }}>
        <div className="col-lg-7 mb-4 mb-lg-0">
          <h1 className="display-4 fw-bold mb-3 avans-color">
            Welkom bij AvansKompas
          </h1>
          <p className="lead text-secondary mb-4">
            Dé digitale gids voor het kiezen van jouw keuzemodules bij Avans Hogeschool.
            Ontdek, vergelijk en beheer eenvoudig modules die passen bij jouw studie en interesses.
          </p>
          <ul className="list-unstyled mb-4">
            <li className="mb-2">
              <i className="bi bi-search text-danger me-2"></i>
              Zoek en filter modules op locatie, periode, taal en niveau.
            </li>
            <li className="mb-2">
              <i className="bi bi-heart text-danger me-2"></i>
              Sla favorieten op en ontvang persoonlijke aanbevelingen.
            </li>
            <li className="mb-2">
              <i className="bi bi-person-circle text-danger me-2"></i>
              Beheer je profiel en voorkeuren veilig en eenvoudig.
            </li>
          </ul>
          <div className="d-flex gap-3">
            <Link href="/electives" className="btn btn-danger btn-lg avans-background-btn">
              <i className="bi bi-search me-2"></i> Ontdek modules
            </Link>
            <Link href="/profile" className="btn btn-outline-secondary btn-lg">
              <i className="bi bi-person me-2"></i> Mijn profiel
            </Link>
          </div>
        </div>
        <div className="mt-3 col-lg-5 d-flex flex-column justify-content-center align-items-center">
          <Image
            src="/img_students.png"
            alt="Studenten kiezen modules"
            width={270}
            height={180}
            className="img-fluid rounded shadow"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}