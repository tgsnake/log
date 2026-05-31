/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
import { Chalk, type ChalkInstance, inspect, platform } from './deps.js';
import { getLS, LocalStorage } from './LocalStorage.js';
import { sendLog, formatColor } from './Utilities.js';

/**
 * Custom color configuration mapping for various logging elements.
 * Colors can be provided as standard chalk color names, hex codes, or rgb/hsl/hsv/hwb strings.
 */
export interface LoggerColor {
  /** Color for debug-level output. Defaults to 'blue'. */
  debug?: string;
  /** Color for info-level output. Defaults to 'green'. */
  info?: string;
  /** Color for error-level output. Defaults to 'red'. */
  error?: string;
  /** Color for warning-level output. Defaults to 'yellow'. */
  warning?: string;
  /** Color for the logger name tag. Defaults to 'cyan'. */
  name?: string;
  /** Color for the timestamp element. Defaults to 'grey'. */
  date?: string;
}

/**
 * Valid logging severity levels.
 * - `none`: Disable all logging output.
 * - `info`: Standard informational messages.
 * - `debug`: Verbose messages detailing operational steps, ideal for debugging.
 * - `error`: Crucial error logs.
 * - `verbose`: Highly detailed, comprehensive logs.
 * - `warning`: Standard non-breaking alerts.
 */
export type TypeLogLevel = 'none' | 'info' | 'debug' | 'error' | 'verbose' | 'warning';

/**
 * Warning levels that define warning display behavior.
 * - `soft`: Warnings will only appear when the warning log level is actively enabled.
 * - `hard`: Warnings will appear across all enabled logging levels.
 */
export type TypeWarningLevel = 'soft' | 'hard';

/**
 * Configuration options for initializing a {@link Logger} instance.
 */
export interface LoggerOptions {
  /** The descriptive name of the logger instance. Defaults to 'unamed'. */
  name?: string;
  /** Array of active logging levels allowed for this logger. Defaults to `['debug']`. */
  level?: Array<TypeLogLevel>;
  /** Custom console styling colors. */
  customColor?: LoggerColor;
}

/**
 * Comprehensive customizable logger class utilized across the tgsnake framework.
 * Supports Deno, Node.js, and browser environments. Includes runtime custom levels, warning handling, and filters.
 */
export class Logger {
  /**
   * The formatted name tag of this logger instance.
   * Space characters are replaced by hyphens.
   * @private
   */
  private _name!: string;

  /**
   * Style configuration of the logger.
   * @private
   */
  private _color!: LoggerColor;

  /**
   * Key-value environmental storage client.
   * @private
   */
  private _storage: LocalStorage = getLS();

  /**
   * Chalk instance responsible for styling terminal output.
   * @private
   */
  private _chalk: ChalkInstance = new Chalk({ level: 3 });

  /**
   * Creates a new instance of the Logger.
   *
   * @param {LoggerOptions} [options={}] - Configurable parameters for the Logger.
   */
  constructor(options: LoggerOptions = {}) {
    options = Object.assign(
      {
        name: 'unamed',
        level: this._storage.getItem('LOGLEVEL') || ['debug'],
        customColor: {},
      },
      options,
    );
    this._name = options.name!.split(' ').join('-');
    this._storage.setItem(
      'LOGLEVEL',
      (this._storage.getItem('LOGLEVEL') || options.level?.join('|')) as string,
    );
    this._storage.setItem('LOGFILTERS', this._storage.getItem('LOGFILTERS') || 'all,unamed');
    this._storage.setItem('LOGWARNINGLEVEL', this._storage.getItem('LOGWARNINGLEVEL') || 'hard');
    this._color = Object.assign(
      {
        debug: 'blue',
        info: 'green',
        error: 'red',
        warning: 'yellow',
        name: 'cyan',
        date: 'grey',
      },
      options.customColor,
    );
  }

