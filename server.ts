import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// In-Memory Database for EdgeMesh
let workspaces = [
  { id: "ws-1", name: "Global Production", plan: "Enterprise", region: "Multi-Region", status: "active" },
  { id: "ws-2", name: "Staging & Testing", plan: "Pro", region: "US & EU", status: "active" },
  { id: "ws-3", name: "APAC High-Scale", plan: "Enterprise", region: "Asia Pacific", status: "active" }
];

let nodes = [
  { id: "node-nyc-01", name: "New York Edge 01", region: "North America", ip: "198.51.100.12", status: "healthy", cpu: 32, memory: 58, bandwidth: "4.2 TB/s", latency: "14ms", requestsPerSec: 14200, availability: "99.99%", lastHeartbeat: "Just now" },
  { id: "node-sfo-01", name: "San Francisco Edge 01", region: "North America", ip: "198.51.100.45", status: "healthy", cpu: 41, memory: 64, bandwidth: "5.8 TB/s", latency: "18ms", requestsPerSec: 18500, availability: "99.98%", lastHeartbeat: "2s ago" },
  { id: "node-gru-01", name: "São Paulo Edge 01", region: "South America", ip: "203.0.113.22", status: "healthy", cpu: 28, memory: 45, bandwidth: "1.9 TB/s", latency: "38ms", requestsPerSec: 6400, availability: "99.95%", lastHeartbeat: "5s ago" },
  { id: "node-fra-01", name: "Frankfurt Edge 01", region: "Europe", ip: "198.51.100.88", status: "healthy", cpu: 55, memory: 72, bandwidth: "8.4 TB/s", latency: "12ms", requestsPerSec: 24000, availability: "99.99%", lastHeartbeat: "1s ago" },
  { id: "node-lon-01", name: "London Edge 01", region: "Europe", ip: "198.51.100.99", status: "healthy", cpu: 48, memory: 68, bandwidth: "7.1 TB/s", latency: "15ms", requestsPerSec: 21200, availability: "99.99%", lastHeartbeat: "Just now" },
  { id: "node-tyo-01", name: "Tokyo Edge 01", region: "Asia", ip: "203.0.113.104", status: "healthy", cpu: 62, memory: 79, bandwidth: "6.9 TB/s", latency: "22ms", requestsPerSec: 19800, availability: "99.97%", lastHeartbeat: "Just now" },
  { id: "node-sin-01", name: "Singapore Edge 01", region: "Southeast Asia", ip: "203.0.113.155", status: "healthy", cpu: 39, memory: 52, bandwidth: "3.5 TB/s", latency: "25ms", requestsPerSec: 11500, availability: "99.96%", lastHeartbeat: "3s ago" },
  { id: "node-bom-01", name: "Mumbai Edge 01", region: "India", ip: "203.0.113.180", status: "degraded", cpu: 84, memory: 91, bandwidth: "2.8 TB/s", latency: "42ms", requestsPerSec: 9200, availability: "99.82%", lastHeartbeat: "Just now" },
  { id: "node-cpt-01", name: "Cape Town Edge 01", region: "Africa", ip: "198.51.100.201", status: "healthy", cpu: 24, memory: 38, bandwidth: "1.1 TB/s", latency: "52ms", requestsPerSec: 3800, availability: "99.90%", lastHeartbeat: "4s ago" },
  { id: "node-syd-01", name: "Sydney Edge 01", region: "Australia", ip: "203.0.113.220", status: "healthy", cpu: 31, memory: 49, bandwidth: "2.4 TB/s", latency: "31ms", requestsPerSec: 7900, availability: "99.98%", lastHeartbeat: "1s ago" }
];

let domains = [
  { id: "dom-1", domain: "api.edgemesh.io", origin: "us-east-origin.internal", status: "active", ssl: "Active (TLS 1.3)", requests: "42.8M", bandwidth: "142 TB", cacheHitRatio: "94.2%" },
  { id: "dom-2", domain: "cdn.enterprise-app.com", origin: "eu-central-origin.internal", status: "active", ssl: "Active (Wildcard)", requests: "128.4M", bandwidth: "580 TB", cacheHitRatio: "98.1%" },
  { id: "dom-3", domain: "static.globalstream.net", origin: "s3-bucket-eu-west.aws", status: "active", ssl: "Active (TLS 1.3)", requests: "89.1M", bandwidth: "310 TB", cacheHitRatio: "96.5%" },
  { id: "dom-4", domain: "auth.secure-identity.io", origin: "auth-cluster-01.internal", status: "active", ssl: "Active (Strict)", requests: "14.2M", bandwidth: "22 TB", cacheHitRatio: "45.0%" }
];

