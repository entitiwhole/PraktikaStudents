import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Role = "student" | "college" | "company";
type Page =
  | "home"
  | "company"
  | "apply"
  | "status"
  | "documents"
  | "profile"
  | "faq"
  | "login"
  | "sitemap"
  | "404";
type Toast = { id: number; kind: "success" | "error"; text: string };

const companies = [
  {
    id: 1,
    name: "Московский метрополитен",
    short: "ММ",
    sector: "Транспорт",
    address: "Москва, проспект Мира, 41",
    places: 12,
    color: "#2563EB",
    description:
      "Крупнейшее транспортное предприятие столицы приглашает студентов на производственную практику в подразделения эксплуатации и технического обслуживания.",
  },
  {
    id: 2,
    name: "Яндекс Практика",
    short: "Я",
    sector: "IT",
    address: "Москва, ул. Льва Толстого, 16",
    places: 8,
    color: "#111827",
    description:
      "Практика в продуктовых командах: реальные задачи, поддержка наставника и возможность продолжить карьеру после обучения.",
  },
  {
    id: 3,
    name: "Россети Московский регион",
    short: "РС",
    sector: "Энергетика",
    address: "Москва, 2-й Павелецкий пр-д, 3",
    places: 16,
    color: "#16A34A",
    description:
      "Получите опыт работы на современных энергетических объектах под руководством опытных инженеров.",
  },
  {
    id: 4,
    name: "Автодор",
    short: "АД",
    sector: "Транспорт",
    address: "Москва, Страстной бульвар, 9",
    places: 5,
    color: "#EA580C",
    description:
      "Практика в области дорожного строительства, эксплуатации инфраструктуры и цифрового мониторинга.",
  },
  {
    id: 5,
    name: "VK Tech",
    short: "VK",
    sector: "IT",
    address: "Москва, Ленинградский пр-т, 39",
    places: 6,
    color: "#0077FF",
    description:
      "Погружение в разработку высоконагруженных сервисов и знакомство с современным технологическим стеком.",
  },
  {
    id: 6,
    name: "Мосэнергосбыт",
    short: "МЭ",
    sector: "Энергетика",
    address: "Москва, ул. Вавилова, 9",
    places: 9,
    color: "#7C3AED",
    description:
      "Практика для будущих специалистов по электроснабжению, учёту энергии и работе с клиентами.",
  },
  {
    id: 7,
    name: "Сбер",
    short: "СБ",
    sector: "IT",
    address: "Москва, ул. Вавилова, 19",
    places: 10,
    color: "#0A8F3C",
    description:
      "Практика в командах цифрового бизнеса: аналитика данных, разработка сервисов и работа с клиентскими продуктами.",
  },
  {
    id: 8,
    name: "РЖД",
    short: "РЖД",
    sector: "Транспорт",
    address: "Москва, Каланчёвская пл., 1",
    places: 14,
    color: "#C81E1E",
    description:
      "Производственная практика в подразделениях перевозок, инфраструктуры и цифровой логистики.",
  },
  {
    id: 9,
    name: "Ростех",
    short: "РТ",
    sector: "Промышленность",
    address: "Москва, ул. Усачёва, 24",
    places: 7,
    color: "#0E7490",
    description:
      "Практика на промышленных предприятиях холдинга: инженерия, автоматизация и техническое сопровождение.",
  },
];

const initialApplications = [
  {
    id: 1,
    name: "Алексей Морозов",
    group: "ИС-21",
    company: "Яндекс Практика",
    specialty: "Информационные системы",
    date: "12.05.2025",
    status: "На проверке",
  },
  {
    id: 2,
    name: "Мария Иванова",
    group: "ЭЛ-22",
    company: "Россети Московский регион",
    specialty: "Электроснабжение",
    date: "11.05.2025",
    status: "Одобрена",
  },
  {
    id: 3,
    name: "Илья Соколов",
    group: "ТО-21",
    company: "Московский метрополитен",
    specialty: "Техническое обслуживание",
    date: "10.05.2025",
    status: "Ожидает",
  },
  {
    id: 4,
    name: "Анна Кузнецова",
    group: "ИС-22",
    company: "VK Tech",
    specialty: "Сетевое администрирование",
    date: "08.05.2025",
    status: "Отклонена",
  },
];

const icons: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </>
  ),
  moon: <path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  down: <path d="m6 9 6 6 6-6" />,
  map: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4m0 0L7 9m5-5 5 5" />
      <path d="M20 16v4H4v-4" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8m-8 4h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  download: (
    <>
      <path d="M12 3v12m0 0 5-5m-5 5-5-5" />
      <path d="M4 19h16" />
    </>
  ),
  arrow: <path d="m9 18 6-6-6-6" />,
  up: <path d="m18 15-6-6-6 6" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3h4v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.37.2.76.2 1.17H21v4h-1.4c0 .29-.08.57-.2.83Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  pencil: (
    <>
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m13.5 7.5 3 3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-.9.7-1.5 1.2-1.5 2.3" />
      <path d="M12 17h.01" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </>
  ),
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Badge({ status }: { status: string }) {
  const cls =
    status.includes("Одобр") || status === "Подлинный"
      ? "green"
      : status.includes("Откл") || status.includes("измен")
        ? "red"
        : status.includes("проверк")
          ? "amber"
          : "blue";
  const statusIcon =
    status === "Подлинный" ? "check" : status.includes("проверк") ? "clock" : undefined;
  return (
    <span className={`badge ${cls}`} tabIndex={0} data-tip={`Статус: ${status}`}>
      {statusIcon && <Icon name={statusIcon} size={13} />}
      {status}
    </span>
  );
}

function Breadcrumbs({ items, navigate }: { items: string[]; navigate: (p: Page) => void }) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      <button onClick={() => navigate("home")}>Главная</button>
      {items.map((x, index) => (
        <span className={index === items.length - 1 ? "current" : "breadcrumb-link"} key={x}>
          <Icon name="chevron" size={14} />
          {x}
        </span>
      ))}
    </nav>
  );
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: string;
  icon?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type={type} disabled={disabled}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="empty fade">
      <div className="empty-icon">
        <Icon name="search" size={28} />
      </div>
      <h3>Ничего не найдено</h3>
      <p>Попробуйте изменить запрос или сбросить выбранные фильтры.</p>
      <Button variant="secondary" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}

