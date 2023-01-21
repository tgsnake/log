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
    return process.env[key] ?? null;
  }
  removeItem(key: string) {
    delete process.env[key];
  }
  setItem(key: string, value: string) {
    process.env[key] = value;
  }
}
