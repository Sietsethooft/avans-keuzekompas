"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Types en helpers
type JwtPayload = { role?: string; exp?: number };
function decodeJwt<T>(token: string): T | null {
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
    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
}

const periods = ["P1", "P2", "P3", "P4"] as const;
const languages = ["NL", "EN"] as const;

type Period = typeof periods[number];
type Language = typeof languages[number];

function isPeriod(v: string): v is Period {
  return (periods as readonly string[]).includes(v);
}

function isLanguage(v: string): v is Language {
  return (languages as readonly string[]).includes(v);
}

const CreateElectivePage: React.FC = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    period: "P1",
    studentCredits: "",
    language: "NL",
    level: "",
    duration: "",
    offeredBy: "",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
    period: false,
    studentCredits: false,
    language: false,
    level: false,
    duration: false,
    offeredBy: false,
  });

  // Admin check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodeJwt<JwtPayload>(token);
    const isExpired = payload?.exp ? Date.now() / 1000 >= payload.exp : false;
    if (isExpired || payload?.role !== "admin") {
      router.replace("/electives");
      return;
    }
    setAuthorized(true);
  }, [router]);

  // Validaties
  const validateTitle = (v: string) => (!v ? "Graag een titel invullen" : "");
  const validateLocation = (v: string) => (!v ? "Graag een locatie invullen" : "");
  const validatePeriod = (v: string) => (!isPeriod(v) ? "Kies een geldige periode" : "");
  const validateStudentCredits = (v: string) => {
    const num = Number(v);
    return !v || isNaN(num) || num <= 0 ? "Vul geldige studiepunten in" : "";
  };
  const validateLanguage = (v: string) => (!isLanguage(v) ? "Kies een geldige taal" : "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const extractCreatedId = (data: unknown): string | null => {
    if (!data) return null;
    let payload: unknown = data;
    if (typeof data === "object" && data !== null && "data" in data) {
      const obj = data as Record<string, unknown>;
      payload = obj.data;
    }
    if (typeof payload === "string") return payload;
    if (typeof payload === "object" && payload !== null) {
      const p = payload as Record<string, unknown>;
      const id = p.id ?? p._id;
      return typeof id === "string" ? id : null;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      location: true,
      period: true,
      studentCredits: true,
      language: true,
      level: true,
      duration: true,
      offeredBy: true,
    });

    const errors = [
      validateTitle(form.title),
      validateLocation(form.location),
      validatePeriod(form.period),
      validateStudentCredits(form.studentCredits),
      validateLanguage(form.language),
    ].filter(Boolean) as string[];
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Niet ingelogd.");
        return;
      }
      setSubmitting(true);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          location: form.location,
          period: form.period,
          studentCredits: Number(form.studentCredits),
          language: form.language,
          level: form.level || null,
          duration: form.duration || null,
          offeredBy: form.offeredBy || null,
        }),
      });

      const data: unknown = await res.json().catch(() => null);
      const statusField =
        data && typeof data === "object" && data !== null && "status" in data
          ? (data as Record<string, unknown>).status
          : undefined;
      if (!res.ok || !data || (typeof statusField === "number" && statusField >= 300)) {
        const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
        let message: string | undefined;
        if (obj && typeof obj.message === "string") message = obj.message;
        else if (obj && typeof obj.error === "string") message = obj.error;
        setError(message ?? "Aanmaken mislukt.");
        setSubmitting(false);
        return;
      }

      const createdId = extractCreatedId(data);
      await Swal.fire({
        title: "Module aangemaakt",
        text: "De keuzemodule is succesvol aangemaakt.",
        icon: "success",
        confirmButtonColor: "#dc3545",
      });
      if (createdId) router.replace(`/electives/${createdId}`);
      else router.replace(`/electives`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Er ging iets mis met aanmaken.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authorized === null) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-danger" role="status" aria-label="laden" />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card p-4 custom-shadow" style={{ width: "100%", maxWidth: "1000px" }}>
        <h2 className="mb-4 text-center">Keuzemodule aanmaken</h2>
        <form noValidate onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Titel <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-control ${touched.title && validateTitle(form.title) ? "is-invalid" : touched.title ? "is-valid" : ""}`}
                  value={form.title}
                  onChange={handleChange}
                  onBlur={() => handleBlur("title")}
                  required
                  placeholder="Bijv. Mindset Development"
                />
                {touched.title && validateTitle(form.title) && (
                  <div className="invalid-feedback">{validateTitle(form.title)}</div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="period" className="form-label">Periode <span className="text-danger">*</span></label>
                <select
                  id="period"
                  name="period"
                  className={`form-select ${touched.period && validatePeriod(form.period) ? "is-invalid" : touched.period ? "is-valid" : ""}`}
                  value={form.period}
                  onChange={handleChange}
                  onBlur={() => handleBlur("period")}
                  required
                >
                  {periods.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {touched.period && validatePeriod(form.period) && (
                  <div className="invalid-feedback">{validatePeriod(form.period)}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Beschrijving</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                  onBlur={() => handleBlur("description")}
                  rows={5}
                  placeholder="Bijv. Deze module gaat over..."
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="studentCredits" className="form-label">Studiepunten <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="studentCredits"
                  name="studentCredits"
                  className={`form-control ${touched.studentCredits && validateStudentCredits(form.studentCredits) ? "is-invalid" : touched.studentCredits ? "is-valid" : ""}`}
                  value={form.studentCredits}
                  onChange={handleChange}
                  onBlur={() => handleBlur("studentCredits")}
                  required
                  inputMode="numeric"
                  placeholder="Bijv. 15"
                />
                {touched.studentCredits && validateStudentCredits(form.studentCredits) && (
                  <div className="invalid-feedback">{validateStudentCredits(form.studentCredits)}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="language" className="form-label">Taal <span className="text-danger">*</span></label>
                <select
                  id="language"
                  name="language"
                  className={`form-select ${touched.language && validateLanguage(form.language) ? "is-invalid" : touched.language ? "is-valid" : ""}`}
                  value={form.language}
                  onChange={handleChange}
                  onBlur={() => handleBlur("language")}
                  required
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {touched.language && validateLanguage(form.language) && (
                  <div className="invalid-feedback">{validateLanguage(form.language)}</div>
                )}
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Locatie <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-control ${touched.location && validateLocation(form.location) ? "is-invalid" : touched.location ? "is-valid" : ""}`}
                  value={form.location}
                  onChange={handleChange}
                  onBlur={() => handleBlur("location")}
                  required
                  placeholder="Bijv. Breda"
                />
                {touched.location && validateLocation(form.location) && (
                  <div className="invalid-feedback">{validateLocation(form.location)}</div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="level" className="form-label">Niveau</label>
                <input
                  type="text"
                  id="level"
                  name="level"
                  className="form-control"
                  value={form.level}
                  onChange={handleChange}
                  onBlur={() => handleBlur("level")}
                  placeholder="Bijv. Jaar 2"
                />
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="offeredBy" className="form-label">Aangeboden door</label>
                <input
                  type="text"
                  id="offeredBy"
                  name="offeredBy"
                  className="form-control"
                  value={form.offeredBy}
                  onChange={handleChange}
                  onBlur={() => handleBlur("offeredBy")}
                  placeholder="Bijv. Informatica Avans Hogeschool"
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duur</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  className="form-control"
                  value={form.duration}
                  onChange={handleChange}
                  onBlur={() => handleBlur("duration")}
                  placeholder="Bijv. 6 weken"
                />
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push("/electives")}
              disabled={submitting}
              
            >
              Annuleren
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Opslaan...
                </>
              ) : (
                "Opslaan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElectivePage;
