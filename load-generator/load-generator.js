/**
 * Advanced load generator for booking-api
 * Designed for Grafana dashboard:
 * - RPS
 * - Error rate
 * - p95 / p99 latency
 * - Alerts
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://backend:8000';

const FLOWS = {
  happy: {
    endpoints: ['/customers', '/cars', '/services', '/invoices'],
    weight: 0.6
  },
  slow: {
    endpoints: ['/customers', '/cars'],
    weight: 0.25,
    delay: [500, 1500]
  },
  error: {
    endpoints: ['/error', '/non-existent-page'],
    weight: 0.15
  }
};

const REQUEST_INTERVAL_MS = Number(process.env.REQUEST_INTERVAL_MS || 800);
const MAX_PARALLEL = Number(process.env.MAX_PARALLEL || 3);

/* ---------------------------------- utils --------------------------------- */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseFlow() {
  const r = Math.random();
  let acc = 0;
  for (const [name, flow] of Object.entries(FLOWS)) {
    acc += flow.weight;
    if (r <= acc) return { name, ...flow };
  }
  return { name: 'happy', ...FLOWS.happy };
}

/* ----------------------------- HTTP request -------------------------------- */

async function fireRequest(flowName, endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      headers: {
        'x-demo-load': 'booking-api',
        'x-flow': flowName
      }
    });

    const duration = Date.now() - start;

    if (!res.ok) {
      console.warn(
        `[${flowName}] ${endpoint} → ${res.status} (${duration}ms)`
      );
    } else {
      console.log(
        `[${flowName}] ${endpoint} → ${res.status} (${duration}ms)`
      );
    }
  } catch (err) {
    console.error(`[${flowName}] ${endpoint} → network error`, err.message);
  }
}

/* ------------------------------ generators --------------------------------- */

async function generateTraffic() {
  const flow = chooseFlow();
  const endpoint =
    flow.endpoints[Math.floor(Math.random() * flow.endpoints.length)];

  // slow-db simulation
  if (flow.delay) {
    await sleep(random(flow.delay[0], flow.delay[1]));
  }

  const parallel = random(1, MAX_PARALLEL);
  await Promise.all(
    Array.from({ length: parallel }, () =>
      fireRequest(flow.name, endpoint)
    )
  );
}

/* --------------------------------- start ---------------------------------- */

setInterval(() => {
  generateTraffic().catch(console.error);
}, REQUEST_INTERVAL_MS);

console.log('🚀 Advanced load generator started', {
  API_BASE_URL,
  REQUEST_INTERVAL_MS,
  MAX_PARALLEL,
  flows: Object.keys(FLOWS)
});