  /**
   * Creates a formatted template array based on the platform environment (Browser vs Terminal).
   *
   * @param {string} level - The level key representing the message type (e.g. 'info', 'debug').
   * @param {...Array<any>} args - The items to be logged.
   * @returns {Array<any>} Formatted log arguments ready for native log invocation.
   * @private
   */
  private template(level: string, ...args: Array<any>) {
    let now = new Date();
    if (platform === 'Browser') {
      return [
        `%c${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()} %c(${this._name}) %c${level} %c-`,
        `color: ${this._color.date};`,
        `color: ${this._color.name};`,
        `color: ${this._color[level as keyof LoggerColor]};`,
        ``,
        ...args,
      ];
    }
    return [
      formatColor(this._chalk, this._color.name!, `(${this._name})`),
      formatColor(this._chalk, this._color[level as keyof LoggerColor]!, level),
      '-',
      ...args,
      formatColor(
        this._chalk,
        this._color.date!,
        `${now.getDate()}/${
          now.getMonth() + 1
        }/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`,
      ),
    ];
  }

  /**
   * Determines if the logger instance is allowed to print to the console.
   * Checks the environment variables `LOGFILTERS` value.
   *
   * @returns {boolean} `true` if this logger is permitted to write console logs, otherwise `false`.
   * @private
   */
  private isAllowed(): boolean {
    let env = String(this._storage.getItem('LOGFILTERS') || '').split(',');
    if (!env.length) env = ['all', 'unamed'];
    if (env.includes('all')) return true;
    return env.includes(this._name);
  }

  /**
   * Gets the active log levels from storage.
   *
   * @returns {Array<TypeLogLevel>} List of currently allowed log level severities.
   * @private
   */
  private get _level(): Array<TypeLogLevel> {
    //@ts-ignore
    return String(this._storage.getItem('LOGLEVEL') || 'debug').split('|');
  }

  /**
   * Sets the active log levels in storage.
   *
   * @param {Array<TypeLogLevel>} level - Array of log levels to persist.
   * @private
   */
  private set _level(level: Array<TypeLogLevel>) {
    this._storage.setItem('LOGLEVEL', level.join('|'));
  }

  /**
   * Updates the active log levels. Filters out any unrecognized or invalid levels.
   * Approved levels include: `'none'`, `'info'`, `'debug'`, `'error'`, and `'verbose'`.
   *
   * @param {Array<TypeLogLevel>} level - An array containing the logging levels to enable.
   * @returns {Array<TypeLogLevel>} The newly filtered array of active log levels.
   */
  setLogLevel(level: Array<TypeLogLevel>): Array<TypeLogLevel> {
    level = level.filter((_level, _index) => {
      // @ts-ignore
      _level = _level.toLowerCase().trim();
      let approved: Array<TypeLogLevel> = ['none', 'info', 'debug', 'error', 'verbose'];
      //@ts-ignore
      if (!approved.includes(_level!)) {
        this.error(
          `Level of warning must be "none" or "info" or "debug" or "error" or "verbose", but got "${_level}"`,
        );
        return false;
      }
      return true;
    });
    return (this._level = level);
  }

  /**
   * Sets the warning output sensitivity configuration.
   * - `'hard'`: Warnings will be printed across all log levels.
   * - `'soft'`: Warnings only show up when the warning level is specifically enabled.
   *
   * @param {TypeWarningLevel} level - The warning level sensitivity target (`'hard'` or `'soft'`).
   * @returns {void}
   */
  setWarningLevel(level: TypeWarningLevel): void {
    let _level = level.toLowerCase().trim();
    let approved: Array<TypeWarningLevel> = ['hard', 'soft'];
    //@ts-ignore
    if (!approved.includes(_level!))
      return this.error(`Level of warning must be "hard" or "soft", but got "${level}"`);
    return this._storage.setItem('LOGWARNINGLEVEL', _level);
  }

  /**
   * Modifies the list of allowed logger names (filters) permitted to write to the console.
   * If a filter string case-insensitively matches `"all"`, all logger instances are allowed.
   * Space characters inside filter entries are automatically replaced by hyphens.
   *
   * @param {Array<string>} filters - Allowed logger instance names.
   * @returns {boolean} `true` on successful configuration.
   */
  setFilters(filters: Array<string>): boolean {
    let temp: Array<string> = [];
    for (let filter of filters) {
      if (/^All$/i.test(filter)) {
        temp.push('all');
      } else {
        temp.push(filter.split(' ').join('-'));
      }
    }
    this._storage.setItem('LOGFILTERS', temp.join(','));
    return true;
  }

  /**
   * Prints a raw console message without applying standard styling templates or verifying level limits.
   * Still respects configured name filters.
   *
   * @param {...Array<any>} args - Data items to be printed.
   * @returns {Array<any>} Array of the original input arguments.
   */
  log(...args: Array<any>): Array<any> {
    return sendLog(console.log, this.isAllowed(), ...args);
  }

