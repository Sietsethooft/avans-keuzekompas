"use client";
import { useParams } from 'next/navigation';

export default function ElectiveDetailPage() {
  const params = useParams();
  const id = params?.id;

  // Hier kun je de module ophalen met het id en tonen
  return (
    <div>
      <h1>Detailpagina voor module: {id}</h1>
      {/* Module info hier */}
    </div>
  );
}