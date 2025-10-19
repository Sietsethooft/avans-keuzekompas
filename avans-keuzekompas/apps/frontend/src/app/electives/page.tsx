/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './electives.module.css';
import type { Module as ModuleItem } from "@avans-keuzekompas/types";

// Fetch helper that unwraps Json envelopes if needed
async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
  }
  const isEnvelope = typeof data === 'object' && 'status' in data && 'data' in data;
  return (isEnvelope ? (data.data as T) : (data as T));
}

export default function ElectivesPage() {
  const router = useRouter();

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // UI state
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<'ALL' | ModuleItem['period']>('ALL');
  const [location, setLocation] = useState<'ALL' | string>('ALL');
  const [language, setLanguage] = useState<'ALL' | ModuleItem['language']>('ALL');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Fetch modules (auth required)
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    // Fetch modules from API
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => null);
        // Validate response
        if (!res.ok || !data || data.status !== 200 || !Array.isArray(data.data)) {
          setError(data?.message || 'Kon modules niet ophalen.');
          setLoading(false);
          return;
        }

        // Map to ModuleItem[]
        const mapped: ModuleItem[] = data.data.map((m: any) => ({
          id: m._id || m.id,
          title: m.title,
          description: m.description ?? null,
          location: m.location,
          period: m.period,
          studentCredits: m.studentCredits,
          language: m.language,
          level: m.level ?? null,
          duration: m.duration ?? null,
          offeredBy: m.offeredBy ?? null,
        }));

        setModules(mapped);
        setLoading(false);
      } catch (err) {
        setError('Er ging iets mis bij het laden van de modules.');
        setLoading(false);
      }
    };

    fetchModules();
  }, [router]);

  // Admin detection via JWT
  type JwtPayload = { sub: string; role?: string; exp?: number; iat?: number };
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial check + listen for changes
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

  // Loading favorites from API
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    // Fetch user profile
    let cancelled = false;
    (async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`;
        const me = await fetchJson<{ favorites?: string[] }>(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!cancelled && Array.isArray(me?.favorites)) {
          setFavorites(new Set(me.favorites.map(String)));
        }
      } catch {
        // noop
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Filter options
  const locationOptions = useMemo(() => {
    const set = new Set<string>();
    modules.forEach((m) => set.add(m.location));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [modules]);

  // Filter + search
  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();
    return modules.filter((m) => {
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q);

      const matchesPeriod = period === 'ALL' || m.period === period;
      const matchesLocation = location === 'ALL' || m.location === location;
      const matchesLanguage = language === 'ALL' || m.language === language;

      return matchesSearch && matchesPeriod && matchesLocation && matchesLanguage;
    });
  }, [modules, search, period, location, language]);

  // Toggle via API
  const toggleFavorite = async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }

    // Update local state optimistically
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    // API call favorite toggle
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module/favorite/${encodeURIComponent(String(id))}`;
      const result = await fetchJson<{ isFavorite?: boolean; favorites?: string[] }>(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Sync met server-respons
      let shouldBeFav: boolean | null = null;
      if (typeof result?.isFavorite === 'boolean') {
        shouldBeFav = result.isFavorite;
      } else if (Array.isArray(result?.favorites)) {
        shouldBeFav = result.favorites.map(String).includes(String(id));
      }

      if (shouldBeFav !== null) {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (shouldBeFav) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    } catch (e: any) {
      // Revert on error
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      alert(e?.message || 'Favoriet toggelen mislukt.');
    }
  };

  // Navigation
  const onMoreInfo = (id: string) => {
    router.push(`/electives/${id}`);
  };

  // Loading/rendering
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-danger" role="status" aria-label="laden" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-3">
      <div className="d-flex flex-column flex-lg-row gap-3 mb-4 align-items-stretch align-items-lg-end">
        {/* Search */}
        <div className="flex-grow-1">
          <label htmlFor="search" className="form-label fw-semibold">
            Zoek modules
          </label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              id="search"
              className={`form-control ${styles.avansFocus}`}
              type="text"
              placeholder="Zoek op titel, beschrijving of locatie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ minWidth: 200 }}>
          <label htmlFor="period" className="form-label fw-semibold">Periode</label>
          <select
            id="period"
            className={`form-select ${styles.avansFocus}`}
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <option value="ALL">Alle</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>

        <div style={{ minWidth: 220 }}>
          <label htmlFor="location" className="form-label fw-semibold">Locatie</label>
          <select
            id="location"
            className={`form-select ${styles.avansFocus}`}
            value={location}
            onChange={(e) => setLocation(e.target.value as any)}
          >
            <option value="ALL">Alle</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: 200 }}>
          <label htmlFor="language" className="form-label fw-semibold">Taal</label>
          <select
            id="language"
            className={`form-select ${styles.avansFocus}`}
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
          >
            <option value="ALL">Alle</option>
            <option value="NL">Nederlands (NL)</option>
            <option value="EN">Engels (EN)</option>
          </select>
        </div>

        {isAdmin && (
          <div style={{ minWidth: 220 }} className="d-grid">
            {/* Spacer label to align bottom on lg, hidden on small */}
            <label className="form-label fw-semibold d-none d-lg-block">&nbsp;</label>
            <button
              type="button"
              className={`btn btn-danger ${styles.avansBtn}`}
              onClick={() => router.push('/electives/create')}
            >
              <i className="bi bi-plus-lg me-2" />
              Creëer module
            </button>
          </div>
        )}
      </div>

      {/* Result header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0 fw-semibold">
          <i className="bi bi-collection me-2 text-danger" />
          Modules
        </h5>
        <span className="badge bg-light text-dark">
          {filteredModules.length} {filteredModules.length === 1 ? 'resultaat' : 'resultaten'}
        </span>
      </div>

      {filteredModules.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-inboxes fs-1 d-block mb-2" />
          Geen modules gevonden.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {filteredModules.map((m) => {
            const isFav = favorites.has(m.id);
            return (
              <div key={m.id} className="col">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title fw-bold mb-0">{m.title}</h6>
                      <button
                        type="button"
                        className={`btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'}`}
                        title={isFav ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                        onClick={() => toggleFavorite(m.id)}
                      >
                        <i className={`bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}`} />
                      </button>
                    </div>

                    <p className="card-text text-muted small mb-3" style={{ minHeight: 48 }}>
                      {m.description || 'Geen beschrijving beschikbaar.'}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-calendar-event me-1" />
                        {m.period}
                      </span>
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-geo-alt me-1" />
                        {m.location}
                      </span>
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-award me-1" />
                        {m.studentCredits} EC
                      </span>
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-translate me-1" />
                        {m.language}
                      </span>
                    </div>

                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        type="button"
                        className={`${styles.avansBtn} btn btn-outline-secondary btn-sm`}
                        onClick={() => onMoreInfo(m.id)}
                      >
                        Meer info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}