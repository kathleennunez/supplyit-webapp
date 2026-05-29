import { readJson, writeJson } from "../utils/store.js";
import { scoreSeries } from "./scoring.js";

function titleCase(s) {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function cleanDisplayName(name) {
  let n = name || "";
  n = n.replace(/(\d+\s*-\s*\d+\s*(pcs?|pc|cm|g|gm|kg|bundles?|heads?)[^,)]*)/gi, "");
  n = n.replace(/\b(local|imported)?\s*(medium|small|large)\b/gi, "");
  n = n.replace(/\bdiameter\b/gi, "");
  n = n.replace(/\b(bunch|hd|head)\b/gi, "");
  n = n.replace(/\s*\/\s*pc\b/gi, "");
  n = n.replace(/\s{2,}/g, " ").replace(/\s+,/g, ",").trim();
  return titleCase(n);
}

const DISPLAY_NAME_BY_ID = {
  "broccoli-localmedium-diameter-bunch-hd": "Broccoli",
  "cabbage-rare-ball-510-gm-1-kg-head": "Cabbage Rare Ball",
  "cabbage-scorpio-750-gm-1-kg-head": "Cabbage Scorpio",
  "cabbage-wonder-ball-510-gm-1-kg-head": "Cabbage Wonder Ball",
  "cauliflower-localmedium-diameter-bunch-hd": "Cauliflower",
  "carrots-local8-10-pcs-kg": "Carrots",
  "celerymedium": "Celery",
  "chayotemedium": "Chayote",
  "chilli-green-localhaba-panigang": "Chilli Green",
  "habichuelas-baguio-beans-local": "Baguio Beans",
  "squashsuprema-variety": "Squash",
  "white-potato-local10-12-pcs-kg": "White Potato"
};

function isValidDisplayName(name) {
  return String(name || "").replace(/[^a-zA-Z0-9]/g, "").length >= 3;
}

function latestWeeklyByProduct(weekly) {
  const map = new Map();
  for (const row of weekly) {
    const prev = map.get(row.productId);
    if (!prev || row.weekStart > prev.weekStart) map.set(row.productId, row);
  }
  return map;
}

function prevWeeklyByProduct(weekly, latestMap) {
  const map = new Map();
  for (const row of weekly) {
    const latest = latestMap.get(row.productId);
    if (!latest || row.weekStart >= latest.weekStart) continue;
    const prev = map.get(row.productId);
    if (!prev || row.weekStart > prev.weekStart) map.set(row.productId, row);
  }
  return map;
}

