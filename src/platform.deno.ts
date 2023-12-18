/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

import { Chalk } from 'https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
export const { inspect, cwd } = Deno;
export { type Chalk, Chalk as ChalkInstance, path, fs };
export function onEndProcess(cb: { (e?: any): any }) {
  globalThis.addEventListener('beforeunload', cb);
  globalThis.addEventListener('unhandledrejection', cb);
}
export const isBrowser = !('Deno' in globalThis);
