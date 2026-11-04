import express from "express";
import { GoogleGenAI } from "@google/genai";
import {
  initialWorkspaces,
  initialNodes,
  initialDomains,
  initialCacheRules,
  initialEdgeFunctions,
  initialSecurityEvents,
  initialNetworkData,
  initialAnalyticsData,
  initialSecurityData,
  initialCacheData
} from "../src/data/mockData";

const app = express();
app.use(express.json());

let workspaces = [...initialWorkspaces];
let nodes = [...initialNodes];
let domains = [...initialDomains];
let cacheRules = [...initialCacheRules];
let edgeFunctions = [...initialEdgeFunctions];
let securityEvents = [...initialSecurityEvents];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "2.4.0", providerMode: "Demo & Adapter Ready" });
});

app.get("/api/workspaces", (req, res) => {
  res.json(workspaces);
});

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

app.post("/api/nodes/bulk-update", (req, res) => {
  const { ids, updates } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids must be an array" });
  nodes = nodes.map(n => ids.includes(n.id) ? { ...n, ...updates } : n);
  res.json({ success: true, updatedCount: ids.length, nodes });
});

app.post("/api/nodes/bulk-delete", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ids must be an array" });
  nodes = nodes.filter(n => !ids.includes(n.id));
  res.json({ success: true, deletedCount: ids.length, remainingCount: nodes.length });
});

app.delete("/api/nodes/:id", (req, res) => {
  const { id } = req.params;
  nodes = nodes.filter(n => n.id !== id);
  res.json({ success: true, id });
});

app.get("/api/network", (req, res) => {
  res.json({ ...initialNetworkData, nodes });
});

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

app.get("/api/cache", (req, res) => {
  res.json({
    ...initialCacheData,
    rules: cacheRules
  });
});

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

app.get("/api/analytics", (req, res) => {
  res.json(initialAnalyticsData);
});

app.get("/api/security", (req, res) => {
  res.json({
    ...initialSecurityData,
    events: securityEvents
  });
});

app.post("/api/assistant", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const systemInstruction = `You are EdgeMesh AI, an expert Senior Infrastructure and Global Edge CDN Architect. 
You assist engineers in analyzing global network performance, explaining latency anomalies, identifying unhealthy edge nodes, recommending cache TTL and CDN optimization rules, diagnosing traffic spikes, and optimizing serverless edge functions.
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

export default app;
