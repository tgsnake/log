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
 * @module tgsnake/log
 * Primary entrypoint for the tgsnake logging utility.
 * Exports the core {@link Logger} class along with type definitions for configuration and customization.
 */

export { Logger } from './Logger.js';
export type { TypeLogLevel, TypeWarningLevel, LoggerOptions, LoggerColor } from './Logger.js';
