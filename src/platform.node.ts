/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { type Chalk, Instance } from 'chalk';
import * as path from 'node:path';
import * as fs from 'node:fs';
export { inspect } from 'util';
export { type Chalk, Instance as ChalkInstance, path, fs };
export function onEndProcess(cb: { (e?: any): any }) {
  process.on('beforeExit', cb);
  process.on('exit', cb);
  process.on('unhandledRejection', cb);
}
export const { cwd } = process;
export const isBrowser = typeof window !== 'undefined';
