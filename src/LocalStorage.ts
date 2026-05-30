/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
import { Storage } from './Storage.js';

/**
 * Defines the contract for local storage mechanisms used by tgsnake.
 * Provides key-value store access, compatible with both browser `localStorage` and platform environments (Node/Deno).
 */
export interface LocalStorage {
  /**
   * Retrieves the value of the entry associated with the given key.
   *
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} The value of the item if found, otherwise `null`.
   */
  getItem(key: string): string | null;

  /**
   * Removes the key-value entry associated with the given key.
   *
   * @param {string} key - The key of the item to remove.
   * @returns {void}
   */
  removeItem(key: string): void;

  /**
   * Sets or updates the key-value entry with the given key and value.
   *
   * @param {string} key - The key of the item to store.
   * @param {string} value - The value to store.
   * @returns {void}
   */
  setItem(key: string, value: string): void;
}

/**
 * Helper function to retrieve the appropriate {@link LocalStorage} implementation based on the current platform environment.
 * If running in a browser context, it returns the standard browser `localStorage`.
 * Otherwise (Node.js, Deno, Bun), it returns an instance of the custom environmental {@link Storage} class.
 *
 * @returns {LocalStorage} The resolved LocalStorage instance for the current environment.
 */
export function getLS(): LocalStorage {
  if (!('Deno' in globalThis) && typeof window !== 'undefined') {
    return localStorage;
  }
  return new Storage();
}
