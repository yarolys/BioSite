// Основные данные профиля
export const profile = {
  fullName: "Лысов Ярослав",
  title: "Python Backend Developer & AI Engineer",
  location: "г. Иркутск, Россия",
  avatarPath: "/avatar.jpg",

  // Соцсети
  socials: [
    {
      name: "Telegram",
      url: "https://t.me/KandyBobby",
      icon: "telegram",
    },
    {
      name: "GitHub",
      url: "https://github.com/yarolys",
      icon: "github",
    },
    {
      name: "Habr Career",
      url: "https://career.habr.com/yarolys",
      icon: "habr",
    },
  ],
};

// Навигация
export const navigation = [
  { label: "Обо мне", href: "#about" },
  { label: "Опыт работы", href: "#experience" },
  { label: "Образование", href: "#education" },
  { label: "Хобби", href: "#hobbies" },
];

// Секция "Обо мне"
export const aboutSection = {
  title: "Обо мне",
  paragraphs: [
    "Backend-разработчик с опытом проектирования и разработки высоконагруженных систем. Специализируюсь на Python-экосистеме: FastAPI, SQLAlchemy, asyncio. Имею практический опыт внедрения LLM и RAG-решений в production.",
    "Проектирую архитектуры, способные выдерживать высокие нагрузки (20k+ RPS, SLA 99.9%). Работаю с мультиагентными сценариями, интеграциями CRM и омниканальными коммуникациями.",
    "Увлечён чистой архитектурой, автоматизацией процессов и построением надёжных, масштабируемых систем. Постоянно изучаю новые технологии в области AI/ML и backend-разработки.",
  ],
  skills: [
    "Python",
    "FastAPI",
    "SQLAlchemy",
    "AIOHTTP",
    "PostgreSQL",
    "Redis",
    "Qdrant (RAG)",
    "LLM (OpenAI API)",
    "LangChain",
    "LangGraph",
    "LangFuse",
    "PyTorch",
    "MCP",
    "SSE",
    "WebSockets",
    "Celery",
    "RabbitMQ",
    "Apache Kafka",
    "Bitrix24 REST",
    "Cloudflare API",
    "S3",
    "Docker",
    "CI/CD (GitHub Actions)",
    "Telethon",
    "Aiogram",
    "Sentry",
    "Pytest",
  ],
};

// Секция "Опыт работы"
export const experienceSection = {
  title: "Опыт работы",
  items: [
    {
      company: "ЗонируемРФ",
      position: "Python Backend Developer & AI Engineer",
      period: "Январь 2024 — Октябрь 2025",
      description:
        "Спроектировал и запустил в прод AI-модуль для омниканальной обработки входящих обращений (WhatsApp, Avito, чат сайта, Instagram, Telegram, VK, Facebook, Email, Viber). Мультиагентные сценарии с RAG по регламентам, строгий JSON-контракт с CRM. SLA первого ответа ≤2 минут. Оптимизация SQL, кэширование Redis, очереди с ретраями и backoff.",
      technologies: [
        "FastAPI",
        "SQLAlchemy",
        "PostgreSQL",
        "Redis",
        "Qdrant",
        "LangChain",
        "LangGraph",
        "OpenAI API",
        "Bitrix24 REST",
        "RabbitMQ",
        "Docker",
        "CI/CD",
      ],
    },
    {
      company: "WispDream",
      position: "Backend Developer",
      period: "Сентябрь 2022 — Январь 2024",
      description:
        "Спроектировал и реализовал высоконагруженную backend-архитектуру с нуля для стриминговой платформы (аналог Twitch). Платформа выдерживает >20000 RPS, SLA 99.9%. База данных: 30+ таблиц, >60 связей, строгая транзакционная модель. Рост стабильности системы на 40%, ускорение time-to-market на 25%.",
      technologies: [
        "FastAPI",
        "SQLAlchemy",
        "AIOHTTP",
        "PostgreSQL",
        "Redis",
        "Celery",
        "RabbitMQ",
        "S3",
        "Cloudflare API",
        "Docker",
        "GitHub Actions",
      ],
    },
    {
      company: "SystemCraftAI",
      position: "Python Backend Developer",
      period: "Август 2020 — Сентябрь 2022",
      description:
        "Разработка высоконагруженных Telegram-ботов для автоматизации поддержки (10k+ пользователей). Интеграция с ChatGPT API для классификации обращений. Проектирование микросервисной архитектуры, настройка CI/CD и мониторинга.",
      technologies: [
        "Telethon",
        "Aiogram",
        "AIOHTTP",
        "Celery",
        "Redis",
        "PostgreSQL",
        "Apache Kafka",
        "Docker",
        "Sentry",
        "Pytest",
      ],
    },
  ],
};

// Секция "Образование"
export const educationSection = {
  title: "Образование",
  items: [
    {
      institution: "ИрГУПС",
      degree: "Магистратура",
      field: "Институт информационных технологий и моделирования",
      period: "2025 — 2027",
      description:
        "Продолжение обучения в магистратуре по направлению информационных технологий.",
    },
    {
      institution: "ИрГУПС",
      degree: "Бакалавр",
      field: "Институт информационных технологий и моделирования",
      period: "2021 — 2025",
      description:
        "Изучение алгоритмов, структур данных, баз данных, сетевых технологий. Практический опыт разработки веб-приложений.",
    },
  ],
};

// Секция "Хобби"
export const hobbiesSection = {
  title: "Хобби",
  items: [
    {
      name: "Программирование",
      description: "Pet-проекты, open source, изучение новых языков и фреймворков",
      icon: "code",
    },
    {
      name: "Спорт",
      description: "Тренажёрный зал, рукопашный бой",
      icon: "fitness",
    },
    {
      name: "Туризм",
      description: "Походы, кемпинг, активный отдых на природе",
      icon: "hiking",
    },
    {
      name: "Путешествия",
      description: "Люблю исследовать новые места, природу и культуры",
      icon: "travel",
    },
  ],
};

// SEO метаданные
export const seoData = {
  title: "Лысов Ярослав — Python Backend Developer & AI Engineer",
  description:
    "Персональный сайт-портфолио Лысова Ярослава. Backend-разработчик на Python, AI Engineer. FastAPI, LLM, RAG, PostgreSQL, Docker.",
  url: "https://yarolys.ru",
  image: "/og-image.svg",
};
