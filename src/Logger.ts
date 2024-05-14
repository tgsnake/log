/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { type Chalk, ChalkInstance, inspect, isBrowser } from './platform.deno.ts';
import { getLS, LocalStorage } from './LocalStorage.ts';
import { sendLog, formatColor } from './Utilities.ts';

export interface LoggerColor {
  debug?: string;
  info?: string;
  error?: string;
  warning?: string;
  name?: string;
  date?: string;
}
export type TypeLogLevel = 'none' | 'info' | 'debug' | 'error' | 'verbose' | 'warning';
export type TypeWarningLevel = 'soft' | 'hard';
export interface LoggerOptions {
  name?: string;
  level?: Array<TypeLogLevel>;
  customColor?: LoggerColor;
}
export class Logger {
  /** @ignore */
  private _name!: string;
  /** @ignore */
  private _color!: LoggerColor;
  /** @ignore */
  private _storage: LocalStorage = getLS();
  /** @ignore */
  private _chalk: Chalk = new ChalkInstance({ level: 3 });
  constructor(options: LoggerOptions = {}) {
    options = Object.assign(
      {
        name: 'unamed',
        level: this._storage.getItem('LOGLEVEL') || ['debug'],
        customColor: {},
      },
      options,
    );
    // @ts-ignore
    this._name = options.name.split(' ').join('-');
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
   * @ignore
   * Creating a log template.
   */
  private template(level: string, ...args: Array<any>) {
    let now = new Date();
    if (isBrowser) {
      return [
        `%c(${this._name}) %c${level} - %c${'%o'.repeat(args.length)} %c${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`,
        `color: ${this._color.name};`,
        `color: ${this._color[level]};`,
        ``,
        ...args,
        `color: ${this._color.date};`,
      ];
    }
    return [
      formatColor(this._chalk, this._color.name!, `(${this._name})`),
      formatColor(this._chalk, this._color[level], level),
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
   * @ignore
   * Filters this instance is allowed to write context in console.
   */
  private isAllowed(): boolean {
    let env = String(this._storage.getItem('LOGFILTERS') || '').split(',');
    if (!env.length) env = ['all', 'unamed'];
    if (env.includes('all')) return true;
    return env.includes(this._name);
  }
  /**
   * @ignore
   * Get the current log level
   */
  private get _level(): Array<TypeLogLevel> {
    //@ts-ignore
    return String(this._storage.getItem('LOGLEVEL') || 'debug').split('|');
  }
  private set _level(level: Array<TypeLogLevel>) {
    this._storage.setItem('LOGLEVEL', level.join('|'));
  }
  /**
   * Setting a log level.
   */
  setLogLevel(level: Array<TypeLogLevel>) {
    level = level.filter((_level, index) => {
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
   * Setting a warning level. <br/>
   * If you set "hard" the warning will be appears in any log levels.<br/>
   * If you set "soft" the warning will be appears only in warning log level.
   */
  setWarningLevel(level: TypeWarningLevel) {
    let _level = level.toLowerCase().trim();
    let approved: Array<TypeWarningLevel> = ['hard', 'soft'];
    //@ts-ignore
    if (!approved.includes(_level!))
      return this.error(`Level of warning must be "hard" or "soft", but got "${level}"`);
    return this._storage.setItem('LOGWARNINGLEVEL', _level);
  }
  /**
   * Setting a log filters <br/>
   * If you set to "all", all instance will allowed to write context in console or terminal.
   */
  setFilters(filters: Array<string>) {
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
   * Create log without template and without levels.
   */
  log(...args: Array<any>) {
    return sendLog(console.log, this.isAllowed(), ...args);
  }
  /**
   * Creating log with debug level
   */
  debug(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['debug', 'verbose'];
    for (let l of this._level) {
      if (level.includes(l)) {
        return this.log(...this.template('debug'!, ...args));
      }
    }
  }
  /**
   * Creating log with info level
   */
  info(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['info', 'debug', 'verbose'];
    const prnt = this.template('info'!, ...args);
    for (let l of this._level) {
      if (level.includes(l)) {
        return sendLog(console.info, this.isAllowed(), ...prnt);
      }
    }
  }
  /**
   * Creating log with error level
   */
  error(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['error', 'debug', 'verbose'];
    const prnt = this.template('error'!, ...args);
    for (let l of this._level) {
      if (level.includes(l)) {
        return sendLog(console.error, this.isAllowed(), ...prnt);
      }
    }
  }
  /**
   * Creating log with warning level
   */
  warning(...args: Array<any>) {
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
   * Creating log with combine level. <br/>
   * Like if you want to show the console in level "error" and "info" pass it as array in first arguments.<br/>
   * The selected template will use the first index in the array.
   */
  combine(level: Array<TypeLogLevel>, ...args: Array<any>) {
    for (let l of this._level) {
      if (level.includes(l)) {
        return this.log(...this.template(level[0]!, ...args));
      }
    }
  }
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
  [Symbol.for('Deno.customInspect')](): string {
    return String(inspect(this[Symbol.for('nodejs.util.inspect.custom')]()));
  }
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
  toString() {
    return `[constructor of ${this.constructor.name}] ${JSON.stringify(this, null, 2)}`;
  }
}