export async function getProducts(options = {}) {
  const { includeArchived = false } = options;
  const weekly = await readJson("weekly-prices.json");
  const custom = await readJson("products.json");
  const customMap = new Map((custom || []).map((p) => [p.id, p]));
  const latestMap = latestWeeklyByProduct(weekly);
  const products = [...latestMap.values()]
    .sort((a, b) => a.productName.localeCompare(b.productName))
    .map((r) => ({
      id: r.productId,
      name: DISPLAY_NAME_BY_ID[r.productId] || customMap.get(r.productId)?.alias || cleanDisplayName(r.productName),
      commodityGroup: r.commodityGroup,
      region: r.region,
      unit: "kg",
      stockQty: Number(customMap.get(r.productId)?.stockQty ?? 0),
      lowStockThreshold: Number(customMap.get(r.productId)?.lowStockThreshold ?? 100),
      quality: customMap.get(r.productId)?.quality || "A",
      archived: Boolean(customMap.get(r.productId)?.archived || false),
      pricePerUnit: r.price
    }))
    .filter((p) => isValidDisplayName(p.name) && (includeArchived ? true : !p.archived));
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveProduct(product) {
  const products = await readJson("products.json");
  const next = products.filter((p) => p.id !== product.id);
  next.push(product);
  await writeJson("products.json", next);
  return product;
}

export async function updateProduct(id, patch) {
  const products = await readJson("products.json");
  const exists = products.find((p) => p.id === id);
  const next = exists
    ? products.map((p) => (p.id === id ? { ...p, ...patch } : p))
    : [...products, { id, ...patch }];
  await writeJson("products.json", next);
  return next.find((p) => p.id === id) || null;
}

export async function getPlan() {
  return readJson("plan.json");
}

export async function savePlan(plan) {
  const plans = await readJson("plan.json");
  plans.push(plan);
  await writeJson("plan.json", plans);
  return plan;
}

export async function getPricePredictions() {
  const weekly = await readJson("weekly-prices.json");
  const products = await getProducts();
  const latestMap = latestWeeklyByProduct(weekly);
  const prevMap = prevWeeklyByProduct(weekly, latestMap);
  const dataWeek = [...new Set(weekly.map((w) => w.weekStart))].sort().at(-1) || null;

  const rows = products.map((p) => {
    const points = weekly.filter((w) => w.productId === p.id).sort((a, b) => a.weekStart.localeCompare(b.weekStart));
    const score = scoreSeries(points);
    const current = latestMap.get(p.id)?.price ?? null;
    const last = prevMap.get(p.id)?.price ?? null;
    const changePct = current && last ? Number((((current - last) / last) * 100).toFixed(2)) : 0;
    return {
      productId: p.id,
      productName: p.name,
      commodityGroup: p.commodityGroup,
      region: p.region,
      currentPrice: current,
      lastPrice: last,
      changePct,
      signal: score.regression,
      demand: score.final,
      votes: score,
      series: points.slice(-8).map((pt) => ({ weekStart: pt.weekStart, price: pt.price }))
    };
  });
  return { dataWeek, rows };
}

export async function getDemandEstimation() {
  const { dataWeek, rows } = await getPricePredictions();
  return { dataWeek, rows: rows.map((p) => ({ productId: p.productId, productName: p.productName, demand: p.demand, changePct: p.changePct })) };
}

export async function getRecommendations() {
  const { dataWeek, rows: preds } = await getPricePredictions();
  const custom = await readJson("products.json");
  const customMap = new Map((custom || []).map((p) => [p.id, p]));
  const rows = preds.map((p) => {
    let action = "HOLD";
    if (p.demand === "HIGH DEMAND") action = "BUY";
    if (p.demand === "LOW DEMAND") action = "DELAY";
    const manual = customMap.get(p.productId)?.manualAction;
    if (manual && ["BUY", "HOLD", "DELAY"].includes(manual)) action = manual;

    const quantity = action === "BUY" ? 1500 : action === "HOLD" ? 700 : 300;
    const confidence = p.demand === "UNAVAILABLE" ? 0 : p.votes.final === p.votes.decisionTree && p.votes.final === p.votes.knn ? 95 : 75;

    return {
      productId: p.productId,
      productName: p.productName,
      action,
      quantity,
      confidence,
      demand: p.demand,
      trend: p.signal,
      changePct: p.changePct,
      reason: `DA weekly change ${p.changePct}% | demand ${p.demand} | trend ${p.signal}`
    };
  });
  return { dataWeek, rows };
}

export async function getDashboard() {
  const products = await getProducts();
  const priceWrap = await getPricePredictions();
  const recWrap = await getRecommendations();
  const recs = recWrap.rows;
  const ingestion = await readJson("ingestion-status.json");
  const avgChange = recs.length ? Number((recs.reduce((s, r) => s + Number(r.changePct || 0), 0) / recs.length).toFixed(2)) : 0;
  const market = (priceWrap.rows || []).slice(0, 8).map((r) => ({
    productName: r.productName,
    currentPrice: r.currentPrice,
    changePct: r.changePct,
    demand: r.demand
  }));

  return {
    summary: {
      trackedCommodities: products.length,
      avgChange,
      priceUp: recs.filter((r) => r.changePct > 0).length,
      quickBuy: recs.filter((r) => r.action === "BUY").length,
      lastSync: ingestion.lastSync
    },
    dataWeek: recWrap.dataWeek,
    recommendations: recs,
    market
  };
}