let cacheRules = [
  { id: "rule-1", pattern: "/static/*", ttl: "7 Days", bypassCookie: true, browserCache: "1 Year", status: "enabled" },
  { id: "rule-2", pattern: "/api/v1/public/*", ttl: "1 Hour", bypassCookie: false, browserCache: "5 Minutes", status: "enabled" },
  { id: "rule-3", pattern: "/images/*", ttl: "30 Days", bypassCookie: true, browserCache: "30 Days", status: "enabled" },
  { id: "rule-4", pattern: "/checkout/*", ttl: "0 (Bypass)", bypassCookie: true, browserCache: "No-Store", status: "enabled" }
];

let edgeFunctions = [
  {
    id: "func-geo",
    name: "Geo-Based Redirect & Localization",
    runtime: "JavaScript (V8 Isolate)",
    status: "deployed",
    triggers: "/*",
    lastModified: "10 mins ago",
    invocations: "14.2M / day",
    code: `addEventListener('fetch', event => {\n  event.respondWith(handleRequest(event.request));\n});\n\nasync function handleRequest(request) {\n  const country = request.headers.get('cf-ipcountry') || 'US';\n  const url = new URL(request.url);\n  \n  if (country === 'DE' && url.pathname === '/') {\n    return Response.redirect('https://edgemesh.io/de', 302);\n  }\n  \n  const response = await fetch(request);\n  const newHeaders = new Headers(response.headers);\n  newHeaders.set('X-Edge-Region', country);\n  return new Response(response.body, {\n    status: response.status,\n    headers: newHeaders\n  });\n}`
  },
  {
    id: "func-transform",
    name: "API Response Header & Security Sanitization",
    runtime: "TypeScript",
    status: "deployed",
    triggers: "/api/*",
    lastModified: "2 hours ago",
    invocations: "48.9M / day",
    code: `export default {\n  async fetch(request, env, ctx) {\n    const response = await fetch(request);\n    const cloned = new Response(response.body, response);\n    cloned.headers.set('X-EdgeMesh-Security', 'verified-shield');\n    cloned.headers.set('X-Frame-Options', 'DENY');\n    cloned.headers.delete('X-Powered-By');\n    return cloned;\n  }\n};`
  },
  {
    id: "func-jwt",
    name: "Edge JWT Authentication Gate",
    runtime: "JavaScript (V8 Isolate)",
    status: "draft",
    triggers: "/dashboard/*",
    lastModified: "1 day ago",
    invocations: "0 / day",
    code: `// Verify Authorization Bearer JWT at the edge before hitting origin\nexport async function onRequest(context) {\n  const authHeader = context.request.headers.get('Authorization');\n  if (!authHeader || !authHeader.startsWith('Bearer ')) {\n    return new Response('Unauthorized Edge Token', { status: 401 });\n  }\n  return context.next();\n}`
  }
];

let securityEvents = [
  { id: "sec-1", timestamp: "2 mins ago", type: "DDoS Mitigation (Layer 7)", sourceIP: "185.220.101.5", target: "api.edgemesh.io/auth", action: "Blocked", riskScore: "High", country: "RU" },
  { id: "sec-2", timestamp: "14 mins ago", type: "SQL Injection Probe", sourceIP: "45.154.255.88", target: "cdn.enterprise-app.com", action: "Mitigated & Blocked", riskScore: "Critical", country: "NL" },
  { id: "sec-3", timestamp: "32 mins ago", type: "Rate Limit Exceeded", sourceIP: "198.51.100.240", target: "api.edgemesh.io/v1/data", action: "Challenged (CAPTCHA)", riskScore: "Medium", country: "US" },
  { id: "sec-4", timestamp: "1 hour ago", type: "Anomalous Traffic Spike", sourceIP: "103.253.41.9", target: "static.globalstream.net", action: "Rate Limited", riskScore: "Medium", country: "SG" },
  { id: "sec-5", timestamp: "3 hours ago", type: "Botnet Scraper Bot", sourceIP: "194.26.29.11", target: "api.edgemesh.io", action: "Blocked", riskScore: "High", country: "SC" }
];

