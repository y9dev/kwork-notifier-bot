import { validateEnv } from "./env.js";
import { getToken } from "./kwork/index.js";
import { launchBot } from "./bot/index.js";

const validated = validateEnv();
if (!validated.ok) throw new Error(validated.comment);

(async () => {
  const kworkApiToken = await getToken();

  await launchBot(process.env.BOT_TOKEN!, kworkApiToken);
})();
