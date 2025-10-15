"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Module } from "@avans-keuzekompas/types";
import styles from './page.module.css';

type FavoritesStore = { modules: string[] };
type JwtPayload = { sub: string; role?: string; exp?: number; iat?: number };

function readFavorites(): FavoritesStore {
  if (typeof window === 'undefined') return { modules: [] };
  try {
    const raw = localStorage.getItem('favorites:modules');
    if (!raw) return { modules: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.modules)) return { modules: [] };
    return { modules: parsed.modules as string[] };
  } catch {
    return { modules: [] };
  }
}

function writeFavorites(store: FavoritesStore) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('favorites:modules', JSON.stringify(store));
}

function decodeJwt<T>(token: string): T | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

// Kleine helper om API JSON te halen (ondersteunt jouw jsonResponse envelope)
async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
  }
  const isEnvelope = typeof data === 'object' && 'status' in data && 'data' in data;
  return (isEnvelope ? (data.data as T) : (data as T));
}

export default function ElectiveDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [mod, setMod] = useState<Module | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const shareUrl = useMemo(() => (typeof window === 'undefined' ? '' : window.location.href), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setAdminFromToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }
      const payload = decodeJwt<JwtPayload>(token);
      const isExpired = payload?.exp ? Date.now() / 1000 >= payload.exp : false;
      setIsAdmin(!isExpired && payload?.role === 'admin');
    };

    setAdminFromToken();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') setAdminFromToken();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!id) return;

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module/${encodeURIComponent(String(id))}`;
        const payload = await fetchJson<Module>(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        setMod(payload);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error(e);
          setError(e?.message || 'Kon module niet laden.');
          setMod(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, router]);

  // Favorite status ophalen via API (fallback naar localStorage)
  useEffect(() => {
    if (!id) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    let cancelled = false;

    (async () => {
      // 1) Probeer favorites uit een "me" endpoint te halen (mogelijk /api/user/me of /api/auth/me)
      const tryEndpoints = [
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/me`,
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
      ];

      for (const url of tryEndpoints) {
        try {
          const me = await fetchJson<{ favorites?: string[] }>(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!cancelled && Array.isArray(me?.favorites)) {
            setIsFavorite(me.favorites.map(String).includes(String(id)));
            return;
          }
        } catch {
          // ga door naar volgende mogelijke endpoint
        }
      }

      // 2) Fallback: lokale cache gebruiken
      if (!cancelled) {
        const store = readFavorites();
        setIsFavorite(store.modules.includes(String(id)));
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  // Toggle via API
  const toggleFavorite = async () => {
    if (!id) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module/favorite/${encodeURIComponent(String(id))}`;
      const result = await fetchJson<{ isFavorite?: boolean; favorites?: string[] }>(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // status bepalen vanuit API-respons
      if (typeof result?.isFavorite === 'boolean') {
        setIsFavorite(result.isFavorite);
      } else if (Array.isArray(result?.favorites)) {
        setIsFavorite(result.favorites.map(String).includes(String(id)));
      } else {
        // fallback: optimistisch
        setIsFavorite((prev) => !prev);
      }

      // optioneel: lokale cache bijhouden als fallback
      const store = readFavorites();
      const idx = store.modules.indexOf(String(id));
      const nowFav = typeof result?.isFavorite === 'boolean' ? result.isFavorite : idx < 0;
      if (nowFav && idx < 0) store.modules.push(String(id));
      if (!nowFav && idx >= 0) store.modules.splice(idx, 1);
      writeFavorites(store);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Favoriet toggelen mislukt.');
    }
  };

  const handleShare = async () => {
    const title = mod?.title ?? 'Keuzemodule';
    const text = 'Check deze keuzemodule:';
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link gekopieerd naar klembord!');
      } else {
        prompt('Kopieer de link:', shareUrl);
      }
    } catch { /* noop */ }
  };

  const handleEdit = () => {
    if (!id) return;
    if (!isAdmin) return; // extra guard
    router.push(`/electives/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!isAdmin) return; // extra guard
    const confirmed = confirm('Weet je zeker dat je deze keuzemodule wilt verwijderen?');
    if (!confirmed) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/module/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || 'Verwijderen mislukt');
      alert('Keuzemodule verwijderd.');
      router.push('/electives');
    } catch (e: any) {
      alert(e?.message || 'Er ging iets mis bij verwijderen.');
    }
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border" role="status" aria-hidden="true" />
          <span>Bezig met laden…</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger mb-0">{error}</div>
      </div>
    );
  }
  if (!mod) return <div className="container my-4">Module niet gevonden.</div>;

  const favBtnClass = `btn ${isFavorite ? styles.avansFavoBtn : 'btn-outline-secondary'} ${styles.avansBtn} d-inline-flex align-items-center`;
  return (
    <div className="container my-4">
      <header className="mb-3">
        <h1 className="h1 mb-2">{mod.title}</h1>
        {mod.description ? (
          <p className="text-body-secondary mb-0">{mod.description}</p>
        ) : (
          <p className="fst-italic text-secondary mb-0">Geen beschrijving beschikbaar.</p>
        )}

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={handleShare}
            title="Deel keuzemodule"
            className={`btn btn-outline-secondary ${styles.avansBtn} d-inline-flex align-items-center`}
          >
            <i className="bi bi-share me-2" aria-hidden="true" />
            Deel
          </button>

          <button
            type="button"
            onClick={toggleFavorite}
            title={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
            className={favBtnClass}
          >
            <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'} me-2`} aria-hidden="true" />
            {isFavorite ? 'In favorieten' : 'Aan favorieten toevoegen'}
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={handleEdit}
                title="Bewerk keuzemodule"
                className="btn btn-outline-primary avansBtn avansFocus d-inline-flex align-items-center"
              >
                <i className="bi bi-pencil me-2" aria-hidden="true" />
                Bewerk
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Verwijder keuzemodule"
                className="btn btn-outline-danger avansBtn avansFocus d-inline-flex align-items-center"
              >
                <i className="bi bi-trash me-2" aria-hidden="true" />
                Verwijder
              </button>
            </>
          )}
        </div>
      </header>

      <section className="card">
        <div className="card-body">
          <h2 id="details-heading" className="h5 mt-0">Module informatie</h2>
          <dl className="row g-3 mb-0">

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt" aria-hidden="true" /> Locatie
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.location}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-calendar3" aria-hidden="true" /> Periode
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.period}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-award" aria-hidden="true" /> Studiepunten
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.studentCredits}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-translate" aria-hidden="true" /> Taal
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.language}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-bar-chart" aria-hidden="true" /> Niveau
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.level ?? '—'}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-hourglass-split" aria-hidden="true" /> Duur
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.duration ?? '—'}</dd>

            <dt className="col-4 col-md-3 text-secondary d-flex align-items-center gap-2">
              <i className="bi bi-building" aria-hidden="true" /> Aangeboden door
            </dt>
            <dd className="col-8 col-md-9 mb-0">{mod.offeredBy ?? '—'}</dd>
          </dl>
        </div>
      </section>
    </div>
  );
}