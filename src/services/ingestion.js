import { readJson, writeJson } from "../utils/store.js";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const SOURCE = "https://www.da.gov.ph/price-monitoring/";
const WANTED_GROUPS = ["LOWLAND VEGETABLES", "HIGHLAND VEGETABLES"];
const STOP_HEADERS = new Set([
  "LIVESTOCK AND POULTRY PRODUCTS",
  "FISHERY PRODUCTS",
  "OTHER BASIC COMMODITIES",
  "SPICES",
  "FRUITS"
]);

function mondayDateISO(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function slugifyName(name) {
  return name.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeName(raw) {
  let n = raw.replace(/\s+/g, " ").trim();
  n = n.replace(/\s+\((?:SRP|WHOLESALE).*?\)$/i, "");
  // Remove size/count descriptors that often vary by week and break continuity.
  n = n.replace(/\b\d+\s*-\s*\d+\s*(pcs?|pc|cm|mm|g|gm|kg|bundles?|heads?)\b/gi, "");
  n = n.replace(/\b(medium|small|large|local|imported)\b\s*(\([^)]*\))?/gi, (m) => {
    // keep local/imported signal only when standalone meaningful qualifier
    if (/^local$/i.test(m.trim()) || /^imported$/i.test(m.trim())) return m.trim();
    return "";
  });
  n = n.replace(/[(),]+/g, " ");
  n = n.replace(/\s{2,}/g, " ").trim();
  return n;
}

function parseWeekStart(text, pdfUrl = "") {
  const m = text.match(/For the period of ([A-Za-z]+)\s+(\d{1,2})-\d{1,2},\s*(\d{4})/i);
  if (m) {
    const [, month, day, year] = m;
    const d = new Date(`${month} ${day}, ${year} 00:00:00 GMT+0800`);
    if (!Number.isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const u = pdfUrl.match(/Weekly-Average-Prices-([A-Za-z]+)-(\d{1,2})-\d{1,2}-(\d{4})\.pdf/i);
  if (u) {
    const [, month, day, year] = u;
    const d = new Date(`${month} ${day}, ${year} 00:00:00 GMT+0800`);
    if (!Number.isNaN(d.getTime())) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return mondayDateISO();
}

function findLatestPdfUrl(html) {
  const links = [...html.matchAll(/href="([^"]*Weekly-Average-Prices[^"]*\.pdf)"/gi)].map((m) => m[1]);
  if (!links.length) throw new Error("No DA weekly PDF link found");
  return new URL(links[0], SOURCE).toString();
}

function findWeeklyPdfUrls(html, limit = 12) {
  const links = [...html.matchAll(/href="([^"]*Weekly-Average-Prices[^"]*\.pdf)"/gi)].map((m) => new URL(m[1], SOURCE).toString());
  const unique = [...new Set(links)];
  const withDate = unique.map((url) => {
    const u = url.match(/Weekly-Average-Prices-([A-Za-z]+)-(\d{1,2})-(\d{1,2})-(\d{4})\.pdf/i);
    if (!u) return { url, ts: 0 };
    const [, month, dayStart, , year] = u;
    const d = new Date(`${month} ${dayStart}, ${year} 00:00:00 GMT+0800`);
    return { url, ts: Number.isNaN(d.getTime()) ? 0 : d.getTime() };
  });
  return withDate.sort((a, b) => b.ts - a.ts).slice(0, limit).map((x) => x.url);
}

function extractPdfLinksFromHtml(html) {
  return [...html.matchAll(/href="([^"]*Weekly-Average-Prices[^"]*\.pdf)"/gi)].map((m) => new URL(m[1], SOURCE).toString());
}

async function fetchHistoricalPdfUrls(limit = 52) {
  const urls = new Set();

  const rootResp = await fetch(SOURCE, { cache: "no-store" });
  if (!rootResp.ok) throw new Error(`DA page fetch failed (${rootResp.status})`);
  const rootHtml = await rootResp.text();
  for (const u of extractPdfLinksFromHtml(rootHtml)) urls.add(u);

  // WordPress posts API pagination for deeper history.
  for (let page = 1; page <= 12; page += 1) {
    const wpUrl = `${SOURCE}wp-json/wp/v2/posts?per_page=100&page=${page}&search=Weekly-Average-Prices`;
    try {
      const resp = await fetch(wpUrl, { cache: "no-store" });
      if (!resp.ok) break;
      const body = await resp.text();
      let posts = [];
      try {
        posts = JSON.parse(body);
      } catch {
        break;
      }
      if (!Array.isArray(posts) || posts.length === 0) break;
      for (const post of posts) {
        const rendered = post?.content?.rendered || "";
        for (const u of extractPdfLinksFromHtml(rendered)) urls.add(u);
      }
    } catch {
      break;
    }
  }

  const withDate = [...urls].map((url) => {
    const u = url.match(/Weekly-Average-Prices-([A-Za-z]+)-(\d{1,2})-(\d{1,2})-(\d{4})\.pdf/i);
    if (!u) return { url, ts: 0 };
    const [, month, dayStart, , year] = u;
    const d = new Date(`${month} ${dayStart}, ${year} 00:00:00 GMT+0800`);
    return { url, ts: Number.isNaN(d.getTime()) ? 0 : d.getTime() };
  });

  return withDate
    .filter((x) => x.ts > 0)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit)
    .map((x) => x.url);
}

function extractSectionLines(lines, header) {
  const start = lines.findIndex((l) => l.toUpperCase() === header);
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const upper = line.toUpperCase();
    if (!line) continue;
    if (WANTED_GROUPS.includes(upper) || STOP_HEADERS.has(upper)) break;
    out.push(line);
  }
  return out;
}

function parsePriceRows(lines, commodityGroup) {
  const rows = [];
  let pending = null;
  const isValidName = (name) => {
    if (!name) return false;
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, "");
    return cleaned.length >= 3;
  };
  for (const line of lines) {
    const inline = line.match(/^(.*?)\s*(kg|pc|doz|cav|bag|L|ml)\s+([0-9]+(?:\.[0-9]+)?)\s*$/i);
    if (inline) {
      const productName = normalizeName(inline[1]);
      if (!isValidName(productName)) continue;
      rows.push({
        commodityGroup,
        productName,
        productId: slugifyName(productName),
        unit: inline[2],
        price: Number(inline[3])
      });
      pending = null;
      continue;
    }

    const unitAttached = line.match(/^(.*?)(kg|pc|doz|cav|bag|L|ml)\s*$/i);
    if (unitAttached && !/^[0-9.]+$/.test(unitAttached[1].trim())) {
      pending = { name: normalizeName(unitAttached[1]), unit: unitAttached[2] };
      continue;
    }

    if (pending) {
      const priceMatch = line.match(/^([0-9]+(?:\.[0-9]+)?)$/);
      if (priceMatch) {
        if (!isValidName(pending.name)) {
          pending = null;
          continue;
        }
        rows.push({
          commodityGroup,
          productName: pending.name,
          productId: slugifyName(pending.name),
          unit: pending.unit,
          price: Number(priceMatch[1])
        });
        pending = null;
        continue;
      }
      if (line === "-") {
        pending = null;
      }
    }
  }
  return rows;
}

export async function runIngestion() {
  const weekly = await readJson("weekly-prices.json");
  const status = await readJson("ingestion-status.json");
  const now = new Date().toISOString();
  try {
    const htmlResp = await fetch(SOURCE, { cache: "no-store" });
    if (!htmlResp.ok) throw new Error(`DA page fetch failed (${htmlResp.status})`);
    const html = await htmlResp.text();
    const pdfUrl = findLatestPdfUrl(html);

    const pdfResp = await fetch(pdfUrl, { cache: "no-store" });
    if (!pdfResp.ok) throw new Error(`DA PDF fetch failed (${pdfResp.status})`);
    const pdfBuffer = Buffer.from(await pdfResp.arrayBuffer());
    const pdf = await pdfParse(pdfBuffer);

    const weekStart = parseWeekStart(pdf.text, pdfUrl);
    const lines = pdf.text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
    const lowlandRows = parsePriceRows(extractSectionLines(lines, "LOWLAND VEGETABLES"), "LOWLAND VEGETABLES");
    const highlandRows = parsePriceRows(extractSectionLines(lines, "HIGHLAND VEGETABLES"), "HIGHLAND VEGETABLES");
    const parsed = [...lowlandRows, ...highlandRows].map((r) => ({
      weekStart,
      commodityGroup: r.commodityGroup,
      productId: r.productId,
      productName: r.productName,
      region: "NCR",
      price: r.price
    }));

    if (!parsed.length) throw new Error("Parsed 0 rows from DA PDF");

    const existing = new Set(weekly.map((w) => `${w.weekStart}|${w.productId}`));
    const nextRows = parsed.filter((r) => !existing.has(`${r.weekStart}|${r.productId}`));
    await writeJson("weekly-prices.json", [...weekly, ...nextRows]);

    await writeJson("ingestion-status.json", {
      ...status,
      healthy: true,
      source: SOURCE,
      lastAttempt: now,
      lastSync: now,
      errors: [],
      coverage: { commodityGroups: ["LOWLAND VEGETABLES", "HIGHLAND VEGETABLES"], rows: nextRows.length }
    });

    return { ok: true, added: nextRows.length, weekStart, pdfUrl };
  } catch (error) {
    await writeJson("ingestion-status.json", {
      ...status,
      healthy: false,
      source: SOURCE,
      lastAttempt: now,
      errors: [error instanceof Error ? error.message : "Unknown ingestion error"]
    });
    return { ok: false, added: 0, error: error instanceof Error ? error.message : "Unknown ingestion error" };
  }
}

export async function runBackfill(weeks = 12) {
  const weekly = await readJson("weekly-prices.json");
  const status = await readJson("ingestion-status.json");
  const now = new Date().toISOString();

  try {
    const pdfUrls = await fetchHistoricalPdfUrls(weeks);

    const existing = new Set(weekly.map((w) => `${w.weekStart}|${w.productId}`));
    const allRows = [];

    for (const pdfUrl of pdfUrls) {
      const pdfResp = await fetch(pdfUrl, { cache: "no-store" });
      if (!pdfResp.ok) continue;
      const pdfBuffer = Buffer.from(await pdfResp.arrayBuffer());
      const pdf = await pdfParse(pdfBuffer);
      const weekStart = parseWeekStart(pdf.text, pdfUrl);
      const lines = pdf.text.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
      const lowlandRows = parsePriceRows(extractSectionLines(lines, "LOWLAND VEGETABLES"), "LOWLAND VEGETABLES");
      const highlandRows = parsePriceRows(extractSectionLines(lines, "HIGHLAND VEGETABLES"), "HIGHLAND VEGETABLES");
      const parsed = [...lowlandRows, ...highlandRows].map((r) => ({
        weekStart,
        commodityGroup: r.commodityGroup,
        productId: r.productId,
        productName: r.productName,
        region: "NCR",
        price: r.price
      }));

      for (const row of parsed) {
        const key = `${row.weekStart}|${row.productId}`;
        if (!existing.has(key)) {
          existing.add(key);
          allRows.push(row);
        }
      }
    }

    if (allRows.length) {
      const next = [...weekly, ...allRows].sort((a, b) => {
        if (a.productId === b.productId) return a.weekStart.localeCompare(b.weekStart);
        return a.productId.localeCompare(b.productId);
      });
      await writeJson("weekly-prices.json", next);
    }

    await writeJson("ingestion-status.json", {
      ...status,
      healthy: true,
      source: SOURCE,
      lastAttempt: now,
      lastSync: now,
      errors: [],
      coverage: { commodityGroups: ["LOWLAND VEGETABLES", "HIGHLAND VEGETABLES"], rows: allRows.length }
    });

    return { ok: true, added: allRows.length, scanned: pdfUrls.length };
  } catch (error) {
    await writeJson("ingestion-status.json", {
      ...status,
      healthy: false,
      source: SOURCE,
      lastAttempt: now,
      errors: [error instanceof Error ? error.message : "Unknown backfill error"]
    });
    return { ok: false, added: 0, error: error instanceof Error ? error.message : "Unknown backfill error" };
  }
}

export async function rebuildCanonicalHistory(weeks = 52) {
  // Reset and rebuild weekly series from DA only, using the latest canonical parser.
  await writeJson("weekly-prices.json", []);
  return runBackfill(weeks);
}