let apiKeysList = [
  { id: "key-1", name: "Production Gateway Token", prefix: "em_live_9981...", created: "Jan 12, 2026", lastUsed: "Just now", scopes: ["Full CDN Control", "Edge Functions Deploy", "Purge Cache"] },
  { id: "key-2", name: "CI/CD Pipeline Deployer", prefix: "em_ci_4412...", created: "Feb 04, 2026", lastUsed: "14 mins ago", scopes: ["Edge Functions Deploy", "Read Analytics"] },
  { id: "key-3", name: "Analytics Exporter", prefix: "em_read_7731...", created: "Mar 19, 2026", lastUsed: "2 hours ago", scopes: ["Read Analytics", "Read Nodes"] }
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "2.4.0", providerMode: "Demo & Adapter Ready" });
});

app.get("/api/workspaces", (req, res) => {
  res.json(workspaces);
});

// Nodes API
app.get("/api/nodes", (req, res) => {
  res.json(nodes);
});

app.post("/api/nodes", (req, res) => {
  const { name, region, ip } = req.body;
  if (!name || !region || !ip) {
    return res.status(400).json({ error: "Name, region, and IP address are required." });
  }
  const newNode = {
    id: `node-${Math.random().toString(36).substring(2, 7)}`,
    name,
    region,
    ip,
    status: "healthy",
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 40) + 30,
    bandwidth: "1.2 TB/s",
    latency: `${Math.floor(Math.random() * 25) + 10}ms`,
    requestsPerSec: Math.floor(Math.random() * 10000) + 5000,
    availability: "100.0%",
    lastHeartbeat: "Just now"
  };
  nodes.push(newNode);
  res.status(201).json(newNode);
});

app.put("/api/nodes/:id", (req, res) => {
  const { id } = req.params;
  const index = nodes.findIndex(n => n.id === id);
  if (index === -1) return res.status(404).json({ error: "Node not found" });
  nodes[index] = { ...nodes[index], ...req.body };
  res.json(nodes[index]);
});

app.delete("/api/nodes/:id", (req, res) => {
  const { id } = req.params;
  nodes = nodes.filter(n => n.id !== id);
  res.json({ success: true, id });
});

// Network API
app.get("/api/network", (req, res) => {
  const regionsSummary = [
    { name: "North America", nodeCount: 2, status: "healthy", avgLatency: "16ms", rps: "32,700 req/s", bandwidth: "10.0 TB/s", availability: "99.98%" },
    { name: "South America", nodeCount: 1, status: "healthy", avgLatency: "38ms", rps: "6,400 req/s", bandwidth: "1.9 TB/s", availability: "99.95%" },
    { name: "Europe", nodeCount: 2, status: "healthy", avgLatency: "13ms", rps: "45,200 req/s", bandwidth: "15.5 TB/s", availability: "99.99%" },
    { name: "Asia", nodeCount: 1, status: "healthy", avgLatency: "22ms", rps: "19,800 req/s", bandwidth: "6.9 TB/s", availability: "99.97%" },
    { name: "Southeast Asia", nodeCount: 1, status: "healthy", avgLatency: "25ms", rps: "11,500 req/s", bandwidth: "3.5 TB/s", availability: "99.96%" },
    { name: "India", nodeCount: 1, status: "degraded", avgLatency: "42ms", rps: "9,200 req/s", bandwidth: "2.8 TB/s", availability: "99.82%" },
    { name: "Africa", nodeCount: 1, status: "healthy", avgLatency: "52ms", rps: "3,800 req/s", bandwidth: "1.1 TB/s", availability: "99.90%" },
    { name: "Australia", nodeCount: 1, status: "healthy", avgLatency: "31ms", rps: "7,900 req/s", bandwidth: "2.4 TB/s", availability: "99.98%" }
  ];
  res.json({ totalNodes: nodes.length, activeNodes: nodes.filter(n => n.status !== 'offline').length, regions: regionsSummary, nodes });
});

// CDN API
app.get("/api/cdn", (req, res) => {
  res.json({ domains, cacheRules });
});

app.post("/api/cdn", (req, res) => {
  const { domain, origin } = req.body;
  if (!domain || !origin) return res.status(400).json({ error: "Domain and origin server are required." });
  const newDomain = {
    id: `dom-${Math.random().toString(36).substring(2, 7)}`,
    domain,
    origin,
    status: "active",
    ssl: "Active (TLS 1.3)",
    requests: "1.2M",
    bandwidth: "14 TB",
    cacheHitRatio: "92.0%"
  };
  domains.push(newDomain);
  res.status(201).json(newDomain);
});

app.post("/api/cdn/purge", (req, res) => {
  const { scope, target } = req.body;
  res.json({ success: true, message: `Successfully purged CDN cache for scope: ${scope} (${target || 'All zones'})` });
});

