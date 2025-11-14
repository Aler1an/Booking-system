function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function backoff(base, attempt, jitter = true) {
  const delay = base * 2 ** attempt;
  return jitter ? delay + Math.random() * 100 : delay;
}

async function fetchWithResilience(url, opts = {}) {
  const { retry = {}, idempotencyKey, ...init } = opts;
  const {
    retries = 2,
    baseDelayMs = 300,
    timeoutMs = 3000,
    jitter = true,
  } = retry;

  const headers = init.headers || {};
  headers["Content-Type"] = "application/json";
  headers["X-Request-Id"] = crypto.randomUUID();
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...init, headers, signal: controller.signal });

    // Rate-limit
    if (res.status === 429 && retries > 0) {
      const ra = Number(res.headers.get("Retry-After") || 1) * 1000;
      await sleep(ra);
      return fetchWithResilience(url, { ...opts, retry: { ...retry, retries: retries - 1 } });
    }

    // 5xx retry
    if ([500, 502, 503, 504].includes(res.status) && retries > 0) {
      const attempt = opts.__attempt || 0;
      await sleep(backoff(baseDelayMs, attempt, jitter));
      return fetchWithResilience(url, {
        ...opts,
        __attempt: attempt + 1,
        retry: { ...retry, retries: retries - 1 }
      });
    }

    return res;

  } finally {
    clearTimeout(timer);
  }
}
