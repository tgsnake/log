/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { Storage } from './Storage.deno.ts';

export interface LocalStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export function getLS(): LocalStorage {
  // @ts-ignore
  if (!('Deno' in globalThis) && typeof window !== 'undefined') {
    // @ts-ignore
    return localStorage;
  }
  return new Storage();
}