// Cache API
app.get("/api/cache", (req, res) => {
  res.json({
    hitRatio: 95.8,
    missRatio: 4.2,
    totalCacheSize: "420 TB",
    cachedObjects: "1.4 Billion",
    rules: cacheRules
  });
});

// Edge Functions API
app.get("/api/functions", (req, res) => {
  res.json(edgeFunctions);
});

app.post("/api/functions", (req, res) => {
  const { name, runtime, triggers, code } = req.body;
  if (!name) return res.status(400).json({ error: "Function name is required." });
  const newFunc = {
    id: `func-${Math.random().toString(36).substring(2, 7)}`,
    name,
    runtime: runtime || "JavaScript (V8 Isolate)",
    status: "deployed",
    triggers: triggers || "/*",
    lastModified: "Just now",
    invocations: "1.5K / day",
    code: code || `export default { async fetch(req) { return new Response("Hello EdgeMesh"); } }`
  };
  edgeFunctions.push(newFunc);
  res.status(201).json(newFunc);
});

app.post("/api/functions/:id/deploy", (req, res) => {
  const { id } = req.params;
  const func = edgeFunctions.find(f => f.id === id);
  if (!func) return res.status(404).json({ error: "Function not found" });
  func.status = "deployed";
  func.lastModified = "Just now";
  res.json({ success: true, message: `Successfully deployed function '${func.name}' to all 10 global edge nodes.` });
});

// Analytics API
app.get("/api/analytics", (req, res) => {
  res.json({
    summary: {
      totalRequests: "348.9 Billion",
      uniqueVisitors: "42.1 Billion",
      totalBandwidth: "1.84 PB",
      requestsPerSec: "138,400 req/s",
      avgLatency: "19.4ms",
      p50Latency: "14ms",
      p95Latency: "48ms",
      p99Latency: "112ms",
      statusDistribution: { "2xx": 91.4, "3xx": 5.2, "4xx": 2.8, "5xx": 0.6 }
    },
    topCountries: [
      { country: "United States", code: "US", requests: "128.4B", percentage: 36.8 },
      { country: "Germany", code: "DE", requests: "54.1B", percentage: 15.5 },
      { country: "Japan", code: "JP", requests: "48.2B", percentage: 13.8 },
      { country: "United Kingdom", code: "GB", requests: "32.6B", percentage: 9.3 },
      { country: "India", code: "IN", requests: "28.9B", percentage: 8.3 },
      { country: "Others", code: "WW", requests: "56.7B", percentage: 16.3 }
    ],
    timeSeries: [
      { time: "00:00", requests: 98000, bandwidth: 420 },
      { time: "04:00", requests: 74000, bandwidth: 310 },
      { time: "08:00", requests: 142000, bandwidth: 680 },
      { time: "12:00", requests: 198000, bandwidth: 940 },
      { time: "16:00", requests: 215000, bandwidth: 1020 },
      { time: "20:00", requests: 164000, bandwidth: 780 }
    ]
  });
});

// Security API
app.get("/api/security", (req, res) => {
  res.json({
    ddosProtection: "Active (Adaptive ML Shield)",
    sslStatus: "100% Valid (Auto-Renewing TLS 1.3)",
    firewallRulesCount: 48,
    events: securityEvents
  });
});

// AI Assistant Endpoint (Server-Side Gemini Integration)
app.post("/api/assistant", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemInstruction = `You are EdgeMesh AI, an expert Senior Infrastructure and Global Edge CDN Architect. 
You assist engineers in analyzing global network performance, explaining latency anomalies, identifying unhealthy edge nodes, recommending cache TTL and CDN optimization rules, diagnosing traffic spikes, and optimizing serverless edge functions.
You have access to live telemetry summary: 10 global edge nodes (Mumbai node #node-bom-01 is currently showing degraded CPU/memory utilization at 84% CPU and 42ms latency), 95.8% CDN cache hit ratio, 138k requests/sec.
Always be precise, technical, structured, and helpful. Distinguish clearly between demo simulated data and actual infrastructure. Never claim to perform destructive modifications without explicit confirmation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `User Query: ${prompt}\n\nContext State: ${JSON.stringify(context || { nodesCount: nodes.length, cacheHitRatio: "95.8%" })}`,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || "EdgeMesh AI analyzed your infrastructure telemetry successfully." });
  } catch (error: any) {
    console.error("Gemini Assistant Error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to generate AI response. Please check your API key in Settings > Secrets." 
    });
  }
});

// Vite middleware integration for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`EdgeMesh server running on http://0.0.0.0:${PORT}`);
});
