"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from '@avans-keuzekompas/types';
import Swal from "sweetalert2";
import "./profile.css";

// Helper for decoding JWT
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

type FavoriteModule = { id: string; title: string };

export default function ProfilePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteModules, setFavoriteModules] = useState<FavoriteModule[]>([]);

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Weet je zeker dat je je account wilt verwijderen?',
      text: 'Deze actie kan niet ongedaan worden gemaakt!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, verwijderen',
      cancelButtonText: 'Annuleren',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!result.isConfirmed || !user) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`;
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await Swal.fire({
          title: 'Account verwijderd',
          text: 'Je account is succesvol verwijderd.',
          icon: 'success',
          confirmButtonColor: '#dc3545',
        });
        localStorage.removeItem('token');
        router.replace('/login');
      } else {
        const data = await res.json();
        await Swal.fire({
          title: 'Verwijderen mislukt',
          text: data?.message || 'Er ging iets mis bij het verwijderen.',
          icon: 'error',
          confirmButtonColor: '#dc3545',
        });
      }
    } catch (err) {
      await Swal.fire({
        title: 'Fout',
        text: 'Kon account niet verwijderen.',
        icon: 'error',
        confirmButtonColor: '#dc3545',
      });
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    let userId: string | null = null;
    if (token) {
      const payload = decodeJwt(token);
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

    if (!token || !userId) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`;
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch (jErr) {
          console.error("[ProfilePage] Could not parse response as JSON:", jErr);
        }

        if (!res.ok || !data || data.status !== 200 || !data.data) {
          const msg = data?.message || "Could not retrieve user data.";
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

        setUser(mappedUser);
        setChecked(true);
        setLoading(false);
      } catch (err) {
        setError("Iets is misgegaan tijdens je profiel laden.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Haal module-titels op
  useEffect(() => {
    const fetchTitles = async () => {
      const token = localStorage.getItem("token");
      if (user?.favorites.length && token) {
        const modules = await Promise.all(
          user.favorites.map(async (id) => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/module/${id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const data = await res.json();
              if (res.ok && data.status === 200 && data.data?.title) {
                return { id, title: data.data.title };
              }
              return { id, title: id };
            } catch {
              return { id, title: id };
            }
          })
        );
        setFavoriteModules(modules);
      } else {
        setFavoriteModules([]);
      }
    };
    fetchTitles();
  }, [user]);

  // Favoriet verwijderen
  const handleRemoveFavorite = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/module/favorite/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    setFavoriteModules((prev) => prev.filter((mod) => mod.id !== id));
    setUser((prev) =>
      prev ? { ...prev, favorites: prev.favorites.filter((favId) => favId !== id) } : prev
    );
  };

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

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* LEFT */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4 position-lg-sticky" style={{ top: "1.5rem" }}>
            {/* Profile card */}
            <div className="card border-0 shadow-sm profile-card overflow-hidden">
              <div className="profile-hero p-4 d-flex align-items-center">
                <div className="avatar-ring me-3">
                  <i className="bi bi-person-fill fs-2 text-white"></i>
                </div>
                <div className="text-white">
                  <h4 className="mb-0 fw-semibold">
                    {user.firstName} {user.lastName}
                  </h4>
                  <small className="opacity-75">{user.role.toUpperCase()}</small>
                </div>
              </div>
              <div className="card-body pt-3">
                <ul className="list-unstyled small mb-3">
                  <li className="mb-2">
                    <i className="bi bi-envelope text-danger me-2"></i>
                    {user.email}
                  </li>
                  <li>
                    <i className="bi bi-card-text text-danger me-2"></i>
                    Studentnummer: {user.studentNumber}
                  </li>
                </ul>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge role-badge rounded-pill">
                    {user.role === "admin" ? "ADMIN" : "STUDENT"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account settings */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0">
                <h6 className="mb-0 fw-semibold">
                  <i className="bi bi-gear me-2 text-danger"></i>Accountinstellingen
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-danger-soft w-100" onClick={handleDeleteAccount}>
                    <i className="bi bi-trash3 me-2"></i> Account verwijderen
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => router.push("/profile/update")}
                  >
                    <i className="bi bi-pencil me-2"></i> Profiel bewerken
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h5 className="mb-0 fw-semibold">
                <i className="bi bi-star-fill text-warning me-2"></i>Favoriete modules
              </h5>
              {favoriteModules.length > 0 && (
                <span className="badge bg-light text-dark">
                  {favoriteModules.length} {favoriteModules.length === 1 ? "favoriete" : "favorieten"}
                </span>
              )}
            </div>
            <div className="card-body">
              {favoriteModules.length > 0 ? (
                <ul className="list-group list-group-flush favorites-list">
                  {favoriteModules.map((mod) => (
                    <li
                      key={mod.id}
                      className="list-group-item border-0 d-flex align-items-center px-0 favorite-item"
                    >
                      <span className="favorite-icon me-3">
                        <i className="bi bi-star-fill text-warning"></i>
                      </span>
                      <span
                        className="flex-grow-1 favorite-title-link"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(`/electives/${mod.id}`)}
                        title={`Bekijk ${mod.title}`}
                      >
                        {mod.title}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Verwijderen uit favorieten"
                        onClick={() => handleRemoveFavorite(mod.id)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state text-center py-5">
                  <div className="empty-icon mb-3">
                    <i className="bi bi-stars fs-1 text-warning"></i>
                  </div>
                  <h6 className="fw-semibold mb-1">Nog geen favorieten</h6>
                  <p className="text-muted small mb-3">
                    Voeg modules toe aan je favorieten om ze hier snel terug te vinden.
                  </p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => router.push("/electives")}
                  >
                    <i className="bi bi-search me-1"></i> Ontdek modules
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}