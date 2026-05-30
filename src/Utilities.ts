/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
import { inspect, type ChalkInstance, ColorConvert } from './deps.js';

/**
 * Regular expression to match RGB, HSL, HSV, or HWB color format patterns.
 * E.g., `rgb(255, 255, 255)`, `hsl(120, 100, 50)`.
 * @private
 */
const RGBRe = /(\w+)\((\d+),(\d+),(\d+)\)/i;

/**
 * Regular expression to validate standard Hexadecimal color codes (3 or 6 characters).
 * E.g., `#FFF` or `#FFFFFF`.
 * @private
 */
const HEXRe = /^#([A-F0-9]{3}|[A-F0-9]{6})$/i;

/**
 * Defines valid native console logging methods.
 */
export type NativeLog =
  | typeof console.log
  | typeof console.error
  | typeof console.info
  | typeof console.warn;

/**
 * Sends a log message using the specified native logging function if permitted.
 * Handles objects by utilizing Node.js or Deno's `inspect` utility to print full details with syntax colors.
 *
 * @param {NativeLog} nativelog - The native logging function to invoke (e.g. console.log, console.error).
 * @param {boolean} isAllowed - Flag indicating whether logging is allowed under the current level/filters.
 * @param {...Array<any>} args - The arguments/messages to log.
 * @returns {Array<any>} The original arguments array.
 */
export function sendLog(nativelog: NativeLog, isAllowed: boolean, ...args: Array<any>) {
  if (isAllowed) {
    if (args.length > 1) {
      let fargs: Array<any> = new Array();
      for (let arg of args) {
        if (typeof arg == 'object') {
          fargs.push(
            inspect(arg, {
              showHidden: false,
              colors: true,
            }),
          );
        } else {
          fargs.push(arg);
        }
      }
      nativelog(...fargs);
    } else {
      let fargs: Array<any> = new Array();
      if (typeof args[0] == 'object') {
        fargs.push(
          inspect(args[0], {
            showHidden: false,
            colors: true,
          }),
        );
      } else {
        fargs.push(args[0]);
      }
      nativelog(...fargs);
    }
  }
  return args;
}

/**
 * Formats a text string with terminal/console color codes using chalk and color-convert.
 * Supports standard Hex colors, color keywords, rgb/hsl/hsv/hwb functional notation, and chalk keywords.
 *
 * @param {ChalkInstance} chalk - The chalk instance used to format/colorize output.
 * @param {string} color - The color identifier (e.g. 'red', '#ff0000', 'rgb(0,255,0)', 'hsl(...)').
 * @param {string} text - The text content to apply colors to.
 * @returns {string} The formatted/colorized string, or the raw text if formatting could not be applied.
 */
export function formatColor(chalk: ChalkInstance, color: string, text: string) {
  if (RGBRe.exec(color)) {
    const [_input, format, a, b, c] = RGBRe.exec(color) as RegExpExecArray;
    if (format.toLocaleLowerCase() === 'rgb' && chalk.rgb) {
      return chalk.rgb(Number(a), Number(b), Number(c))(text);
    }
    if (format.toLocaleLowerCase() === 'hsl') {
      return formatColor(
        chalk,
        `rgb(${ColorConvert.hsl.rgb(Number(a), Number(b), Number(c)).join(',')})`,
        text,
      );
    }
    if (format.toLocaleLowerCase() === 'hsv') {
      return formatColor(
        chalk,
        `rgb(${ColorConvert.hsv.rgb(Number(a), Number(b), Number(c)).join(',')})`,
        text,
      );
    }
    if (format.toLocaleLowerCase() === 'hwb') {
      return formatColor(
        chalk,
        `rgb(${ColorConvert.hwb.rgb(Number(a), Number(b), Number(c)).join(',')})`,
        text,
      );
    }
    return text;
  }
  if (HEXRe.test(color) && chalk.hex) {
    return chalk.hex(color)(text);
  }
  if (color in chalk && typeof chalk[color as keyof ChalkInstance] === 'function') {
    return chalk[color](text);
  }
  if (color) {
    const rgb = ColorConvert.keyword.rgb(color);
    return chalk.rgb(...rgb)(text);
  }
  return text;
}
