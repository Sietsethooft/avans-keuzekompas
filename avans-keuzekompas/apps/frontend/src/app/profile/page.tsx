"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return null; // Of een loader tonen
  }

  return (
    <div>
      <h1>Profielpagina</h1>
      {/* Hier komt je profiel info */}
    </div>
  );
}