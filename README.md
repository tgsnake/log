# Tgsnake Logger

A lightweight, powerful, and highly customizable logging framework built to elevate console/terminal output. Works seamlessly across **Node.js**, **Deno**, **Bun**, and the **Browser**.

[![JSR](https://jsr.io/badges/@tgsnake/log)](https://jsr.io/@tgsnake/log) [![NPM Version](https://img.shields.io/npm/v/@tgsnake/log.svg)](https://www.npmjs.com/package/@tgsnake/log) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚠️ Breaking Changes in v2.0.0

Version `2.0.0` introduces modern packaging improvements to align with the current JS/TS ecosystem:

- **Pure ESM (EcmaScript Modules)**: The package is now fully ESM. Since Node 20+ has support `require(ESM)`, this package now has fully writen to ESM. Minimum Node.js version is now **>= 22.0.0**. Formal support has been added for **Deno (>= 1.0.0)** and **Bun (>= 1.0.0)**.
- **First-class JSR & Deno Support**: Native Deno integration and standard JSR publishing.

---

## 🚀 Features

- **Cross-Platform**: Run the exact same codebase on Node.js, Deno, Bun, and standard Web Browsers.
- **Unified Global State**: Uses `process.env` (Node/Bun/Deno) or `localStorage` (Browser) to synchronize configurations. Set log levels or filters once, and all instances automatically inherit the settings.
- **Advanced Dynamic Colors**: Complete control over styling with support for Hex codes (`#ff0000`), keywords (`orange`), RGB, HSL, HSV, and HWB.
- **Granular Filters**: Exclude or isolate output from specific logging instances using name-based filtering.
- **Warning Levels**: Toggle between `soft` and `hard` warning visibility modes.

---

## 📦 Installation

### Node.js / Bun / Package Managers

```bash
# npm
npm install @tgsnake/log

# yarn
yarn add @tgsnake/log

# pnpm
pnpm add @tgsnake/log

# bun
bun add @tgsnake/log
```

### Deno / JSR

```bash
# Deno CLI
deno add jsr:@tgsnake/log
```

---

## 🛠️ How to Use

### Basic Example

```javascript
import { Logger } from '@tgsnake/log';

const log = new Logger({
  name: 'my-app',
  level: ['debug'], // Default level for this log instance
});

log.log('Hello World');
// Output format: (my-app) info - Hello World DD/MM/YY hh:mm:ss.ms
```

### Logger Instance Methods

- `log(...args)`: Prints the log message directly without any specific levels/templates.
- `debug(...args)`: Prints verbose messages at the `debug` level.
- `info(...args)`: Prints informational messages at the `info` level.
- `warning(...args)`: Prints non-breaking warning alerts.
- `error(...args)`: Prints critical failure/error messages.
- `combine(levels, ...args)`: Logs a message applying styling and rules of multiple levels concurrently.
- `setLogLevel(levels)`: Dynamically update the active log level(s) for all instances globally.
- `setWarningLevel(mode)`: Set warning visibility level to `'hard'` (show warnings across all log levels) or `'soft'` (only show warnings when warning/debug/verbose level is active).
- `setFilters(filters)`: Set filter strings (comma-separated names) to decide which instances are allowed to output logs.

---

## ⚙️ Configuration & Environment Variables

`@tgsnake/log` leverages environmental variables (`process.env` or browser `localStorage`) to maintain high-performance global states across all logger instances.

| Variable | Default | Description |
| :-- | :-- | :-- |
| `LOGLEVEL` | `['debug']` | Active logging levels. Options include: `none`, `info`, `debug`, `error`, `verbose`, `warning`. |
| `LOGFILTERS` | `'all,unamed'` | Comma-separated names of logger instances permitted to print. Use `'all'` to allow everything. |
| `LOGWARNINGLEVEL` | `'hard'` | Behavior of warnings. Set to `'hard'` or `'soft'`. |

---

## 🎨 Console Color Customization

Customizing console/terminal themes is incredibly simple. For RGB, HSL, HSV, and HWB, use the standard functional format: `format(a,b,c)` (e.g. `rgb(0,255,0)`). Hex codes (e.g., `#ff0505`) and standard keyword strings (e.g. `azure`, `grey`) are also fully supported.

### Logger Options Interface

```typescript
interface LoggerOptions {
  name?: string; // Name of logger instance (default: 'unamed')
  level?: Array<TypeLogLevel>; // Default log levels if global state not set
  customColor?: LoggerColor; // Custom colors for different output segments
}
```

### Color Configuration

| Key       |   Type   | Description                                    |
| :-------- | :------: | :--------------------------------------------- |
| `name`    | `string` | Color applied to the logger's name tag.        |
| `date`    | `string` | Color applied to the timestamp element.        |
| `debug`   | `string` | Color applied to the debug and verbose levels. |
| `info`    | `string` | Color applied to the info level.               |
| `error`   | `string` | Color applied to the error level.              |
| `warning` | `string` | Color applied to the warning level.            |

#### Custom Color Example

```javascript
import { Logger } from '@tgsnake/log';

const log = new Logger({
  name: 'auth-service',
  level: ['debug', 'info', 'error'],
  customColor: {
    name: 'cyan',
    date: 'grey',
    debug: 'blue',
    info: 'rgb(0,255,0)',
    error: '#ff0505',
    warning: 'hsv(44,98,100)',
  },
});

log.info('Service started successfully!');
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).

Built with ♥️ by the tgsnake dev.
