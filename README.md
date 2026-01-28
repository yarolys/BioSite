# BioSite — yarolys.ru

Персональный сайт-портфолио на Astro + Tailwind CSS + TypeScript.

## Возможности

- Светлая и тёмная тема с переключателем
- Плавный скролл и анимации появления при скролле
- Параллакс-эффект и glow за курсором (десктоп)
- Адаптивная вёрстка с бургер-меню
- Поддержка `prefers-reduced-motion`
- SEO: title, description, Open Graph
- Деплой через Docker или напрямую через Nginx

## Технологии

- [Astro](https://astro.build) — статический генератор
- [Tailwind CSS v4](https://tailwindcss.com) — утилитарные стили
- TypeScript
- Docker + Nginx

## Быстрый старт

```bash
npm install
npm run dev
```

Dev-сервер запустится на `http://localhost:4321`.

## Сборка

```bash
npm run build
npm run preview  # предпросмотр билда
```

## Docker

```bash
docker compose up -d
```

## Структура проекта

```
├── public/                # Статические ассеты
│   ├── avatar.jpg
│   ├── favicon.svg
│   ├── og-image.svg
│   └── robots.txt
├── src/
│   ├── components/        # Astro-компоненты
│   ├── data/
│   │   └── profile.ts     # Все данные профиля
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── nginx.conf             # Nginx для прямого деплоя
├── nginx-docker.conf      # Nginx для Docker
├── Dockerfile
├── docker-compose.yaml
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Контент

Все данные находятся в `src/data/profile.ts`:

| Секция             | Описание              |
|--------------------|-----------------------|
| `profile`          | Имя, должность, соцсети |
| `aboutSection`     | Текст «О себе» и навыки |
| `experienceSection`| Опыт работы           |
| `educationSection` | Образование           |
| `hobbiesSection`   | Хобби                 |
| `seoData`          | SEO-метаданные        |

## Лицензия

MIT