function Header({
  role,
  page,
  dark,
  menu,
  setDark,
  setMenu,
  navigate,
  setRole,
  logout,
}: {
  role: Role;
  page: Page;
  dark: boolean;
  menu: boolean;
  setDark: (v: boolean) => void;
  setMenu: (v: boolean) => void;
  navigate: (p: Page) => void;
  setRole: (r: Role) => void;
  logout: () => void;
}) {
  const roleLabel =
    role === "student" ? "Студент" : role === "college" ? "Техникум" : "Предприятие";
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Заявка одобрена",
      text: "Россети Московский регион",
      time: "2 ч назад",
      read: false,
    },
    {
      id: 2,
      title: "Документ проверен",
      text: "Направление на практику",
      time: "вчера",
      read: false,
    },
    {
      id: 3,
      title: "Новая вакансия",
      text: "Сбер · 10 мест",
      time: "2 дня назад",
      read: false,
    },
  ]);
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escape);
    };
  }, [notifOpen]);
  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="brand"
          onClick={() => navigate("home")}
          aria-label="Практика.ПРО — на главную"
        >
          <span className="brand-mark">
            <Icon name="check" size={17} />
          </span>
          <span>
            Практика<span>.ПРО</span>
          </span>
        </button>
        <nav className={`nav ${menu ? "open" : ""}`} aria-label="Основная навигация">
          {role === "student" && (
            <>
              <button className={page === "home" ? "active" : ""} onClick={() => navigate("home")}>
                Предприятия
              </button>
              <button
                className={page === "status" ? "active" : ""}
                onClick={() => navigate("status")}
              >
                Мои заявки
              </button>
              <button
                className={page === "documents" ? "active" : ""}
                onClick={() => navigate("documents")}
              >
                Документы
              </button>
            </>
          )}
          {role !== "student" && (
            <>
              <button className="active" onClick={() => navigate("home")}>
                Обзор
              </button>
              <button onClick={() => navigate("faq")}>Помощь</button>
            </>
          )}
        </nav>
        <div className="header-actions">
          <div className="role-switch">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
                navigate("home");
              }}
              aria-label="Переключить роль"
            >
              <option value="student">Студент</option>
              <option value="college">Техникум</option>
              <option value="company">Предприятие</option>
            </select>
          </div>
          <button
            className="icon-btn"
            onClick={() => setDark(!dark)}
            aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
          >
            {dark ? <Icon name="sun" /> : <Icon name="moon" />}
          </button>
          <div className="notification-wrap" ref={notifRef}>
            <button
              className={`icon-btn notification ${notifOpen ? "active" : ""}`}
              onClick={() => setNotifOpen((open) => !open)}
              aria-label={unread ? `Уведомления: ${unread} новых` : "Уведомления"}
              aria-expanded={notifOpen}
            >
              <Icon name="bell" size={24} />
              {unread > 0 && <span>{unread}</span>}
            </button>
            {notifOpen && (
              <div className="notif-menu fade" role="menu" aria-label="Уведомления">
                <div className="notif-head">
                  <b>Уведомления</b>
                  <button
                    onClick={() =>
                      setNotifications((items) => items.map((item) => ({ ...item, read: true })))
                    }
                  >
                    Прочитать все
                  </button>
                </div>
                {notifications.map((item) => (
                  <button
                    className={`notif-item ${item.read ? "read" : ""}`}
                    key={item.id}
                    role="menuitem"
                    onClick={() => {
                      setNotifications((items) =>
                        items.map((x) => (x.id === item.id ? { ...x, read: true } : x)),
                      );
                      navigate(item.id === 3 ? "home" : "status");
                      setNotifOpen(false);
                    }}
                  >
                    <span className="notif-dot" aria-hidden="true" />
                    <span>
                      <b>{item.title}</b>
                      <small>
                        {item.text} · {item.time}
                      </small>
                    </span>
                  </button>
                ))}
                {!notifications.length && <p className="notif-empty">Новых уведомлений нет</p>}
              </div>
            )}
          </div>
          <div className="user-menu">
            <button
              className="user"
              onClick={() => navigate("profile")}
              aria-label="Открыть профиль"
            >
              <span className="avatar">АМ</span>
              <span className="user-copy">
                <b>Алексей Морозов</b>
                <small>{roleLabel}</small>
              </span>
              <Icon name="down" size={14} />
            </button>
            <div className="user-dropdown">
              <button onClick={() => navigate("profile")}>
                <Icon name="settings" size={17} />
                Профиль
              </button>
              <button className="logout-link" onClick={logout}>
                <Icon name="logout" size={17} />
                Выйти
              </button>
            </div>
          </div>
          <button
            className="mobile-menu icon-btn"
            onClick={() => setMenu(!menu)}
            aria-label="Открыть меню"
          >
            {menu ? <Icon name="close" /> : <Icon name="menu" />}
          </button>
        </div>
      </div>
      {menu && (
        <div className="mobile-drawer fade">
          <button onClick={() => navigate("home")}>Обзор</button>
          {role === "student" && (
            <>
              <button onClick={() => navigate("status")}>Мои заявки</button>
              <button onClick={() => navigate("documents")}>Документы</button>
            </>
          )}
          <button onClick={() => navigate("faq")}>Помощь и FAQ</button>
          <button onClick={logout}>Выйти</button>
        </div>
      )}
    </header>
  );
}

