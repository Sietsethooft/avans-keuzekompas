"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@avans-keuzekompas/types";
import { JsonResponse } from "@avans-keuzekompas/utils";
import Swal from "sweetalert2";

const avansEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.avans\.nl$/;
const studentNumberRegex = /^[0-9]{7,}$/;

const UpdateProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentNumber: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    studentNumber: false,
    password: false,
  });

  // Fetch user data
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    // Decode JWT to get userId
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
      } catch {
        return null;
      }
    }
    const payload = decodeJwt(token);
    const userId =
      payload?.sub ||
      payload?.id ||
      payload?.userId ||
      payload?._id ||
      localStorage.getItem("userId") ||
      null;

    if (!userId) {
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
        if (!res.ok || !data || data.status !== 200 || !data.data) {
          setError(data?.message || "Kon profiel niet ophalen.");
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
          password: "",
          role: apiUser.role,
          favorites: apiUser.favorites || [],
        };
        setUser(mappedUser);
        setForm({
          firstName: mappedUser.firstName,
          lastName: mappedUser.lastName,
          email: mappedUser.email,
          studentNumber: mappedUser.studentNumber,
          password: "",
        });
        setLoading(false);
      } catch {
        setError("Kon profiel niet ophalen.");
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // Validatie functies
  const validateFirstName = (v: string) => !v ? "Graag een voornaam invullen" : "";
  const validateLastName = (v: string) => !v ? "Graag een achternaam invullen" : "";
  const validateEmail = (v: string) => {
    if (!v) return "Graag een geldige e-mail invullen";
    if (!avansEmailRegex.test(v)) return "Deze e-mail is ongeldig, volg dit format: naam@student.avans.nl";
    return "";
  };
  const validateStudentNumber = (v: string) => {
    if (!v) return "Graag een studentnummer invullen";
    if (!studentNumberRegex.test(v)) return "Studentnummer moet minimaal 7 cijfers zijn";
    return "";
  };
  const validatePassword = (v: string) => {
    if (v && v.length < 8) return "Wachtwoord moet minimaal 8 tekens lang zijn";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      studentNumber: true,
      password: true,
    });

    const errors = [
      validateFirstName(form.firstName),
      validateLastName(form.lastName),
      validateEmail(form.email),
      validateStudentNumber(form.studentNumber),
      validatePassword(form.password),
    ].filter(Boolean);

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        setError("Niet ingelogd.");
        return;
      }
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          studentNumber: form.studentNumber,
          password: form.password ? form.password : undefined,
        }),
      });
      const data: JsonResponse<null> = await res.json();
      if (!res.ok || data.status !== 200) {
        setError(data.message || "Bijwerken mislukt.");
        return;
      }
      await Swal.fire({
        title: "Profiel bijgewerkt",
        text: "Je profiel is succesvol aangepast.",
        icon: "success",
        confirmButtonColor: "#dc3545",
      });
      router.replace("/profile");
    } catch (err) {
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

  if (error) {
    return (
      <div className="main-container text-center text-danger">
        <h4>{error}</h4>
      </div>
    );
  }

  return (
    <div >
      <div className="card p-4 custom-shadow" style={{ width: "500px" }}>
        <h2 className="mb-4 text-center">Profiel bijwerken</h2>
        <form noValidate onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">Voornaam:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className={`form-control ${touched.firstName && validateFirstName(form.firstName) ? "is-invalid" : touched.firstName ? "is-valid" : ""}`}
              value={form.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur("firstName")}
              required
            />
            {touched.firstName && validateFirstName(form.firstName) && (
              <div className="invalid-feedback">{validateFirstName(form.firstName)}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Achternaam:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className={`form-control ${touched.lastName && validateLastName(form.lastName) ? "is-invalid" : touched.lastName ? "is-valid" : ""}`}
              value={form.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur("lastName")}
              required
            />
            {touched.lastName && validateLastName(form.lastName) && (
              <div className="invalid-feedback">{validateLastName(form.lastName)}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${touched.email && validateEmail(form.email) ? "is-invalid" : touched.email ? "is-valid" : ""}`}
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              required
            />
            {touched.email && validateEmail(form.email) && (
              <div className="invalid-feedback">{validateEmail(form.email)}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="studentNumber" className="form-label">Studentnummer:</label>
            <input
              type="text"
              id="studentNumber"
              name="studentNumber"
              className={`form-control ${touched.studentNumber && validateStudentNumber(form.studentNumber) ? "is-invalid" : touched.studentNumber ? "is-valid" : ""}`}
              value={form.studentNumber}
              onChange={handleChange}
              onBlur={() => handleBlur("studentNumber")}
              required
            />
            {touched.studentNumber && validateStudentNumber(form.studentNumber) && (
              <div className="invalid-feedback">{validateStudentNumber(form.studentNumber)}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Nieuw wachtwoord:</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${touched.password && validatePassword(form.password) ? "is-invalid" : touched.password && form.password ? "is-valid" : ""}`}
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              placeholder="Laat leeg om niet te wijzigen"
            />
            {touched.password && validatePassword(form.password) && (
              <div className="invalid-feedback">{validatePassword(form.password)}</div>
            )}
          </div>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">Opslaan</button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push("/profile")}
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;