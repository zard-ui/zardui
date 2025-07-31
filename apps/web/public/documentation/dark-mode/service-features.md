# DarkMode Service Features

The ZardUI DarkMode service provides:

## ✨ Key Features

- **🔄 Theme Toggle**: Switch between light and dark modes
- **💾 Persistence**: Remembers user preference in localStorage
- **🎯 System Detection**: Respects user's system preference on first visit
- **⚡ Performance**: Efficient DOM manipulation
- **🔒 Type Safety**: Full TypeScript support
- **🌐 Universal**: Works in any Angular project

## 🛠️ Service Methods

- `initTheme()`: Initialize theme on app startup
- `toggleTheme()`: Toggle between light and dark modes
- `setTheme(theme: 'light' | 'dark')`: Set specific theme
- `getCurrentTheme()`: Get current theme state
- `getSystemTheme()`: Get system preference

## 🎨 CSS Class Management

The service automatically manages the `.dark` class on the `<html>` element:

- **Light mode**: No class applied
- **Dark mode**: `.dark` class added to `<html>`

This approach works perfectly with TailwindCSS v4 custom variants.