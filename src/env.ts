import { config } from "dotenv";

config();

export function validateEnv(): { ok: boolean; comment?: string } {
  const required = ["LOGIN", "PASSWORD", "BOT_TOKEN", "GROUP_ID"];
  const missing = required.find((v) => !process.env[v]);

  if (missing) {
    return {
      ok: false,
      comment: `Env value is not defined: ${missing}`,
    };
  }
  return { ok: true };
}
