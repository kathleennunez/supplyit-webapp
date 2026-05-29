export function decisionTree(changePct) {
  if (changePct <= -20) return "HIGH DEMAND";
  if (changePct >= 30) return "LOW DEMAND";
  return "NEUTRAL";
}

export function linearRegressionSignal(prices) {
  const n = prices.length;
  const xMean = (n - 1) / 2;
  const yMean = prices.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (i - xMean) * (prices[i] - yMean);
    den += (i - xMean) ** 2;
  }
  const slope = den ? num / den : 0;
  return slope > 0 ? "UP" : "DOWN";
}

export function knnLabel(prices) {
  const refs = [
    { seq: [100, 95, 90, 85], label: "HIGH DEMAND" },
    { seq: [100, 105, 110, 118], label: "LOW DEMAND" },
    { seq: [100, 100, 99, 101], label: "NEUTRAL" }
  ];
  const base = prices[0] || 1;
  const norm = prices.map((p) => (p / base) * 100);
  const dist = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
  return refs.sort((a, b) => dist(norm, a.seq) - dist(norm, b.seq))[0].label;
}

export function scoreSeries(points) {
  if (points.length < 4) {
    return { decisionTree: "UNAVAILABLE", regression: "UNAVAILABLE", knn: "UNAVAILABLE", final: "UNAVAILABLE" };
  }
  const last4 = points.slice(-4).map((p) => p.price);
  const changePct = ((last4[3] - last4[0]) / last4[0]) * 100;
  const tree = decisionTree(changePct);
  const regSignal = linearRegressionSignal(last4);
  const regLabel = regSignal === "DOWN" ? "HIGH DEMAND" : "LOW DEMAND";
  const knn = knnLabel(last4);
  const votes = [tree, regLabel, knn];
  const high = votes.filter((v) => v === "HIGH DEMAND").length;
  const low = votes.filter((v) => v === "LOW DEMAND").length;
  const final = high >= 2 ? "HIGH DEMAND" : low >= 2 ? "LOW DEMAND" : "NEUTRAL";
  return { decisionTree: tree, regression: regSignal, knn, final };
}
