/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

export interface LocalStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}
export class EnvStorage implements LocalStorage {
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
export function getLS(): LocalStorage {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    return localStorage;
  }
  return new EnvStorage();
}
