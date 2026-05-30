/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
/**
 * This file is responsible for providing the necessary dependencies for the tgsnake library in browser environments.
 * It imports and exports various modules and libraries that are used throughout the codebase,
 * ensuring compatibility in the browser. By centralizing these imports and exports, we can maintain
 * a clean and organized codebase while also making it easier to manage dependencies and ensure that
 * the library works seamlessly.
 */
import { inspect as nodeInspect } from 'util';
export { Chalk } from 'chalk';
export { default as ColorConvert } from 'color-convert';

// Other platform compatibility
// After this line, we will provide some compatibility for Deno, Bun, and Browser so that the same code can run in both environments without modification.

/**
 * Identifies the runtime platform environment. Always 'Browser' for this module.
 * @type {string}
 */
export const platform = 'Browser';

/**
 * Platform compatibility for browser inspection of objects.
 * Wraps or maps to `inspect` functionality.
 *
 * @type {typeof nodeInspect}
 */
export const inspect: typeof nodeInspect = nodeInspect; // Browser compatibility, use Node's util.inspect as a fallback for browsers that support it, otherwise use a simple implementation
