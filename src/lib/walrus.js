// src/lib/walrus.js

const API_BASE = import.meta.env.VITE_WALRUS_API_URL;

export async function uploadBlob(content) {
  // POST the raw Markdown or file
  const res = await fetch(`${API_BASE}/blob`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: new TextEncoder().encode(content),
  });
  if (!res.ok) throw new Error("Walrus upload failed");
  const { hash } = await res.json();
  return hash;
}

export async function fetchBlob(hash) {
  const res = await fetch(`${API_BASE}/blob/${hash}`);
  if (!res.ok) throw new Error("Walrus fetch failed");
  return await res.text();
}
