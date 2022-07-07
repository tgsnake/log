/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2022 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import chalk from 'chalk';
import * as NodeUtil from 'util';
export interface LoggerColor {
  debug?: string;
  info?: string;
  error?: string;
  warning?: string;
  name?: string;
}
export type TypeLogLevel = 'none' | 'info' | 'debug' | 'error' | 'verbose' | 'warning';
export type TypeWarningLevel = 'soft' | 'hard';
export interface LoggerOptions {
  name?: string;
  level?: TypeLogLevel;
  customColor?: LoggerColor;
}
export class Logger {
  /** @hidden */
  private _name!: string;
  /** @hidden */
  private _warningLevel!: TypeWarningLevel;
  /** @hidden */
  private _color!: LoggerColor;
  constructor(options: LoggerOptions = {}) {
    options = Object.assign(
      {
        name: 'unamed',
        level: process.env.LOGLEVEL ?? 'debug',
        customColor: {
          debug: 'blue',
          info: 'green',
          error: 'red',
          warning: 'yellow',
          name: 'cyan',
        },
      },
      options
    );
    this._warningLevel = 'hard';
    // @ts-ignore
    this._name = options.name.split(' ').join('-');
    process.env.LOGLEVEL = options.level;
    process.env.LOGFILTERS = 'all,unamed';
    this._color = Object.assign(
      {
        debug: 'blue',
        info: 'green',
        error: 'red',
        warning: 'yellow',
        name: 'orange',
      },
      options.customColor
    );
  }
  /**
   * @hidden
   * Creating a log template.
   */
  private template(level: string) {
    //@ts-ignore
    return [chalk[this._color.name](`( ${this._name} )`), chalk[this._color[level]](level), '-'];
  }
  /**
   * @hidden
   * Filters this instance is allowed to write context in console.
   */
  private isAllowed(): boolean {
    let env = String(process.env.LOGFILTERS).split(',');
    if (!env.length) env = ['all', 'unamed'];
    if (env.includes('all')) return true;
    return env.includes(this._name);
  }
  /**
   * @hidden
   * Get the current log level
   */
  private get _level(): TypeLogLevel {
    //@ts-ignore
    return process.env.LOGLEVEL ?? 'debug';
  }
  private set _level(level: TypeLogLevel) {
    process.env.LOGLEVEL = level;
  }
  /**
   * Setting a log level.
   */
  setLogLevel(level: TypeLogLevel) {
    let _level = level.toLowerCase().trim();
    let approved: Array<TypeLogLevel> = ['none', 'info', 'debug', 'error', 'verbose'];
    //@ts-ignore
    if (!approved.includes(_level!))
      return this.error(
        `Level of warning must be "none" or "info" or "debug" or "error" or "verbose", but got "${level}"`
      );
    //@ts-ignore
    return (this._level = _level);
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
    //@ts-ignore
    return (this._warningLevel = _level);
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
    process.env.LOGFILTERS = temp.join(',');
    return true;
  }
  /**
   * Create log without template and without levels.
   */
  log(...args: Array<any>) {
    if (this.isAllowed()) {
      if (args.length > 1) {
        let fargs: Array<any> = new Array();
        for (let arg of args) {
          if (typeof arg == 'object') {
            fargs.push(
              NodeUtil.inspect(arg, {
                showHidden: true,
                colors: true,
              })
            );
          } else {
            fargs.push(arg);
          }
        }
        console.log(...fargs);
      } else {
        let fargs: Array<any> = new Array();
        if (typeof args[0] == 'object') {
          fargs.push(
            NodeUtil.inspect(args[0], {
              showHidden: true,
              colors: true,
            })
          );
        } else {
          fargs.push(args[0]);
        }
        console.log(...fargs);
      }
    }
    return args;
  }
  /**
   * Creating log with debug level
   */
  debug(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('debug'!), ...args);
  }
  /**
   * Creating log with info level
   */
  info(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['info', 'debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('info'!), ...args);
  }
  /**
   * Creating log with error level
   */
  error(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['error', 'debug', 'verbose'];
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('error'!), ...args);
  }
  /**
   * Creating log with warning level
   */
  warning(...args: Array<any>) {
    let level: Array<TypeLogLevel> = ['warning', 'debug', 'verbose'];
    if (this._warningLevel === 'hard') {
      level.concat(['none', 'info', 'error']);
    }
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template('warning'!), ...args);
  }
  /**
   * Creating log with combine level. <br/>
   * Like if you want to show the console in level "error" and "info" pass it as array in first arguments.<br/>
   * The selected template will use the first index in the array.
   */
  combine(level: Array<TypeLogLevel>, ...args: Array<any>) {
    if (!level.includes(this._level)) return this._level;
    return this.log(...this.template(level[0]!), ...args);
  }
  /** @hidden */
  [NodeUtil.inspect.custom]() {
    const toPrint: { [key: string]: any } = {};
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
  /** @hidden */
  toJSON() {
    const toPrint: { [key: string]: any } = {};
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        const value = this[key];
        if (!key.startsWith('_')) {
          if (typeof value == 'bigint') {
            toPrint[key] = String(value);
          } else {
            toPrint[key] = value;
          }
        }
      }
    }
    return toPrint;
  }
}
