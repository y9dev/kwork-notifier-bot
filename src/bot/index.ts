import { Telegraf } from "telegraf";
import { getProjects } from "../kwork/index.js";

import type { Project } from "../types/types.js";

export async function launchBot(token: string, kworkApiToken: string) {
  // Обьект для работы с Telegram
  const bot = new Telegraf(process.env.BOT_TOKEN!);

  bot.launch();
  console.log("Бот запущен.");

  const interval = setInterval(async () => {
    try {
      const newProjects = await getProjects(kworkApiToken);

      if (newProjects.length > 0) {
        await sendProjects(newProjects, bot);
      }
    } catch (err) {
      console.error("Ошибка при обработке заказов:", err);
    }
  }, 2000);

  // Плавное выключение программы в случае остановки
  process.once("SIGINT", () => {
    clearInterval(interval);
    bot.stop("SIGINT");
  });
  process.once("SIGTERM", () => {
    clearInterval(interval);
    bot.stop("SIGTERM");
  });
}

async function sendProjects(projects: Project[], bot: Telegraf) {
  for (const project of projects.reverse()) {
    const text =
      `Новый заказ: ${project.title}` +
      "\n\n" +
      `${await escapeHtml(project.description)}` +
      "\n\n" +
      `<b>Желаемый бюджет</b>: <i>до ${project.price.toLocaleString(
        "ru-RU"
      )} ₽</i>` +
      (project.allow_higher_price &&
      project.price !== project.possible_price_limit
        ? "\n" +
          `<b>Допустимый бюджет</b>: <i>до ${project.possible_price_limit?.toLocaleString(
            "ru-RU"
          )} ₽</i>`
        : "") +
      "\n\n" +
      `<b>Количество проектов</b>: <i>${project.user_projects_count}</i>` +
      "\n" +
      `<b>Процент найма</b>: <i>${project.user_hired_percent}%</i>`;

    await bot.telegram.sendMessage(process.env.GROUP_ID!, text, {
      parse_mode: "HTML",
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Перейти",
              url: `https://kwork.ru/projects/${project.id}/view`,
            },
            {
              text: "Откликнутся",
              url: `https://kwork.ru/new_offer?project=${project.id}`,
            },
          ],
        ],
      },
    });
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function escapeHtml(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(?!\/?(b|i|u|s|a|code|pre)\b)[^>]*>/gi, "")
    .trim();
}
