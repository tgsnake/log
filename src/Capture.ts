/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

export class Capture {
  private _captures: Array<string> = [];
  constructor() {}
  push(...args: Array<any>) {
    this._captures.push(...args);
  }
  remove(index: number, length: number) {
    this._captures.splice(index, length);
  }
  clear() {
    this._captures = [];
  }
  get captures() {
    return this._captures;
  }
  get length() {
    return this._captures.length;
  }
}
