# Netbrew Cafe Inventory

An Expo and React Native mobile point-of-sale and inventory app for a cafe. The
inventory is designed to remain usable offline and persist on the device.

## Features

- Add, view, edit, delete, and search products in the Stock tab.
- Search products by name, description, or category.
- Use the same saved catalog throughout the Home, Menu, Stock, and Cart screens.
- Persist inventory in SQLite on Android and iOS, including across app restarts
  and periods without network access.
- Use browser `localStorage` when running the web version.

The product database is local to each device; this app does not synchronize
inventory to a server or between devices.

## Run the app

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Use the Expo CLI options to open the app on a device, emulator, or web browser.

## Local data

The mobile app initializes its SQLite database on first launch and seeds the
starter catalog once. Subsequent launches load the saved products rather than
replacing them with the starter data. Product category and name sorting are
indexed in the database.

## Notes for contributors

Device data is stored locally and is not included in the Git repository. Keep
local credentials and developer-tool configuration out of commits; the local
OpenCode configuration file is ignored by Git.

## Laboratory Exercise 05

This project demonstrates offline-first CRUD operations using Expo SQLite.