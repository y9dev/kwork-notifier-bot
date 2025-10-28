import axios from "axios";
import { appendId, existId } from "./state.js";

import type { Project } from "../types/types.js";

// Сессия для запросов
const session = axios.create({
  baseURL: "https://api.kwork.ru/",
  //                            Токен для работы с KworkApi
  headers: { Authorization: "Basic bW9iaWxlX2FwaTpxRnZmUmw3dw==" },
});

export async function getToken(): Promise<string> {
  const { data } = await session.request({
    method: "post",
    url: "signIn",
    params: {
      login: process.env.LOGIN,
      password: process.env.PASSWORD,
      phone_last: process.env.PHONE,
    },
  });

  if (!data?.response?.token)
    throw new Error("Failed to getToken:" + JSON.stringify(data));

  return data.response.token;
}

// Функция получения новых проектов
export async function getProjects(token: string): Promise<Project[]> {
  const { data } = await session.request({
    method: "post",
    url: "projects",
    params: {
      token: token,
      categories: process.env.FAVOURITE_CATEGORIES,
    },
  });

  // Полученные проекты
  const currentProjects: Project[] = data.response;

  // Новые проекты
  const newProjects: Project[] = [];

  for (const project of currentProjects) {
    if (!(await existId(project.id))) {
      newProjects.push(project);
      await appendId(project.id);
    }
  }
  return newProjects;
}
