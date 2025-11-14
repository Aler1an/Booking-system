async function hashPayload(obj) {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, "0")).join("");
}

async function getIdempotencyKey(payload) {
  const hash = await hashPayload(payload);
  const existing = localStorage.getItem("idem:" + hash);
  if (existing) return existing;

  const fresh = crypto.randomUUID();
  localStorage.setItem("idem:" + hash, fresh);
  return fresh;
}
