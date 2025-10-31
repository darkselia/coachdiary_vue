
![cd_background](https://github.com/user-attachments/assets/dbcb3301-9881-4ced-b3f3-3ef03c6fbb42)

# 📘 Дневник тренера – клиентская часть

Этот проект — клиентская часть приложения **"Дневник тренера"**, разработанная с использованием **Vue.js** и **TypeScript**.

## 🛠️ Стек технологий

- Vue.js 3
- TypeScript
- Vue Router
- Pinia (для управления состоянием)
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
├── assets/         # Статические ресурсы
├── components/     # Vue компоненты
├── router/         # Настройки маршрутизации
├── stores/         # Хранилища Pinia
├── types/          # TypeScript типы
├── utils/          # Вспомогательные функции
└── views/          # Компоненты-страницы
```

## 🔨 Скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка проекта
- `npm run preview` - Предпросмотр собранного проекта
- `npm run lint` - Проверка кода
- `npm run type-check` - Проверка типов TypeScript
