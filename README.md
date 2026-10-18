# Vue Lottery App

Лабораторна робота №5 (гілка `feature/routing`). Застосунок-лотерея на Vue 3 + TypeScript (Composition API), Vue Router, Pinia, Bootstrap (SCSS) з даними з [DummyJSON](https://dummyjson.com).

## Функціональність

- сторінки Home, About author, Users, Login та 404 з лінивим завантаженням
- `DefaultLayout` та `AuthLayout` через `meta.layout`, заголовок вкладки через `meta.title`
- список користувачів з DummyJSON з пагінацією та пошуком у query-параметрах (`/users?page=2&q=john`)
- сторінка користувача `/users/:id` та вкладене редагування `/users/:id/edit`
- створення, редагування й видалення користувачів з оновленням локального стану (DummyJSON лише імітує зміни)
- випадковий вибір до трьох переможців
- валідація форм через VeeValidate + yup
- JWT-авторизація (`/auth/login`, `/auth/me`), захист маршрутів через `meta.requiresAuth`
- автоматичне оновлення `accessToken` через `/auth/refresh` при відповіді 401
- патерн Repository: `Readable`/`Creatable`/`Editable`/`Deletable`, `UserService`, `AuthService`, `ServiceProvider`

Тестовий акаунт: `emilys` / `emilyspass`.

## Запуск

Скопіюйте `.env.example` у `.env` (там задається `VITE_API_URL`), потім:

```bash
npm install
npm run dev
```

## Деплой на GitHub Pages

```bash
npm run deploy
```
