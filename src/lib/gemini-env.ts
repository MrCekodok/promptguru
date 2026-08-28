import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

function parseEnvFile(filePath: string) {
  try {
    const text = readFileSync(filePath, "utf8");
    const out: Record<string, string> = {};
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      const value = line
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function localEnv() {
  return {
    ...parseEnvFile(path.join(process.cwd(), ".env.local")),
    ...parseEnvFile(path.join(projectRoot, ".env.local")),
  };
}

export function geminiApiKey() {
  return process.env.GEMINI_API_KEY?.trim() || localEnv().GEMINI_API_KEY?.trim() || "";
}

export function geminiModel() {
  const requested =
    process.env.GEMINI_MODEL?.trim() ||
    localEnv().GEMINI_MODEL?.trim() ||
    "gemini-3.6-flash";
  return /gemini-2\.[05]/.test(requested) ? "gemini-3.6-flash" : requested;
}
