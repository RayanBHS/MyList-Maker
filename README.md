# MyList Maker

Web project - To-Do List app (Milestone 2 : front-end with Vue.js)

Team : ROUSSELLE Cyril - BELHOUS Rayan - SOLLIER Ezvin - COLSON Auxence

## How to run

You need Node.js.

```
npm install
npm run dev
```

Then open http://localhost:5173

For now there is no back-end : the lists and tasks are example data in App.vue and the login page only opens the app. The back-end (Node.js + MySQL) and the real login are for milestone 3.

## Structure

- `src/App.vue` : main component, data and methods of the app
- `src/components/` : LoginPage, SideBar, HomePage, ListPage, FilterPage, CalendarPage, MapPage, SettingsPage
- `src/utils.js` : functions used in several components
- `src/assets/style.css` : the design (vanilla CSS)
- `public/img/` : logo and icons

## Features

- login page (design only)
- multiple lists with a color
- tasks with 3 status : To Do, Doing, Done
- flag a task, add a date, a description and a location
- Scheduled / Flagged / Today / All filters
- calendar
- map with the tasks that have a location