  /**
   * Emits a formatted log message with `'debug'` severity level if permitted by current levels.
   *
   * @param {...Array<any>} args - Debug log content.
   * @returns {any} Result of the raw logger write if logging occurs, otherwise undefined.
   */
  debug(...args: Array<any>): any {
    let level: Array<TypeLogLevel> = ['debug', 'verbose'];
    for (let l of this._level) {
      if (level.includes(l)) {
        return this.log(...this.template('debug'!, ...args));
      }
    }
  }

  /**
   * Emits a formatted log message with `'info'` severity level if permitted by current levels.
   *
   * @param {...Array<any>} args - Informational log content.
   * @returns {any} Result of the raw logger write if logging occurs, otherwise undefined.
   */
  info(...args: Array<any>): any {
    let level: Array<TypeLogLevel> = ['info', 'debug', 'verbose'];
    const prnt = this.template('info'!, ...args);
    for (let l of this._level) {
      if (level.includes(l)) {
        return sendLog(console.info, this.isAllowed(), ...prnt);
      }
    }
  }

  /**
   * Emits a formatted log message with `'error'` severity level if permitted by current levels.
   *
   * @param {...Array<any>} args - Error log content.
   * @returns {any} Result of the raw logger write if logging occurs, otherwise undefined.
   */
  error(...args: Array<any>): any {
    let level: Array<TypeLogLevel> = ['error', 'debug', 'verbose'];
    const prnt = this.template('error'!, ...args);
    for (let l of this._level) {
      if (level.includes(l)) {
        return sendLog(console.error, this.isAllowed(), ...prnt);
      }
    }
  }

  /**
   * Emits a formatted warning log message if permitted by current levels or under `'hard'` warning severity.
   *
   * @param {...Array<any>} args - Warning log content.
   * @returns {any} Result of the raw logger write if logging occurs, otherwise undefined.
   */
  warning(...args: Array<any>): any {
    let level: Array<TypeLogLevel> = ['warning', 'debug', 'verbose'];
    if (this._storage.getItem('LOGWARNINGLEVEL') === 'hard') {
      level = level.concat(['none', 'info', 'error']);
    }
    const prnt = this.template('warning'!, ...args);
    for (let l of this._level) {
      if (level.includes(l)) {
        return sendLog(console.warn, this.isAllowed(), ...prnt);
      }
    }
  }

  /**
   * Utility that logs a formatted message if the current active levels match any entry in the target levels list.
   * Formatted using the styling of the first level entry in the levels array.
   *
   * @param {Array<TypeLogLevel>} level - Array of levels allowed to trigger this combined output.
   * @param {...Array<any>} args - Message content to log.
   * @returns {any} Result of the raw logger write if logging occurs, otherwise undefined.
   */
  combine(level: Array<TypeLogLevel>, ...args: Array<any>): any {
    for (let l of this._level) {
      if (level.includes(l)) {
        return this.log(...this.template(level[0]!, ...args));
      }
    }
  }

  /**
   * Custom Node.js utility inspect handler.
   * Returns a lightweight representation of the logger instance to preserve clean terminal layouts.
   *
   * @returns {Record<string, any>} Serialized custom view object.
   */
  [Symbol.for('nodejs.util.inspect.custom')](): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = value;
        }
      }
    }
    return toPrint;
  }

  /**
   * Custom Deno runtime inspect handler.
   *
   * @returns {string} Stringified inspected layout.
   */
  [Symbol.for('Deno.customInspect')](): string {
    return String(inspect((this as any)[Symbol.for('nodejs.util.inspect.custom')]()));
  }

  /**
   * Serializes the Logger instance to a simple JSON object.
   * Filters out private properties beginning with an underscore.
   *
   * @returns {Record<string, any>} JSON-compatible serialized object.
   */
  toJSON(): { [key: string]: any } {
    const toPrint: { [key: string]: any } = {
      _: this.constructor.name,
    };
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          toPrint[key] = typeof value === 'bigint' ? String(value) : value;
        }
      }
    }
    return toPrint;
  }

  /**
   * Returns a standard formatted string representation of this class instance.
   *
   * @returns {string} Details of the class name and current JSON serialized properties.
   */
  toString(): string {
    return `[constructor of ${this.constructor.name}] ${JSON.stringify(this, null, 2)}`;
  }
}
