type Model = {
  weights: number[];
  bias: number;
};

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

export async function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));
  return { headers, rows };
}

export function toNumericDataset(rows: string[][], labelIndex?: number) {
  if (rows.length === 0) return { X: [], y: [] };
  const cols = rows[0].length;
  const li = labelIndex ?? (cols - 1);
  const X: number[][] = [];
  const y: number[] = [];

  rows.forEach((r) => {
    const numeric = r.map((c) => {
      const v = parseFloat(c);
      return Number.isFinite(v) ? v : NaN;
    });
    if (Number.isFinite(numeric[li])) {
      const features = numeric.filter((_, i) => i !== li).map((v) => (Number.isFinite(v) ? v : 0));
      X.push(features);
      y.push(numeric[li] > 0 ? 1 : 0);
    }
  });

  return { X, y };
}

export function normalizeFeatures(X: number[][]) {
  const m = X.length;
  if (m === 0) return { Xn: X, mean: [], std: [] };
  const n = X[0].length;
  const mean = new Array(n).fill(0);
  const std = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) mean[j] += X[i][j];
    mean[j] /= m;
    for (let i = 0; i < m; i++) std[j] += (X[i][j] - mean[j]) ** 2;
    std[j] = Math.sqrt(std[j] / m) || 1;
  }
  const Xn = X.map((row) => row.map((v, j) => (v - mean[j]) / std[j]));
  return { Xn, mean, std };
}

export function trainLogisticRegression(X: number[][], y: number[], options?: { lr?: number; epochs?: number; batchSize?: number; }) : Model {
  const lr = options?.lr ?? 0.1;
  const epochs = options?.epochs ?? 500;
  const m = X.length;
  if (m === 0) return { weights: [], bias: 0 };
  const n = X[0].length;
  const weights = new Array(n).fill(0);
  let bias = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradW = new Array(n).fill(0);
    let gradB = 0;
    for (let i = 0; i < m; i++) {
      let z = bias;
      for (let j = 0; j < n; j++) z += weights[j] * X[i][j];
      const pred = sigmoid(z);
      const err = pred - y[i];
      for (let j = 0; j < n; j++) gradW[j] += err * X[i][j];
      gradB += err;
    }
    for (let j = 0; j < n; j++) weights[j] -= (lr * gradW[j]) / m;
    bias -= (lr * gradB) / m;
  }

  return { weights, bias };
}

export function predict(model: Model, x: number[]) {
  let z = model.bias;
  for (let i = 0; i < model.weights.length; i++) z += model.weights[i] * (x[i] ?? 0);
  return sigmoid(z) >= 0.5 ? 1 : 0;
}

export function scoreModel(model: Model, X: number[][], y: number[]) {
  if (X.length === 0) return 0;
  let correct = 0;
  for (let i = 0; i < X.length; i++) {
    if (predict(model, X[i]) === y[i]) correct++;
  }
  return correct / X.length;
}

export type { Model };
