# 🚀 Redux Setup Instructions

## Встановлення залежностей

Проект використовує Redux Toolkit та React Redux для управління станом. Залежності вже встановлені:

```bash
npm install @reduxjs/toolkit react-redux
```

## Структура Redux

### 1. Store (`src/store/store.js`)
- Основна конфігурація Redux store
- Підключення всіх reducers

### 2. Sessions Slice (`src/store/sessionsSlice.js`)
- Управління станом сеансів
- Actions: `addSession`, `removeSession`, `clearAllSessions`
- State: `sessions`, `loading`, `error`

### 3. Hooks (`src/store/hooks.js`)
- Кастомні хуки для роботи з Redux
- `useAppDispatch` - для диспатчу actions
- `useAppSelector` - для отримання стану
- `useSessions` - спеціалізований хук для сеансів

## Використання в компонентах

### Додавання сеансу
```javascript
import { useAppDispatch } from '../store/hooks';
import { addSession } from '../store/sessionsSlice';

const dispatch = useAppDispatch();

const handleSubmit = async (sessionData) => {
    await dispatch(addSession(sessionData));
};
```

### Отримання сеансів
```javascript
import { useSessions } from '../store/hooks';

const { sessions, loading } = useSessions();
```

### Видалення сеансу
```javascript
import { useAppDispatch } from '../store/hooks';
import { removeSession } from '../store/sessionsSlice';

const dispatch = useAppDispatch();

const handleDelete = async (sessionId) => {
    await dispatch(removeSession(sessionId));
};
```

## Запуск проекту

```bash
npm run dev
```

Проект буде доступний за адресою: http://localhost:5173/

## Перевірка роботи

1. **Створення сеансу**: Перейдіть на "Create Session" та створіть новий сеанс
2. **Перегляд у хедері**: Створений сеанс автоматично з'явиться в хедері
3. **Управління**: Перейдіть на "Favorite Sessions" для перегляду та управління

## Структура даних сеансу

```javascript
{
    id: "unique_id",
    title: "Назва фільму",
    date: "2024-01-15",
    time: "19:30",
    hall: "1",
    contact: "+380...",
    duration: 120,
    notes: "Додаткові нотатки",
    createdAt: "2024-01-15T10:00:00.000Z"
}
```

## Troubleshooting

### Помилка "Failed to resolve import"
- Переконайтеся, що пакети встановлені: `npm list @reduxjs/toolkit react-redux`
- Якщо не встановлені: `npm install @reduxjs/toolkit react-redux`

### Помилка компіляції
- Перевірте синтаксис у всіх файлах
- Перезапустіть dev сервер: `npm run dev`

### Redux не працює
- Перевірте, чи Provider обгортає App в main.jsx
- Перевірте консоль браузера на наявність помилок
