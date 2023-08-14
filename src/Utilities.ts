/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { inspect } from './platform.deno.ts';

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
