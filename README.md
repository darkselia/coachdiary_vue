
![cd_background](https://github.com/user-attachments/assets/dbcb3301-9881-4ced-b3f3-3ef03c6fbb42)

# 📘 Дневник тренера – клиентская часть

Этот проект — клиентская часть приложения **"Дневник тренера"**, разработанная с использованием **Vue.js** и **TypeScript**.

Сайт доступен по адресу: [https://coachdiary.ru](https://coachdiary.ru)
Тестовые аккаунты для входа в систему:
- `user0@example.com`
- `user1@example.com`
- `user2@example.com`

пароль: `password`

## 🛠️ Стек технологий

- Vue.js 3
- TypeScript
- Vue Router
- Pinia
- Vue Composition API
- CSS/SCSS

## 🚀 Запуск проекта локально

Для запуска следуйте инструкции ниже.

### 1. Клонируйте репозиторий и перейдите в директорию проекта:

```bash
git clone https://github.com/darkselia/coachdiary_vue.git
cd coachdiary_vue
```

### 2. Установите зависимости:

```bash
npm install
# или
yarn install
```

### 3. Создайте файл .env в корне проекта по примеру:

```env
VITE_API_URL=http://localhost:5173
VITE_DEBUG=(TRUE|FALSE)
```

### 4. Запустите проект в режиме разработки:

```bash
npm run dev
# или
yarn dev
```

Теперь проект доступен по адресу: http://localhost:5173

### 5. Для сборки проекта:

```bash
npm run build
# или
yarn build
```

## 📱 Функциональность

- Регистрация и авторизация
- Управление аккаунтом
- Управление нормативами
- Управление классами и учениками
- Управление результатами нормативов


## 🔧 Требования

- Node.js 16+
- npm или yarn
- Современный браузер с поддержкой ES6+

## 🤝 Связанные проекты

Серверная часть приложения доступна в репозитории [CoachDiary-backend](https://github.com/screenviolence/CoachDiary-backend)
Клиентская часть переписанная с помощью nuxt доступна в репозитории [CoachDiary_nuxt](https://github.com/darkselia/coachdiary_nuxt)

## 📦 Структура проекта

```
src/
├── api/                         # Типизированные HTTP-запросы
│   ├── auth.ts                  # Авторизация, регистрация и подтверждение email
│   ├── classes.ts               # Операции с классами
│   ├── http.ts                  # Общий HTTP-клиент и обработка ошибок
│   ├── profile.ts               # Операции с профилем
│   ├── standards.ts             # Операции с нормативами
│   └── students.ts              # Операции с учениками и результатами
├── assets/                      # Статические ресурсы и глобальные стили
├── components/
│   ├── classes/                 # Компоненты выбора классов
│   ├── diary/                   # Таблица дневника и фильтры
│   ├── standards/               # Таблицы нормативов
│   ├── students/                # Компоненты учеников
│   └── shared/
│       ├── content/             # Общие информационные компоненты и логотип
│       ├── layout/              # AppBar, TopPanel, PageFooter и layout
│       └── ui/                  # Переиспользуемые UI-компоненты
├── composables/
│   └── utils.ts                 # Общие debounce, file и blob-утилиты
├── router/                      # Настройки маршрутизации
├── stores/                      # Pinia: кэш классов, нормативов, UI и пользователя
├── types/                       # Типы по сущностям: auth, class, profile, standard, student
└── views/
    ├── auth/                   # LoginView и InfoView
    ├── classes/                # MyClassesView
    ├── diary/                 # MyDiaryView
    ├── profile/               # ProfileView
    ├── public/                # Главная и информационные страницы
    ├── standards/             # Список и редактирование нормативов
    └── students/              # Страница и форма ученика
```

Страницы содержат состояние и сценарии конкретного экрана. Stores отвечают за общие данные и их кэш, `api` — только за запросы, а компоненты — за отображение и события.

## 🔨 Скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка проекта
- `npm run preview` - Предпросмотр собранного проекта
- `npm run lint` - Проверка кода
- `npm run type-check` - Проверка типов TypeScript
