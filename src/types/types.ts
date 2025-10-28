interface Project {
  id: number;
  status: "active" | "archived" | "delete" | "cancel";
  user_id: string;
  username: string;
  profile_picture: string;
  price: number;
  title: string;
  description: string;
  offers: number;
  time_left: number;
  parent_category_id: number;
  category_id: number;
  user_projects_count: number;
  user_hired_percent: number;
  user_active_projects_count: number;
  achievements_list: Achievement[];
  allow_higher_price: boolean;
  possible_price_limit?: number;
  user_need_kwork: boolean;
  user_need_portfolio: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export type { Project };
