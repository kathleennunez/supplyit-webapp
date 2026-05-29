import express from "express";
import { getDashboard, getDemandEstimation, getPlan, getPricePredictions, getProducts, getRecommendations, savePlan, saveProduct, updateProduct } from "../services/domain.js";
import { rebuildCanonicalHistory, runBackfill, runIngestion } from "../services/ingestion.js";
import { readJson, writeJson } from "../utils/store.js";

const router = express.Router();

router.get("/dashboard", async (_req, res) => res.json(await getDashboard()));
router.get("/products", async (req, res) => {
  const includeArchived = String(req.query.includeArchived || "") === "1";
  res.json(await getProducts({ includeArchived }));
});
router.post("/products", async (req, res) => res.status(201).json(await saveProduct(req.body)));
router.put("/products/:id", async (req, res) => res.json(await updateProduct(req.params.id, req.body)));
router.get("/plan", async (_req, res) => res.json(await getPlan()));
router.post("/plan", async (req, res) => res.status(201).json(await savePlan(req.body)));
router.get("/prices", async (_req, res) => res.json(await getPricePredictions()));
router.get("/demand", async (_req, res) => res.json(await getDemandEstimation()));
router.get("/recommendations", async (_req, res) => res.json(await getRecommendations()));
router.get("/insights", async (_req, res) => {
  const recs = (await getRecommendations()).rows;
  res.json({ risks: recs.filter((r) => r.action === "DELAY").map((r) => `${r.productName} rising prices risk`), alerts: recs.filter((r) => r.action === "TOP-UP") });
});
router.get("/reports", async (_req, res) => {
  const plan = await getPlan();
  const recs = (await getRecommendations()).rows;
  res.json({ planSummary: plan[plan.length - 1], recommendations: recs });
});
router.get("/settings", async (_req, res) => res.json(await readJson("admin.json")));

router.get("/admin/overview", async (_req, res) => {
  const ingestion = await readJson("ingestion-status.json");
  const admin = await readJson("admin.json");
  res.json({ ingestion, users: admin.users, audit: admin.auditLog.slice(-20) });
});
router.get("/admin/ingestion-status", async (_req, res) => res.json(await readJson("ingestion-status.json")));
router.post("/admin/run-refresh", async (_req, res) => res.json(await runIngestion()));
router.post("/admin/run-backfill", async (req, res) => {
  const weeks = Number(req.query.weeks || req.body?.weeks || 12);
  res.json(await runBackfill(Number.isFinite(weeks) && weeks > 0 ? weeks : 12));
});
router.post("/admin/rebuild-history", async (req, res) => {
  const weeks = Number(req.query.weeks || req.body?.weeks || 52);
  res.json(await rebuildCanonicalHistory(Number.isFinite(weeks) && weeks > 0 ? weeks : 52));
});
router.post("/admin/users/:id/toggle", async (req, res) => {
  const admin = await readJson("admin.json");
  admin.users = admin.users.map((u) => (u.id === req.params.id ? { ...u, active: !u.active } : u));
  admin.auditLog.push({ at: new Date().toISOString(), action: "USER_TOGGLE", userId: req.params.id });
  await writeJson("admin.json", admin);
  res.json(admin.users.find((u) => u.id === req.params.id));
});

export default router;
