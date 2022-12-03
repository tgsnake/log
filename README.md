# Tgsnake Log

This framework is used to better display logs on your console or terminal.

## Available log levels

This framework using env for betters performance :

- `LOGLEVEL` : To save the log level. So only declaring in one instance, all instance can read that log level.
- `LOGFILTERS` : To save any instance that can display context on console or terminal (according to the name that was given at the time of initialization). default is `all,unamed`.
- `LOGWARNINGLEVEL` : To save the warning level.

- `debug` or `verbose` : To showing all level in terminal.
- `info` : Shows only context with level `info` on console or terminal.
- `error` : Shows only context with level `error` on console or terminal.
- `warn` : Shows only context with level `warn` (`warning`) on console or terminal.
- `none` : Will not display anything on console or terminal

## How to use

```
const { Logger } = require("@tgsnake/log")
const log = new Logger({
  name : "some-string-without-space-here",
  level : "debug" // default level for this log
})

log.log("Hello World") // ( name ) info - Hello World
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

## MIT LICENSE

Build with ♥️ by [tgsnake dev](https://t.me/tgsnakechat).
