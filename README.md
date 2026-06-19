# StorageApp (Todo CRUD) — README

## Overview
**StorageApp** is a simple mobile app built with **Expo + React Native + Expo Router** that lets you manage a list of **Todos**.

Core features:
- View todos (fetched from a backend)
- Add a new todo
- Toggle a todo’s completion status (`done: true/false`)
- Delete a todo
- Update todos using **TanStack React Query** for caching + better performance

Main UI screen:
- `app/(tabs)/index.tsx`

Backend (REST API):
- `json-server` using `server/db.json`

---

## Tech Stack
- **Expo / React Native**: app framework
- **Expo Router**: navigation (tabs route group)
- **TanStack React Query**: data fetching + cache for performance
- **json-server**: mock REST API from JSON
- **sleep-promise**: adds a delay to `getTodos()` to showcase loading UI

---

## Project Structure (important files)
### Frontend
- **`app/(tabs)/index.tsx`**
  - The “Todos” tab screen
  - Uses `useQuery` to load todos
  - Uses `useMutation` to add/delete/update todos
  - Uses a `FlatList` to render todos

- **`app/_layout.tsx`**
  - Initializes the app providers
  - Wraps the app with `QueryClientProvider` (React Query)
  - Loads the font and controls splash screen behavior

### Backend
- **`server/db.json`**
  - JSON data source used by `json-server`
  - Provides the `todos` collection

- **`api/todo.ts`**
  - Frontend API client (calls the json-server REST endpoints)
  - Implements:
    - `getTodos()` → GET `/todos`
    - `createTodo(text)` → POST `/todos`
    - `updateTodo(todo)` → PUT `/todos/:id`
    - `deleteTodo(id)` → DELETE `/todos/:id`

---

## What the UI Does (from `app/(tabs)/index.tsx`)
### 1) Load Todos
The screen fetches todos using:
- `useQuery({ queryKey: ['todos'], queryFn: getTodos })`

While loading, it shows:
- `ActivityIndicator`

Then renders:
- `<FlatList data={todosQuery.data} ... />`

### 2) Add Todo
When you type text and press **Add**, it calls:
- `useMutation({ mutationFn: createTodo, onSuccess: invalidateTodos })`

On success:
- `queryClient.invalidateQueries({ queryKey: ['todos'] })`
- This triggers a refetch so the list updates.

### 3) Toggle Done
Tapping the todo row toggles `done`:
- `updateMutation.mutate({ ...item, done: !item.done })`

On success, it updates the cache directly using:
- `queryClient.setQueryData(['todos'], ...)`

This avoids invalidating everything and improves responsiveness.

### 4) Delete Todo
Pressing the trash icon calls:
- `deleteMutation.mutate(item.id)`

On success:
- it invalidates `['todos']` so the list refreshes.

---

## JSON Server (Backend) — Important
### What is `json-server`?
`json-server` turns a simple JSON file into a full REST API automatically.

### Data source
Your data lives in:
- `server/db.json`

### Endpoints it provides
For the `todos` array, json-server automatically creates:
- `GET /todos`
- `POST /todos`
- `PUT /todos/:id`
- `DELETE /todos/:id`

---

## Environment Variable: `EXPO_PUBLIC_API_URL`
In **`api/todo.ts`**, the API base URL is read from:
- `process.env.EXPO_PUBLIC_API_URL`

Example usage in code:
- `fetch(`${API_URL}/todos` )`

So you must set `EXPO_PUBLIC_API_URL` to your json-server URL.

Examples:
- If json-server runs on your machine: `http://localhost:3001`
- If you use a physical device/emulator, `localhost` may not work.
  - Use your PC’s LAN IP instead, e.g. `http://192.168.x.x:3001`

---

## How to Run
### 1) Start json-server
From the project root:
```bash
npx json-server --watch server/db.json --port 3001
```

### 2) Start the Expo app
```bash
npm start
```
Then run the app using the Expo UI.

---

## API Endpoints Summary (Todos)
Implemented in `api/todo.ts`:
- **List**: `GET /todos`
- **Create**: `POST /todos`
- **Update**: `PUT /todos/:id`
- **Delete**: `DELETE /todos/:id`

---

## Notes / Useful Behaviors
- `getTodos()` includes a delay (`sleep(2000)`), so you’ll see the loading spinner.
- Add/Delete invalidate the `['todos']` query.
- Toggle updates cached data directly for performance.

---

## Files to Review (quick navigation)
- `app/(tabs)/index.tsx` (UI + queries/mutations)
- `api/todo.ts` (fetch logic)
- `server/db.json` (initial data)

