export type Role = "student" | "college" | "company";

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string;
  organization?: string;
  organizationShort?: string;
  position?: string;
  group?: string;
  specialty?: string;
};

export const ORGANIZATION_CODES: {
  code: string;
  role: Exclude<Role, "student">;
  organization: string;
  organizationShort: string;
}[] = [
  {
    code: "MTK-2025",
    role: "college",
    organization: "Московский технологический колледж",
    organizationShort: "МТК",
  },
  {
    code: "YANDEX-2025",
    role: "company",
    organization: "Яндекс Практика",
    organizationShort: "Я",
  },
];

export const seedUsers: User[] = [
  {
    id: "u-student",
    role: "student",
    name: "Алексей Морозов",
    email: "student@praktika.pro",
    password: "student123",
    group: "ИС-21",
    specialty: "Информационные системы",
  },
  {
    id: "u-college",
    role: "college",
    name: "Ирина Смирнова",
    email: "college@praktika.pro",
    password: "college123",
    organization: "Московский технологический колледж",
    organizationShort: "МТК",
    position: "Руководитель практики",
  },
  {
    id: "u-college-2",
    role: "college",
    name: "Дмитрий Орлов",
    email: "orlov@mtk.ru",
    password: "college123",
    organization: "Московский технологический колледж",
    organizationShort: "МТК",
    position: "Куратор практики",
  },
  {
    id: "u-college-3",
    role: "college",
    name: "Наталья Белова",
    email: "belova@mtk.ru",
    password: "college123",
    organization: "Московский технологический колледж",
    organizationShort: "МТК",
    position: "Делопроизводитель",
  },
  {
    id: "u-company",
    role: "company",
    name: "Елена Сергеева",
    email: "company@praktika.pro",
    password: "company123",
    organization: "Яндекс Практика",
    organizationShort: "Я",
    position: "HR-менеджер",
  },
  {
    id: "u-company-2",
    role: "company",
    name: "Павел Кузнецов",
    email: "kuznetsov@yandex.ru",
    password: "company123",
    organization: "Яндекс Практика",
    organizationShort: "Я",
    position: "Наставник практики",
  },
  {
    id: "u-company-3",
    role: "company",
    name: "Ольга Лебедева",
    email: "lebedeva@yandex.ru",
    password: "company123",
    organization: "Яндекс Практика",
    organizationShort: "Я",
    position: "Координатор практики",
  },
];

const USERS_KEY = "praktika.users.v1";
const SESSION_KEY = "praktika.session.v1";

export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return seedUsers;
    const stored = JSON.parse(raw) as User[];
    if (!Array.isArray(stored)) return seedUsers;
    const byId = new Map(stored.filter((user) => user?.id).map((user) => [user.id, user]));
    for (const user of seedUsers) {
      if (!byId.has(user.id)) byId.set(user.id, user);
    }
    return [...byId.values()];
  } catch {
    return seedUsers;
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* хранилище недоступно — работаем только в памяти */
  }
}

export type Session = { userId: string; remember: boolean };

export function loadSession(): Session | null {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (!raw) continue;
      const session = JSON.parse(raw) as Session;
      if (session?.userId) return session;
    } catch {
      /* игнорируем повреждённую сессию */
    }
  }
  return null;
}

export function saveSession(userId: string, remember: boolean): void {
  clearSession();
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify({ userId, remember }));
  } catch {
    /* ignore */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function userInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function roleLabel(role: Role): string {
  return role === "student" ? "Студент" : role === "college" ? "Техникум" : "Предприятие";
}
