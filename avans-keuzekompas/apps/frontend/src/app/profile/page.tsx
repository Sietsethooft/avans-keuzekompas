"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string | number;
  password: string;
  role: "student" | "admin";
  favorites: string[];
}

// Helper voor veilig decoden van JWT (base64url)
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
  } catch (e) {
    console.error("[ProfilePage] Fout bij decoden JWT:", e);
    return null;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[ProfilePage] useEffect start");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("[ProfilePage] Token gevonden?", !!token);

    let userId: string | null = null;

    if (token) {
      const payload = decodeJwt(token);
      console.log("[ProfilePage] JWT payload:", payload);
      if (payload) {
        userId =
          payload.sub ||
          payload.id ||
          payload.userId ||
          payload._id ||
          localStorage.getItem("userId") ||
          null;
      }
    }

    console.log("[ProfilePage] Afgeleide userId:", userId);

    if (!token || !userId) {
      console.warn("[ProfilePage] Geen geldige token of userId -> redirect /login");
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}`;
      console.log("[ProfilePage] Fetch start:", url);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("[ProfilePage] HTTP status:", res.status);

        let data: any = null;
        try {
          data = await res.json();
        } catch (jErr) {
          console.error("[ProfilePage] Kon response niet parsen als JSON:", jErr);
        }
        console.log("[ProfilePage] Response JSON:", data);

        if (!res.ok || !data || data.status !== 200 || !data.data) {
          const msg = data?.message || "Kon gebruikersgegevens niet ophalen.";
            console.error("[ProfilePage] Foutstatus:", msg);
          setError(msg);
          setLoading(false);
          return;
        }

        const apiUser = data.data;
        const mappedUser: User = {
          id: apiUser._id || apiUser.id || apiUser.userId,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          email: apiUser.email,
          studentNumber: apiUser.studentNumber,
          password: apiUser.password ?? "",
          role: apiUser.role,
          favorites: apiUser.favorites || [],
        };

        console.log("[ProfilePage] Mapped user object:", mappedUser);
        setUser(mappedUser);
        setChecked(true);
        setLoading(false);
        console.log("[ProfilePage] User succesvol gezet");
      } catch (err) {
        console.error("[ProfilePage] Fetch exception:", err);
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
    console.log("[ProfilePage] Niet klaar om te renderen. checked:", checked, "user:", user);
    return null;
  }

  return (
    <div className="">
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