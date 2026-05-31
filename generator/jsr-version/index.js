/**
 * tgsnake - Telegram MTProto library for javascript or typescript.
 * Copyright (C) 2026 tgsnake <https://github.com/tgsnake>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the GPL v3 License as published.
 */
import fs from 'fs';
import path from 'path';

function start(route) {
  const jsr = JSON.parse(fs.readFileSync(path.join(route, 'jsr.json'), 'utf8'));
  const package = JSON.parse(fs.readFileSync(path.join(route, 'package.json'), 'utf8'));
  if (jsr.version !== package.version) {
    jsr.version = package.version;
    fs.writeFileSync(path.join(route, 'jsr.json'), JSON.stringify(jsr, null, 2));
  }
}
console.log(
  "--- WARNING!! ---\n\nTHIS ACTION WILL BE CHANGE JSR VERSION.\nTHIS ACTION CAN'T BE CANCELLED!\n\n--- build:jsr ---",
);
start(process.cwd());
