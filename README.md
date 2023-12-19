# Tgsnake Log

This framework is used to better display logs on your console or terminal.

## Available log levels

This framework using `env` in node and `localStorage` in browser for betters performance :

- `LOGLEVEL` : To save the log level. So only declaring in one instance, all instance can read that log level.
- `LOGFILTERS` : To save any instance that can display context on console or terminal (according to the name that was given at the time of initialization). default is `all,unamed`.
- `LOGWARNINGLEVEL` : To save the warning level.

- `debug` or `verbose` : To showing all level in terminal.
- `info` : Shows only context with level `info` on console or terminal.
- `error` : Shows only context with level `error` on console or terminal.
- `warn` : Shows only context with level `warn` (`warning`) on console or terminal.
- `none` : Will not display anything on console or terminal

## How to use

```js
const { Logger } = require('@tgsnake/log');
const log = new Logger({
  name: 'some-string-without-space-here',
  level: ['debug'], // default level for this log
});

log.log('Hello World'); // (name) info - Hello World DD/MM/YY hh:mm:ss.ms
```

## Class Method

- `log` : Print log without template.
- `info` : Print log as info level.
- `error` : Print log as error level.
- `warning` : Print log as warning level.
- `combine` : Print log as multiple level.
- `debug` : Print log as debug level.
- `setLogLevel` : Setting the log level.
- `setWarningLevel` : Setting the warning level. `hard` if you want show the context in all log level, `soft` if you want show the context only in `warning` or `debug` or `verbose` level.
- `setFilters` : Setting any instance that can display context in the console or terminal.

## Capturing log

**The log capture feature is only available on node js and deno platforms, not available for browsers!**

To capture logs we use env as the trigger. When in the env have `CAPTURELOG` The capture function will automatically work and stop when the program is finished (`beforeExit` event on node and `beforeunload` event on deno) or when it is forced to stop due to an error (`unhandledRejection` event on node and `unhandledrejection` on deno).  
The log will be captured in the form of a log file with filename format: `{name}-{Date.now()}.log` and will be saved in the current work dir (cwd).  
Value of env `CAPTURELOG` is name of logger or can be `'all'` for each instance the logger runs the capture function.

### Example :

```env
CAPTURELOG=tgsnake
```

With the example above, only the instance named `tgsnake` performs the capture function.

```env
CAPTURELOG=all
```

With the example above, all of the instance logger will be performs the capture function.

You don't need to create an .env file, you can do it like this :

```bash
CAPTURELOG="all" node index.js
```

## Options

| parameter | type | description |
| :-- | :-: | :-- |
| name | string | Name of logger instance, default is `unamed` |
| level | Array of `debug`, `none`, `info`, `error`, `verbose` | The level of the logger. By default it will take the value from the env `LOGLEVEL` or if it is not available it will automatically go into `debug` level |
| customColor | [Color](#color) | Console color customization |

### Color

On deno supports chalk v5 customization while on node supports chalk v4 customization. For RGB, HSL (only for node), HSV (only for node), HWB (only for node), you can use the format: `format(a,b,c)` example `rgb(0,0,0)` or `hsl(0,0,0)`. And you can directly provide the hex code (eg: `#fff`). In nodes, you can also use [keywords from CSS](https://www.w3.org/wiki/CSS/Properties/color/keywords) like `orange`.

| category |  type  | description                              |
| :------- | :----: | :--------------------------------------- |
| name     | string | color of logger name                     |
| date     | string | color of date                            |
| debug    | string | color when debug level and verbose level |
| info     | string | color when info level                    |
| error    | string | color when error level                   |
| warning  | string | color when warning level                 |

#### Example

```js
const { Logger } = require("@tgsnake/log")
const log = new Logger({
  name : "some-string-without-space-here",
  level : ["debug"] // default level for this log,
  customColor : {
    debug: 'blue',
    info: 'rgb(0,255,0)',
    error: '#ff0505',
    warning: 'hsv(44,98,100)',
    name: 'azure',
    date: 'grey',
  }
})
```

## MIT LICENSE

Build with ♥️ by [tgsnake dev](https://t.me/tgsnakechat).
