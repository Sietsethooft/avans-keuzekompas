"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Module } from "@avans-keuzekompas/types";
import Swal from "sweetalert2";

const periods = ["P1", "P2", "P3", "P4"];
const languages = ["NL", "EN"];

const UpdateModulePage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [mod, setMod] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!id) return;
    const fetchModule = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module/${id}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data || data.status !== 200 || !data.data) {
          setError(data?.message || "Kon module niet ophalen.");
          setLoading(false);
          return;
        }
        const apiMod = data.data;
        setMod(apiMod);
        setForm({
          title: apiMod.title ?? "",
          description: apiMod.description ?? "",
          location: apiMod.location ?? "",
          period: apiMod.period ?? "P1",
          studentCredits: apiMod.studentCredits != null ? String(apiMod.studentCredits) : "",
          language: apiMod.language ?? "NL",
          level: apiMod.level ?? "",
          duration: apiMod.duration ?? "",
          offeredBy: apiMod.offeredBy ?? "",
        });
        setLoading(false);
      } catch {
        setError("Kon module niet ophalen.");
        setLoading(false);
      }
    };
    fetchModule();
  }, [id, router]);

  // Validatie functies
  const validateTitle = (v: string) => (!v ? "Graag een titel invullen" : "");
  const validateLocation = (v: string) => (!v ? "Graag een locatie invullen" : "");
  const validatePeriod = (v: string) => (!periods.includes(v) ? "Kies een geldige periode" : "");
  const validateStudentCredits = (v: string) => {
    const num = Number(v);
    return !v || isNaN(num) || num <= 0 ? "Vul geldige studiepunten in" : "";
  };
  const validateLanguage = (v: string) => (!languages.includes(v) ? "Kies een geldige taal" : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "studentCredits") {
      // keep as string for a free text field; validate/parse later
      setForm({ ...form, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
    if (error) setError("");
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
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
    if (!token || !id) {
      setError("Niet ingelogd.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/module/${id}`;
    const res = await fetch(url, {
      method: "PUT",
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
        level: form.level,
        duration: form.duration,
        offeredBy: form.offeredBy,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.status !== 200) {
      setError(data.message || "Bijwerken mislukt.");
      return;
    }
    await Swal.fire({
      title: "Module bijgewerkt",
      text: "De keuzemodule is succesvol aangepast.",
      icon: "success",
      confirmButtonColor: "#dc3545",
    });
    router.replace(`/electives/${id}`);
  } catch {
    setError("Er ging iets mis met bijwerken.");
  }
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

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card p-4 custom-shadow" style={{ width: "100%", maxWidth: "1000px" }}>
        <h2 className="mb-4 text-center">Keuzemodule bijwerken</h2>
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
                />
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => router.push(`/electives/${mod?.id}`)}>
              Annuleren
            </button>
            <button type="submit" className="btn btn-primary">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModulePage;
