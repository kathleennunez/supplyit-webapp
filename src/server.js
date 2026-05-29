import express from "express";
import cron from "node-cron";
import path from "path";
import routes from "./api/routes.js";
import { runBackfill, runIngestion } from "./services/ingestion.js";
import { readJson } from "./utils/store.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", routes);
app.use(express.static(path.join(process.cwd(), "public")));

cron.schedule("0 7 * * 1", async () => {
  await runIngestion();
}, { timezone: "Asia/Manila" });

app.listen(port, async () => {
  console.log(`SupplyIT running at http://localhost:${port}`);
  try {
    const weekly = await readJson("weekly-prices.json");
    if (!Array.isArray(weekly) || weekly.length === 0) {
      console.log("No local DA dataset found. Running initial DA backfill...");
      await runBackfill(52);
      console.log("Initial DA backfill completed.");
    }
  } catch (error) {
    console.error("Initial DA bootstrap failed:", error?.message || error);
  }
});
