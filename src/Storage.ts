/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
import type { LocalStorage } from './LocalStorage.js';
import { platform } from './deps.js';

/**
 * Storage implementation that bridges environmental storage interfaces across Deno and Node.js.
 * Utilizes system environment variables (`Deno.env` or `process.env`) to store/retrieve key-value pairs.
 * Implements the {@link LocalStorage} interface.
 */
export class Storage implements LocalStorage {
  /**
   * Creates an instance of Storage.
   */
  constructor() {}

  /**
   * Retrieves an item from the environmental variables storage by key.
   *
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} The value of the item, or null if the key is not found.
   */
  getItem(key: string): string | null {
    if (platform === 'Deno' && 'Deno' in globalThis) {
      return globalThis.Deno.env.get(key) ?? null;
    }
    return process.env[key] ?? null;
  }

  /**
   * Removes an item from the environmental variables storage by key.
   *
   * @param {string} key - The key of the item to remove.
   * @returns {void}
   */
  removeItem(key: string): void {
    if (platform === 'Deno' && 'Deno' in globalThis) {
      globalThis.Deno.env.delete(key);
      return;
    }
    delete process.env[key];
  }

  /**
   * Sets or updates an item in the environmental variables storage.
   *
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value to store.
   * @returns {void}
   */
  setItem(key: string, value: string): void {
    if (platform === 'Deno' && 'Deno' in globalThis) {
      return globalThis.Deno.env.set(key, value);
    }
    process.env[key] = value;
  }
}
