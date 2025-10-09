"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: number;
  password: string;
  role: "student" | "admin";
  favorites: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId: string | null = null;
    if (token) {
      try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id || payload.userId || null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        userId = null;
      }
    }

    if (!token || !userId) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data || data.status !== 200) {
          setError(data.message || "Kon gebruikersgegevens niet ophalen.");
          setLoading(false);
          return;
        }

        setUser(data.data); // Zorg dat je API { data: { ...user } } terugstuurt
        setLoading(false);
        setChecked(true);
      } catch (err) {
        console.error("Fout bij ophalen user:", err);
        setError("Er ging iets mis bij het laden van het profiel.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-container text-center text-danger">
        <h4>{error}</h4>
      </div>
    );
  }

  if (!checked || !user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.replace("/login");
  };

  return (
    <div className="main-container">
      <div className="container">
        {/* Profielkaart */}
        <div className="card mb-4 custom-shadow border-0">
          <div className="card-body d-flex align-items-center flex-wrap">
            <i
              className="bi bi-person-circle text-danger me-4"
              style={{ fontSize: "4rem" }}
            ></i>
            <div>
              <h3 className="mb-0">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-muted mb-1">
                <i className="bi bi-envelope me-2"></i>
                {user.email}
              </p>
              <p className="text-muted mb-2">
                <i className="bi bi-card-text me-2"></i>
                Studentnummer: {user.studentNumber}
              </p>
              <span
                className={`badge ${
                  user.role === "admin" ? "bg-danger" : "bg-secondary"
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            <div className="ms-auto mt-3 mt-md-0">
              <button
                className="btn btn-outline-danger d-flex align-items-center"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Uitloggen
              </button>
            </div>
          </div>
        </div>

        {/* Favorieten */}
        <div className="card mb-4 custom-shadow border-0">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">
              <i className="bi bi-star-fill text-warning me-2"></i>Favoriete modules
            </h5>
          </div>
          <div className="card-body">
            {user.favorites && user.favorites.length > 0 ? (
              <ul className="list-group list-group-flush">
                {user.favorites.map((fav, index) => (
                  <li key={index} className="list-group-item border-0 ps-0">
                    <i className="bi bi-star text-warning me-2"></i>
                    {fav}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Nog geen favorieten toegevoegd.</p>
            )}
          </div>
        </div>

        {/* Accountinstellingen */}
        <div className="card custom-shadow border-0">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">
              <i className="bi bi-gear me-2"></i>Accountinstellingen
            </h5>
          </div>
          <div className="card-body">
            <button className="btn btn-primary me-3">
              <i className="bi bi-lock me-2"></i> Wachtwoord wijzigen
            </button>
            <button className="btn btn-outline-secondary">
              <i className="bi bi-pencil me-2"></i> Profiel bewerken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}