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
export { inspect } from 'util';
export { type Chalk, Instance as ChalkInstance };
export const isBrowser = typeof window !== 'undefined';
