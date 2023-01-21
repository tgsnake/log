/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

import type { LocalStorage } from './LocalStorage.ts';
export class Storage implements LocalStorage {
  constructor() {}
  getItem(key: string) {
    return Deno.env.get(key) ?? null;
  }
  removeItem(key: string) {
    Deno.env.delete(key);
  }
  setItem(key: string, value: string) {
    Deno.env.set(key, value);
  }
}