function StudentHome({
  navigate,
  toast,
}: {
  navigate: (p: Page, id?: number) => void;
  toast: (k: "success" | "error", t: string) => void;
}) {
  const [sector, setSector] = useState("Все");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [listPage, setListPage] = useState(1);
  const PAGE_SIZE = 6;
  const sectors = useMemo(() => ["Все", ...new Set(companies.map((c) => c.sector))], []);
  const updateSector = (value: string) => {
    setLoading(true);
    setSector(value);
    setListPage(1);
    setTimeout(() => setLoading(false), 650);
  };
  const filtered = useMemo(
    () =>
      companies
        .filter(
          (c) =>
            (sector === "Все" || c.sector === sector) &&
            c.name.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => (sort === "places" ? b.places - a.places : a.id - b.id)),
    [sector, search, sort],
  );
  const reset = () => {
    setSearch("");
    setSector("Все");
    setListPage(1);
  };
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(listPage, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goToPage = (next: number) => {
    setListPage(next);
    document.querySelector(".directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">ТВОЙ СТАРТ В ПРОФЕССИИ</span>
            <h1>
              Найди место
              <br />
              для <em>практики</em>
            </h1>
            <p>Проверенные предприятия, актуальные места и весь процесс — в одном сервисе.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit o1"></div>
            <div className="orbit o2"></div>
            <div className="hero-card hc1">
              <span>
                <Icon name="file" />
              </span>
              <div>
                <small>Заявка отправлена</small>
                <b>12 мая, 14:30</b>
              </div>
            </div>
            <div className="hero-card hc2">
              <span>
                <Icon name="check" />
              </span>
              <div>
                <small>Статус заявки</small>
                <b>Практика одобрена</b>
              </div>
            </div>
            <div className="hero-letter">П</div>
          </div>
        </div>
      </section>
      <section className="container directory">
        <div className="section-head">
          <div>
            <h2>Предприятия-партнёры</h2>
            <p>Выберите место, которое подходит именно вам</p>
          </div>
          <label className="sort">
            Сортировка:
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setListPage(1);
              }}
            >
              <option value="popular">По популярности</option>
              <option value="places">По числу мест</option>
            </select>
          </label>
        </div>
        <div className="filters">
          <div className="chips" aria-label="Фильтр по сфере">
            {sectors.map((x) => (
              <button
                key={x}
                className={sector === x ? "active" : ""}
                onClick={() => updateSector(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <label className="search">
            <Icon name="search" size={19} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setListPage(1);
              }}
              placeholder="Найти предприятие"
              aria-label="Поиск предприятия"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Очистить поиск">
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
        </div>
        {loading ? (
          <div className="company-grid">
            {[1, 2, 3, 4, 5, 6].map((x) => (
              <div className="company-card skeleton-card" key={x}>
                <i></i>
                <b></b>
                <span></span>
                <span></span>
                <div></div>
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="company-grid fade" key={`${sector}-${search}-${sort}-${safePage}`}>
            {visible.map((c) => (
              <article className="company-card" key={c.id}>
                <div className="company-top">
                  <div className="company-logo" style={{ background: c.color }}>
                    {c.short}
                  </div>
                  <span className="sector">{c.sector}</span>
                </div>
                <h3>
                  <button onClick={() => navigate("company", c.id)}>{c.name}</button>
                </h3>
                <p className="meta">
                  <Icon name="map" size={17} />
                  {c.address}
                </p>
                <p className="meta">
                  <Icon name="users" size={17} />
                  <b>{c.places}</b> свободных мест
                </p>
                <div className="card-actions">
                  <Button onClick={() => navigate("apply", c.id)}>Подать заявку</Button>
                  <button
                    className="round-link"
                    onClick={() => navigate("company", c.id)}
                    aria-label={`Подробнее: ${c.name}`}
                  >
                    <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState onReset={reset} />
        )}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="pagination" aria-label="Пагинация">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Предыдущая страница"
            >
              <Icon name="chevron" size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                className={safePage === number ? "active" : ""}
                onClick={() => goToPage(number)}
                aria-current={safePage === number ? "page" : undefined}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Следующая страница"
            >
              <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function CompanyDetail({
  companyId,
  navigate,
}: {
  companyId: number;
  navigate: (p: Page, id?: number) => void;
}) {
  const c = companies.find((x) => x.id === companyId) || companies[0];
  return (
    <main className="container page fade">
      <Breadcrumbs items={["Предприятия", c.name]} navigate={navigate} />
      <div className="detail-layout">
        <article className="panel detail-main">
          <div className="detail-title">
            <div className="company-logo large" style={{ background: c.color }}>
              {c.short}
            </div>
            <div>
              <span className="sector">{c.sector}</span>
              <h1>{c.name}</h1>
              <p>
                <Icon name="map" size={16} />
                {c.address}
              </p>
            </div>
          </div>
          <hr />
          <h2>О предприятии</h2>
          <p>{c.description}</p>
          <p>
            Вы будете работать над практическими задачами вместе с командой и получите обратную
            связь от персонального наставника.
          </p>
          <h2>Подходящие специальности</h2>
          <div className="specialties">
            <span>Информационные системы</span>
            <span>Техническое обслуживание</span>
            <span>Сетевое администрирование</span>
          </div>
          <h2>Что вас ждёт</h2>
          <ul className="check-list">
            <li>
              <Icon name="check" />
              Официальное оформление практики
            </li>
            <li>
              <Icon name="check" />
              Наставник от предприятия
            </li>
            <li>
              <Icon name="check" />
              Работа над реальными задачами
            </li>
          </ul>
        </article>
        <aside className="panel contact-card">
          <h3>Контакты</h3>
          <div>
            <small>Координатор практики</small>
            <b>Елена Сергеевна</b>
          </div>
          <div>
            <small>Телефон</small>
            <a href="tel:+74951234567">+7 (495) 123-45-67</a>
          </div>
          <div>
            <small>Почта</small>
            <a href="mailto:practice@example.ru">practice@example.ru</a>
          </div>
          <div className="places-box">
            <Icon name="users" />
            <span>
              <b>{c.places} мест</b>
              <small>доступно сейчас</small>
            </span>
          </div>
          <Button onClick={() => navigate("apply", c.id)}>Отправить заявку</Button>
        </aside>
      </div>
    </main>
  );
}

function ApplyForm({
  companyId,
  navigate,
  toast,
}: {
  companyId: number;
  navigate: (p: Page) => void;
  toast: (k: "success" | "error", t: string) => void;
}) {
  const [file, setFile] = useState("");
  const [progress, setProgress] = useState(0);
  const initialCompany = companies.find((company) => company.id === companyId) || companies[0];
  const [companyQuery, setCompanyQuery] = useState(initialCompany.name);
  const [companyOpen, setCompanyOpen] = useState(false);
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(companyQuery.toLowerCase()),
  );
  const handleFile = (name: string) => {
    if (!name) return;
    setFile(name);
    setProgress(15);
    let n = 15;
    const timer = setInterval(() => {
      n += 17;
      setProgress(Math.min(n, 100));
      if (n >= 100) clearInterval(timer);
    }, 160);
  };
  const drop = (e: DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]?.name);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast("error", "Прикрепите документ перед отправкой");
      return;
    }
    toast("success", "Заявка успешно отправлена");
    navigate("status");
  };
  return (
    <main className="container page narrow fade">
      <Breadcrumbs items={["Новая заявка"]} navigate={navigate} />
      <div className="page-heading">
        <span className="step-kicker">ШАГ 1 ИЗ 1</span>
        <h1>Новая заявка на практику</h1>
        <p>Заполните данные и приложите направление от техникума.</p>
      </div>
      <form className="panel form" onSubmit={submit}>
        <div className="form-grid">
          <label>
            <span>ФИО</span>
            <div className="readonly-field">
              <input defaultValue="Алексей Морозов" readOnly aria-readonly="true" />
              <Icon name="lock" size={16} />
            </div>
          </label>
          <label>
            <span>Группа</span>
            <div className="readonly-field">
              <input defaultValue="ИС-21" readOnly aria-readonly="true" />
              <Icon name="lock" size={16} />
            </div>
          </label>
        </div>
        <label>
          <span>Специальность</span>
          <select defaultValue="Информационные системы">
            <option>Информационные системы</option>
            <option>Техническое обслуживание</option>
            <option>Электроснабжение</option>
          </select>
        </label>
        <label className="combobox-label">
          <span>Предприятие</span>
          <div className="combobox">
            <Icon name="search" size={17} />
            <input
              role="combobox"
              aria-expanded={companyOpen}
              aria-controls="company-options"
              aria-autocomplete="list"
              value={companyQuery}
              onFocus={() => setCompanyOpen(true)}
              onBlur={() => setTimeout(() => setCompanyOpen(false), 120)}
              onChange={(event) => {
                setCompanyQuery(event.target.value);
                setCompanyOpen(true);
              }}
              placeholder="Начните вводить название"
            />
            <Icon name="down" size={16} />
            {companyOpen && (
              <div className="combobox-options" id="company-options" role="listbox">
                {filteredCompanies.length ? (
                  filteredCompanies.map((company) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={companyQuery === company.name}
                      key={company.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setCompanyQuery(company.name);
                        setCompanyOpen(false);
                      }}
                    >
                      <span>{company.short}</span>
                      <div>
                        <b>{company.name}</b>
                        <small>{company.sector}</small>
                      </div>
                      {companyQuery === company.name && <Icon name="check" size={16} />}
                    </button>
                  ))
                ) : (
                  <p>Предприятия не найдены</p>
                )}
              </div>
            )}
          </div>
        </label>
        <div>
          <label className="label-title" htmlFor="file">
            Направление на практику
          </label>
          <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={drop}>
            <div className="upload-icon">
              <Icon name="upload" />
            </div>
            <b>Перетащите файл сюда</b>
            <span>или выберите на компьютере</span>
            <label className="btn btn-secondary file-button" htmlFor="file">
              Выбрать файл
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFile(e.target.files?.[0]?.name || "")
              }
            />
            <small>PDF, DOC или DOCX, до 10 МБ</small>
          </div>
        </div>
        {file && (
          <div className="file-progress fade">
            <Icon name="file" />
            <div>
              <b>{file}</b>
              <div className="progress">
                <i style={{ width: `${progress}%` }}></i>
              </div>
              <small>{progress < 100 ? `Загрузка — ${progress}%` : "Файл загружен"}</small>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile("");
                setProgress(0);
              }}
              aria-label="Удалить файл"
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="form-footer">
          <Button variant="ghost" onClick={() => navigate("home")}>
            Отмена
          </Button>
          <Button type="submit">Отправить заявку</Button>
        </div>
      </form>
    </main>
  );
}

function StatusDashboard({ navigate }: { navigate: (p: Page, id?: number) => void }) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const history = [
    {
      id: 2,
      company: "Россети Московский регион",
      date: "03.03.2025",
      specialty: "Информационные системы",
      status: "Одобрена",
      companyId: 3,
      comment: "Практика подтверждена, куратор свяжется с вами до 15 мая.",
    },
    {
      id: 4,
      company: "VK Tech",
      date: "15.01.2025",
      specialty: "Информационные системы",
      status: "Отклонена",
      companyId: 5,
      comment: "Набор на этот период закрыт. Можно подать заявку на следующую волну.",
    },
  ];
  return (
    <main className="container page fade">
      <Breadcrumbs items={["Мои заявки"]} navigate={navigate} />
      <div className="page-heading inline">
        <div>
          <h1>Мои заявки</h1>
          <p>Следите за статусом практики</p>
        </div>
        <Button onClick={() => navigate("home")}>Найти практику</Button>
      </div>
      <section className="panel tracker-panel">
        <div className="tracker-head">
          <div>
            <span className="sector">IT</span>
            <h2>Яндекс Практика</h2>
            <p>Заявка от 12 мая 2025</p>
          </div>
          <Badge status="На проверке" />
        </div>
        <div className="tracker">
          <div className="track-step done">
            <i>
              <Icon name="check" size={17} />
            </i>
            <b>Заявка отправлена</b>
            <small>12 мая, 14:30</small>
          </div>
          <div className="track-line done"></div>
          <div className="track-step current">
            <i>2</i>
            <b>Проверка техникумом</b>
            <small>Обычно до 2 дней</small>
          </div>
          <div className="track-line"></div>
          <div className="track-step">
            <i>3</i>
            <b>Решение предприятия</b>
            <small>Следующий этап</small>
          </div>
        </div>
      </section>
      <section className="history">
        <h2>История заявок</h2>
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Предприятие</th>
                <th>Дата</th>
                <th>Специальность</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <Fragment key={h.id}>
                  <tr className={openRow === h.id ? "open" : ""}>
                    <td>
                      <b>{h.company}</b>
                    </td>
                    <td>{h.date}</td>
                    <td>{h.specialty}</td>
                    <td>
                      <Badge status={h.status} />
                    </td>
                    <td>
                      <button
                        className={`table-more ${openRow === h.id ? "active" : ""}`}
                        aria-label={`Подробнее о заявке в ${h.company}`}
                        aria-expanded={openRow === h.id}
                        onClick={() => setOpenRow(openRow === h.id ? null : h.id)}
                      >
                        <Icon name="chevron" />
                      </button>
                    </td>
                  </tr>
                  {openRow === h.id && (
                    <tr className="detail-row">
                      <td colSpan={5}>
                        <div className="row-detail fade">
                          <div>
                            <small>Специальность</small>
                            <b>{h.specialty}</b>
                          </div>
                          <div>
                            <small>Дата подачи</small>
                            <b>{h.date}</b>
                          </div>
                          <div className="row-detail-comment">
                            <small>Комментарий</small>
                            <b>{h.comment}</b>
                          </div>
                          <div className="row-detail-actions">
                            <Button
                              variant="secondary"
                              onClick={() => navigate("company", h.companyId)}
                            >
                              О предприятии
                            </Button>
                            {h.status === "Отклонена" && (
                              <Button onClick={() => navigate("apply", h.companyId)}>
                                Подать снова
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

type DocumentItem = {
  id: number;
  name: string;
  type: "PDF" | "DOC";
  date: string;
  size: string;
  status: string;
};

const initialDocuments: DocumentItem[] = [
  {
    id: 1,
    name: "Направление на практику",
    type: "PDF",
    date: "12 мая 2025",
    size: "1,8 МБ",
    status: "Подлинный",
  },
  {
    id: 2,
    name: "Согласие на обработку данных",
    type: "PDF",
    date: "10 мая 2025",
    size: "320 КБ",
    status: "На проверке",
  },
  {
    id: 3,
    name: "Договор о практике",
    type: "PDF",
    date: "8 мая 2025",
    size: "960 КБ",
    status: "Подлинный",
  },
];

function Documents({
  navigate,
  toast,
  preview,
}: {
  navigate: (p: Page) => void;
  toast: (k: "success" | "error", t: string) => void;
  preview: (name: string) => void;
}) {
  const [docs, setDocs] = useState(initialDocuments);
  const [tab, setTab] = useState("Все");
  const inputRef = useRef<HTMLInputElement>(null);
  const tabs = [
    { label: "Все", count: docs.length },
    { label: "Подлинные", count: docs.filter((d) => d.status === "Подлинный").length },
    { label: "На проверке", count: docs.filter((d) => d.status === "На проверке").length },
  ];
  const visibleDocs = docs.filter((doc) =>
    tab === "Все" ? true : tab === "Подлинные" ? doc.status === "Подлинный" : doc.status === "На проверке",
  );
  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const added: DocumentItem[] = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name.replace(/\.[^.]+$/, ""),
      type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOC",
      date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      size: `${Math.max(1, Math.round(file.size / 1024))} КБ`,
      status: "На проверке",
    }));
    setDocs((items) => [...added, ...items]);
    toast("success", added.length > 1 ? "Документы добавлены" : "Документ добавлен");
  };
  return (
    <main className="container page fade">
      <Breadcrumbs items={["Мои документы"]} navigate={navigate} />
      <div className="page-heading inline">
        <div>
          <h1>Мои документы</h1>
          <p>Документы для прохождения практики</p>
        </div>
        <div className="heading-actions">
          <Button icon="upload" onClick={() => inputRef.current?.click()}>
            Добавить документ
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>
      </div>
      <div className="chips doc-tabs" role="tablist" aria-label="Фильтр документов">
        {tabs.map((item) => (
          <button
            key={item.label}
            role="tab"
            aria-selected={tab === item.label}
            className={tab === item.label ? "active" : ""}
            onClick={() => setTab(item.label)}
          >
            {item.label}
            <span>{item.count}</span>
          </button>
        ))}
      </div>
      {visibleDocs.length ? (
        <div className="document-grid fade" key={tab}>
          {visibleDocs.map((doc) => (
            <article className="panel document" key={doc.id}>
              <span className={doc.type === "PDF" ? "pdf" : "doc"}>{doc.type}</span>
              <div>
                <h3>{doc.name}</h3>
                <p>
                  Добавлен {doc.date} · {doc.size}
                </p>
                <Badge status={doc.status} />
              </div>
              <button
                onClick={() => preview(`${doc.name}.pdf`)}
                aria-label={`Открыть документ: ${doc.name}`}
                title="Открыть документ"
              >
                <Icon name="file" />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty fade">
          <div className="empty-icon">
            <Icon name="file" size={28} />
          </div>
          <h3>В этой категории документов пока нет</h3>
          <p>Загрузите документ или выберите другую вкладку.</p>
          <Button variant="secondary" onClick={() => inputRef.current?.click()}>
            Загрузить документ
          </Button>
        </div>
      )}
    </main>
  );
}

function StatsCard({
  value,
  label,
  trend,
  icon,
}: {
  value: string;
  label: string;
  trend?: string;
  icon: string;
}) {
  return (
    <div className="stat panel">
      <span>
        <Icon name={icon} />
      </span>
      <div>
        <b>{value}</b>
        <p>{label}</p>
        {trend && <small className={trend.startsWith("-") ? "negative" : ""}>{trend}</small>}
      </div>
    </div>
  );
}

function AdminDashboard({
  role,
  toast,
  verify,
  confirm,
  preview,
  apps,
  onStatusChange,
}: {
  role: "college" | "company";
  toast: (k: "success" | "error", t: string) => void;
  verify: () => void;
  confirm: (text: string, action: () => void) => void;
  preview: (name: string) => void;
  apps: typeof initialApplications;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [status, setStatus] = useState("Все статусы"),
    [query, setQuery] = useState("");
  const rows = apps.filter(
    (a) =>
      (status === "Все статусы" || a.status === status) &&
      a.name.toLowerCase().includes(query.toLowerCase()),
  );
  const pending = apps.filter((a) => a.status === "На проверке" || a.status === "Ожидает").length;
  const approved = apps.filter((a) => a.status === "Одобрена").length;
  const exportCsv = () => {
    const csv = [
      "ФИО,Группа,Предприятие,Статус",
      ...apps.map((a) => `${a.name},${a.group},${a.company},${a.status}`),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "applications.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("success", "CSV-файл сформирован");
  };
  return (
    <main className="container page admin fade">
      <div className="admin-title">
        <div>
          <span className="eyebrow">
            {role === "college" ? "ПАНЕЛЬ ТЕХНИКУМА" : "КАБИНЕТ ПРЕДПРИЯТИЯ"}
          </span>
          <h1>{role === "college" ? "Добрый день, МТК" : "Входящие заявки"}</h1>
          <p>
            {role === "college"
              ? "Сводка по практике студентов на сегодня"
              : "Кандидаты на производственную практику"}
          </p>
        </div>
        <Button variant="export" icon="download" onClick={exportCsv}>
          Экспорт CSV
        </Button>
      </div>
      <div className="stats">
        {role === "college" ? (
          <>
            <StatsCard value="124" label="Всего заявок" trend="+12 за неделю" icon="file" />
            <StatsCard value={String(pending)} label="На проверке" icon="search" />
            <StatsCard value="72%" label="Одобрено" trend="+5% к апрелю" icon="check" />
            <StatsCard value="18" label="Предприятий" icon="users" />
          </>
        ) : (
          <>
            <StatsCard value={String(pending)} label="Новых заявки" trend="+8 за неделю" icon="file" />
            <StatsCard value="16" label="Свободных мест" trend="-2 за сегодня" icon="users" />
            <StatsCard value={String(approved)} label="Одобрено" trend="за этот семестр" icon="check" />
          </>
        )}
      </div>
      <section className="panel admin-table">
        <div className="table-toolbar">
          <div>
            <h2>{role === "college" ? "Последние заявки" : "Кандидаты"}</h2>
            <p>{rows.length} записей</p>
          </div>
          <div className="toolbar-actions">
            <label className="search compact">
              <Icon name="search" />
              <input
                placeholder="Поиск по ФИО"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Фильтр по статусу"
            >
              <option>Все статусы</option>
              <option>На проверке</option>
              <option>Ожидает</option>
              <option>Одобрена</option>
              <option>Отклонена</option>
            </select>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Студент</th>
                  <th>{role === "college" ? "Предприятие" : "Специальность"}</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Документ</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a, i) => (
                  <tr key={a.name}>
                    <td>
                      <div className="student-cell">
                        <span className="mini-avatar">
                          {a.name
                            .split(" ")
                            .map((x) => x[0])
                            .join("")}
                        </span>
                        <div>
                          <b>{a.name}</b>
                          <small>{a.group}</small>
                        </div>
                      </div>
                    </td>
                    <td>{role === "college" ? a.company : a.specialty}</td>
                    <td>{a.date}</td>
                    <td>
                      <Badge status={a.status} />
                    </td>
                    <td>
                      <button
                        className="doc-link"
                        onClick={() => preview(`${a.name} — Направление.pdf`)}
                      >
                        <Icon name="file" size={16} />
                        Направление.pdf
                      </button>
                    </td>
                    <td>
                      {role === "college" ? (
                        <Button variant="secondary" onClick={verify}>
                          Проверить документ
                        </Button>
                      ) : (
                        <div className="row-actions">
                          <button
                            className="approve"
                            title="Одобрить заявку"
                            data-tip="Одобрить"
                            onClick={() =>
                              confirm(`Одобрить заявку студента ${a.name}?`, () => {
                                onStatusChange(a.id, "Одобрена");
                                toast("success", "Заявка одобрена");
                              })
                            }
                            aria-label="Одобрить"
                            disabled={a.status === "Одобрена"}
                          >
                            <Icon name="check" size={16} />
                            Одобрить
                          </button>
                          <button
                            className="reject"
                            title="Отклонить заявку"
                            data-tip="Отклонить"
                            onClick={() =>
                              confirm(`Отклонить заявку студента ${a.name}?`, () => {
                                onStatusChange(a.id, "Отклонена");
                                toast("error", "Заявка отклонена");
                              })
                            }
                            aria-label="Отклонить"
                            disabled={a.status === "Отклонена"}
                          >
                            <Icon name="x" size={16} />
                            Отклонить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            onReset={() => {
              setQuery("");
              setStatus("Все статусы");
            }}
          />
        )}
      </section>
    </main>
  );
}

function Profile({
  navigate,
  toast,
  logout,
}: {
  navigate: (p: Page) => void;
  toast: (k: "success" | "error", t: string) => void;
  logout: () => void;
}) {
  const avatarInput = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  return (
    <main className="container page narrow fade">
      <Breadcrumbs items={["Настройки профиля"]} navigate={navigate} />
      <div className="page-heading">
        <h1>Настройки профиля</h1>
        <p>Управляйте личными данными и уведомлениями.</p>
      </div>
      <form
        className="panel form"
        onSubmit={(e) => {
          e.preventDefault();
          toast("success", "Настройки сохранены");
        }}
      >
        <div className="profile-head">
          <button
            className="profile-avatar"
            type="button"
            aria-label="Изменить фото профиля"
            onClick={() => avatarInput.current?.click()}
          >
            {avatar ? (
              <img className="avatar big" src={avatar} alt="Фото профиля" />
            ) : (
              <span className="avatar big">АМ</span>
            )}
            <span className="avatar-edit">
              <Icon name="pencil" size={18} />
            </span>
          </button>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setAvatar(URL.createObjectURL(file));
              toast("success", "Фото профиля обновлено");
              event.target.value = "";
            }}
          />
          <div>
            <h3>Алексей Морозов</h3>
            <p>Студент · ИС-21</p>
          </div>
        </div>
        <hr />
        <div className="form-grid">
          <label>
            <span>Имя</span>
            <input defaultValue="Алексей" />
          </label>
          <label>
            <span>Фамилия</span>
            <input defaultValue="Морозов" />
          </label>
        </div>
        <label>
          <span>Электронная почта</span>
          <input type="email" defaultValue="a.morozov@example.ru" />
        </label>
        <div className="toggle-row">
          <div>
            <b>Уведомления по почте</b>
            <p>Получать информацию об изменении статуса</p>
          </div>
          <input type="checkbox" defaultChecked aria-label="Уведомления по почте" />
        </div>
        <div className="form-footer">
          <Button type="submit">Сохранить изменения</Button>
        </div>
        <div className="profile-logout">
          <Button variant="danger-ghost" icon="logout" onClick={logout}>
            Выйти
          </Button>
        </div>
      </form>
    </main>
  );
}

function FAQ({ navigate }: { navigate: (p: Page) => void }) {
  const [open, setOpen] = useState(0);
  const qs = [
    [
      "Как подать заявку на практику?",
      "Выберите предприятие в каталоге, нажмите «Подать заявку», заполните данные и приложите направление от техникума.",
    ],
    [
      "Как долго проверяется заявка?",
      "Техникум обычно проверяет документы в течение двух рабочих дней. После этого заявка поступает предприятию.",
    ],
    [
      "Можно ли изменить отправленную заявку?",
      "До начала проверки вы можете отозвать заявку и создать новую с исправленными данными.",
    ],
    [
      "Что означает верификация документа?",
      "Сервис вычисляет цифровой хэш файла и сверяет его с записью техникума, чтобы подтвердить подлинность.",
    ],
  ];
  return (
    <main className="container page narrow fade">
      <Breadcrumbs items={["Помощь и FAQ"]} navigate={navigate} />
      <div className="page-heading">
        <h1>Частые вопросы</h1>
        <p>Всё, что нужно знать о поиске практики.</p>
      </div>
      <div className="faq">
        {qs.map((q, i) => (
          <article className={`panel ${open === i ? "open" : ""}`} key={q[0]}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <b>{q[0]}</b>
              <Icon name="down" />
            </button>
            <div className={`faq-answer ${open === i ? "open" : ""}`}>
              <div>
                <p>{q[1]}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Login({ onLogin }: { onLogin: (r: Role) => void }) {
  const [role, setRole] = useState<Role>("student");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  return (
    <main className="login-page">
      <div className="login-side">
        <div className="brand light">
          <span className="brand-mark">
            <Icon name="check" />
          </span>
          <span>Практика.ПРО</span>
        </div>
        <div>
          <span className="eyebrow">ЕДИНАЯ ПЛАТФОРМА</span>
          <h1>
            Практика,
            <br />
            которая ведёт
            <br />
            <em>к профессии</em>
          </h1>
          <p>Связываем студентов, техникумы и лучшие предприятия.</p>
        </div>
        <small>© 2025 Практика.ПРО</small>
      </div>
      <div className="login-form-wrap">
        <form
          className="login-form panel"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(role);
          }}
        >
          <h2>Добро пожаловать</h2>
          <p>Войдите в свою учётную запись</p>
          <div className="role-tabs">
            {(["student", "college", "company"] as Role[]).map((r) => (
              <button
                type="button"
                className={role === r ? "active" : ""}
                onClick={() => setRole(r)}
                key={r}
              >
                {r === "student" ? "Студент" : r === "college" ? "Техникум" : "Предприятие"}
              </button>
            ))}
          </div>
          <label>
            <span>Логин</span>
            <input placeholder="Введите логин" defaultValue="a.morozov" />
          </label>
          <label>
            <span>Пароль</span>
            <input type="password" placeholder="Введите пароль" defaultValue="password" />
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" defaultChecked />
              Запомнить меня
            </label>
            <button type="button" onClick={() => setResetOpen(true)}>
              Забыли пароль?
            </button>
          </div>
          <Button type="submit">Войти</Button>
          <small>
            Проблемы со входом?{" "}
            <a className="support-link" href="mailto:support@praktika.pro">
              Обратиться в поддержку
            </a>
          </small>
        </form>
      </div>
      {resetOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setResetOpen(false);
          }}
        >
          <div className="modal panel fade">
            <button
              className="modal-close"
              onClick={() => setResetOpen(false)}
              aria-label="Закрыть"
            >
              <Icon name="close" />
            </button>
            <div className={`verify-icon ${resetSent ? "ok" : ""}`}>
              <Icon name={resetSent ? "check" : "lock"} size={32} />
            </div>
            <h2 id="reset-title">
              {resetSent ? "Письмо отправлено" : "Восстановление пароля"}
            </h2>
            {resetSent ? (
              <>
                <p>Мы отправили ссылку для сброса пароля на указанную почту.</p>
                <Button
                  onClick={() => {
                    setResetOpen(false);
                    setResetSent(false);
                  }}
                >
                  Готово
                </Button>
              </>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setResetSent(true);
                }}
              >
                <p>Укажите электронную почту, и мы отправим ссылку для восстановления.</p>
                <label className="modal-field">
                  <span>Электронная почта</span>
                  <input type="email" placeholder="name@example.ru" required />
                </label>
                <Button type="submit">Отправить ссылку</Button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function VerificationModal({
  close,
  toast,
}: {
  close: () => void;
  toast: (k: "success" | "error", t: string) => void;
}) {
  const [progress, setProgress] = useState(8);
  const [valid, setValid] = useState(true);
  useEffect(() => {
    const t = setInterval(
      () =>
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(t);
            return 100;
          }
          return p + 8;
        }),
      130,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal panel fade">
        <button className="modal-close" onClick={close} aria-label="Закрыть">
          <Icon name="close" />
        </button>
        {progress < 100 ? (
          <>
            <div className="verify-icon spin">
              <Icon name="shield" size={34} />
            </div>
            <h2 id="verify-title">Верификация документа</h2>
            <p>Вычисление хэша...</p>
            <div className="progress large">
              <i style={{ width: `${progress}%` }}></i>
            </div>
            <small>Проверяем целостность файла · {progress}%</small>
          </>
        ) : (
          <>
            <div className={`verify-icon ${valid ? "ok" : "bad"}`}>
              <Icon name={valid ? "shield" : "x"} size={38} />
            </div>
            <h2 id="verify-title">{valid ? "Документ подлинный" : "Файл изменён"}</h2>
            <p>
              {valid
                ? "Хэш файла совпадает с записью техникума. Документ не был изменён."
                : "Цифровая подпись не совпадает. Попросите студента загрузить оригинал."}
            </p>
            <div className="hash">
              <small>SHA-256</small>
              <code>8f14e45fceea167a5a36dedd4bea2543...</code>
            </div>
            <Button
              onClick={() => {
                toast(
                  valid ? "success" : "error",
                  valid ? "Документ верифицирован" : "Обнаружено изменение файла",
                );
                close();
              }}
            >
              Готово
            </Button>
            <button className="test-result" onClick={() => setValid(!valid)}>
              Показать {valid ? "ошибку" : "успех"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PdfPreviewModal({ name, close }: { name: string; close: () => void }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="pdf-modal panel fade">
        <div className="pdf-modal-head">
          <div>
            <span className="pdf-file-icon">PDF</span>
            <div>
              <h2 id="preview-title">{name}</h2>
              <p>Предпросмотр документа · 1,8 МБ</p>
            </div>
          </div>
          <button className="modal-close-inline" onClick={close} aria-label="Закрыть предпросмотр">
            <Icon name="close" />
          </button>
        </div>
        <div className="pdf-preview">
          <article>
            <div className="pdf-logo">
              <span>П</span>
              <b>Практика.ПРО</b>
            </div>
            <small>НАПРАВЛЕНИЕ НА ПРОИЗВОДСТВЕННУЮ ПРАКТИКУ</small>
            <h3>Направление № 125/25</h3>
            <p>
              Государственное бюджетное профессиональное образовательное учреждение направляет
              студента для прохождения производственной практики.
            </p>
            <dl>
              <div>
                <dt>Студент</dt>
                <dd>Алексей Морозов</dd>
              </div>
              <div>
                <dt>Группа</dt>
                <dd>ИС-21</dd>
              </div>
              <div>
                <dt>Период практики</dt>
                <dd>19 мая — 27 июня 2025</dd>
              </div>
              <div>
                <dt>Предприятие</dt>
                <dd>Яндекс Практика</dd>
              </div>
            </dl>
            <div className="pdf-signature">
              <span>Директор техникума</span>
              <i></i>
              <b>А. В. Петров</b>
            </div>
          </article>
        </div>
        <div className="pdf-modal-footer">
          <span>
            <Icon name="shield" size={17} />
            Защищённый предпросмотр
          </span>
          <Button variant="secondary" icon="download" onClick={() => window.print()}>
            Скачать PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  text,
  close,
  action,
}: {
  text: string;
  close: () => void;
  action: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      role="alertdialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal confirm panel fade">
        <div className="verify-icon warn">
          <Icon name="file" />
        </div>
        <h2>Подтвердите действие</h2>
        <p>{text}</p>
        <div>
          <Button variant="secondary" onClick={close}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              action();
              close();
            }}
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </div>
  );
}

function Sitemap({ navigate }: { navigate: (p: Page) => void }) {
  const links: { page: Page; title: string; text: string; icon: string }[] = [
    { page: "home", title: "Предприятия", text: "Каталог предприятий и поиск практики", icon: "search" },
    { page: "status", title: "Мои заявки", text: "Статус и история заявок", icon: "file" },
    { page: "documents", title: "Документы", text: "Направления и договоры", icon: "shield" },
    { page: "profile", title: "Профиль", text: "Личные данные и уведомления", icon: "settings" },
    { page: "faq", title: "Помощь и FAQ", text: "Ответы на частые вопросы", icon: "help" },
    { page: "login", title: "Вход", text: "Авторизация и выбор роли", icon: "logout" },
  ];
  return (
    <main className="container page narrow fade">
      <Breadcrumbs items={["Карта сайта"]} navigate={navigate} />
      <div className="page-heading">
        <h1>Карта сайта</h1>
        <p>Все разделы сервиса в одном месте.</p>
      </div>
      <div className="sitemap-grid">
        {links.map((link) => (
          <button
            className="panel sitemap-card"
            key={link.page}
            onClick={() => navigate(link.page)}
          >
            <span>
              <Icon name={link.icon} />
            </span>
            <div>
              <b>{link.title}</b>
              <small>{link.text}</small>
            </div>
            <Icon name="arrow" size={18} />
          </button>
        ))}
      </div>
    </main>
  );
}

function NotFound({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <main className="not-found fade">
      <span>404</span>
      <h1>Страница не найдена</h1>
      <p>Возможно, ссылка устарела или страница была перемещена.</p>
      <Button onClick={() => navigate("home")}>Вернуться на главную</Button>
    </main>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("student"),
    [page, setPage] = useState<Page>("home"),
    [companyId, setCompanyId] = useState(1),
    [dark, setDark] = useState(false),
    [menu, setMenu] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]),
    [verify, setVerify] = useState(false),
    [preview, setPreview] = useState<string | null>(null),
    [confirm, setConfirm] = useState<{ text: string; action: () => void } | null>(null),
    [apps, setApps] = useState(initialApplications);
  const updateApplicationStatus = (id: number, status: string) => {
    setApps((items) => items.map((a) => (a.id === id ? { ...a, status } : a)));
  };
  const toast = (kind: "success" | "error", text: string) => {
    const id = Date.now();
    setToasts((x) => [...x, { id, kind, text }]);
    setTimeout(() => setToasts((x) => x.filter((t) => t.id !== id)), 3000);
  };
  const navigate = (p: Page, id?: number) => {
    setPage(p);
    if (id) setCompanyId(id);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [showUp, setShowUp] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    const f = () => setShowUp(window.scrollY > 500);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!verify && !preview && !confirm) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setVerify(false);
      setPreview(null);
      setConfirm(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [verify, preview, confirm]);
  const login = (r: Role) => {
    setRole(r);
    setPage("home");
    toast("success", "Вы успешно вошли в систему");
  };
  const logout = () => {
    setPage("login");
    setMenu(false);
  };
  if (page === "login")
    return (
      <>
        <Login onLogin={login} />
        <ToastStack toasts={toasts} />
      </>
    );
  let content: React.ReactNode;
  if (page === "404") content = <NotFound navigate={navigate} />;
  else if (role === "college" || role === "company")
    content = (
      <AdminDashboard
        role={role}
        toast={toast}
        verify={() => setVerify(true)}
        preview={(name) => setPreview(name)}
        confirm={(text, action) => setConfirm({ text, action })}
        apps={apps}
        onStatusChange={updateApplicationStatus}
      />
    );
  else if (page === "home") content = <StudentHome navigate={navigate} toast={toast} />;
  else if (page === "company")
    content = <CompanyDetail companyId={companyId} navigate={navigate} />;
  else if (page === "apply")
    content = <ApplyForm companyId={companyId} navigate={navigate} toast={toast} />;
  else if (page === "status") content = <StatusDashboard navigate={navigate} />;
  else if (page === "documents")
    content = <Documents navigate={navigate} toast={toast} preview={(name) => setPreview(name)} />;
  else if (page === "profile")
    content = <Profile navigate={navigate} toast={toast} logout={logout} />;
  else if (page === "faq") content = <FAQ navigate={navigate} />;
  else if (page === "sitemap") content = <Sitemap navigate={navigate} />;
  else content = <NotFound navigate={navigate} />;
  return (
    <div className="app">
      <Header
        role={role}
        page={page}
        dark={dark}
        menu={menu}
        setDark={setDark}
        setMenu={setMenu}
        navigate={navigate}
        setRole={setRole}
        logout={logout}
      />
      {content}
      <footer>
        <div className="container">
          <span>© 2025 Практика.ПРО</span>
          <button onClick={() => navigate("faq")}>Помощь</button>
          <button onClick={() => navigate("sitemap")}>Карта сайта</button>
        </div>
      </footer>
      {showUp && (
        <button
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Наверх"
        >
          <Icon name="up" />
        </button>
      )}
      <ToastStack toasts={toasts} />
      {verify && <VerificationModal close={() => setVerify(false)} toast={toast} />}{" "}
      {preview && <PdfPreviewModal name={preview} close={() => setPreview(null)} />}
      {confirm && (
        <ConfirmModal text={confirm.text} action={confirm.action} close={() => setConfirm(null)} />
      )}
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div className={`toast ${t.kind}`} key={t.id}>
          <span>
            <Icon name={t.kind === "success" ? "check" : "x"} />
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
