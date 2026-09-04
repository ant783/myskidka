# ГдеСкидка — прототип

Кликабельный прототип карты цен и акций (Пермь / Пермский край) на React + Vite + Tailwind.

## Локальный запуск

```bash
npm install
npm run dev
```

Откроется адрес вида `http://localhost:5173`.

## Публикация в Vercel (аккаунт milleniumprm)

Самый быстрый способ — через Vercel CLI, без GitHub.

```bash
npm install -g vercel
cd gdeskidka
vercel login          # войти в аккаунт, к которому привязан milleniumprm
vercel                # первый деплой: задаст пару вопросов, создаст превью-ссылку
vercel --prod         # публикация на боевой домен проекта
```

При первом запуске `vercel` спросит:
- **Set up and deploy?** → Yes
- **Which scope?** → выбрать аккаунт/команду `milleniumprm`
- **Link to existing project?** → No (если проекта `gdeskidka` ещё нет в аккаунте) — тогда CLI создаст новый проект внутри `milleniumprm` и после `vercel --prod` сайт будет доступен по адресу вида:
  `https://gdeskidka.vercel.app` или `https://gdeskidka-milleniumprm.vercel.app` (Vercel сам подберёт свободное имя, точный адрес покажет в конце команды).
- **Build command / Output directory** — можно оставить пустыми, Vercel сам определит Vite-проект (`npm run build`, папка `dist`).

### Альтернатива — через сайт vercel.com

1. Залить эту папку в репозиторий на GitHub.
2. На https://vercel.com/milleniumprm нажать **Add New → Project**.
3. Выбрать репозиторий — Vercel сам распознает фреймворк Vite и предложит правильные настройки сборки.
4. Нажать **Deploy**.

## Свой домен

В настройках проекта на Vercel → **Settings → Domains** можно привязать домен (например `gdeskidka.ru`), купленный отдельно у любого регистратора.
