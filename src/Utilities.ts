/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { inspect, type Chalk } from './platform.deno.ts';

const RGBRe = /(\w+)\((\d+),(\d+),(\d+)\)/i;
const HEXRe = /^#([A-F0-9]{3}|[A-F0-9]{6})$/i;
export type NativeLog =
  | typeof console.log
  | typeof console.error
  | typeof console.info
  | typeof console.warn;
export function sendLog(nativelog: NativeLog, isAllowed: boolean, ...args: Array<any>) {
  if (isAllowed) {
    if (args.length > 1) {
      let fargs: Array<any> = new Array();
      for (let arg of args) {
        if (typeof arg == 'object') {
          fargs.push(
            inspect(arg, {
              showHidden: true,
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
            showHidden: true,
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
export function formatColor(chalk: Chalk, color: string, text: string) {
  if (RGBRe.exec(color)) {
    const [input, format, a, b, c] = RGBRe.exec(color) as RegExpExecArray;
    if (format.toLocaleLowerCase() === 'rgb' && chalk.rgb) {
      return chalk.rgb(Number(a), Number(b), Number(c))(text);
    }
    if (format.toLocaleLowerCase() === 'hsl' && chalk.hsl) {
      return chalk.hsl(Number(a), Number(b), Number(c))(text);
    }
    if (format.toLocaleLowerCase() === 'hsv' && chalk.hsv) {
      return chalk.hsv(Number(a), Number(b), Number(c))(text);
    }
    if (format.toLocaleLowerCase() === 'hwb' && chalk.hwb) {
      return chalk.hwb(Number(a), Number(b), Number(c))(text);
    }
    return text;
  }
  if (HEXRe.test(color) && chalk.hex) {
    return chalk.hex(color)(text);
  }
  if (chalk[color]) {
    return chalk[color](text);
  }
  if (chalk.keyword) {
    return chalk.keyword(color)(text);
  }
  return text;
}
