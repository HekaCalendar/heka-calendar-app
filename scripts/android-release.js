#!/usr/bin/env node
/**
 * Cross-platform Android release build helper.
 * Usage: node scripts/android-release.js [assembleRelease|bundleRelease|assembleDebug]
 * Default: assembleRelease
 */

import { spawnSync } from 'child_process';
import { platform } from 'os';
import { resolve } from 'path';

const task = process.argv[2] || 'assembleRelease';
const isDebug = task.toLowerCase().includes('debug');

function run(cmd, args, cwd) {
  console.log(`> ${cmd} ${args.join(' ')}${cwd ? ` (in ${cwd})` : ''}`);
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: platform() === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

// 1. Build the web app
run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build']);

// 2. Sync/copy to Android
run('npx', [isDebug ? 'cap' : 'cap', 'sync', 'android']);

// 3. Run Gradle task
const gradle = platform() === 'win32' ? 'gradlew.bat' : './gradlew';
run(gradle, [task], resolve(process.cwd(), 'android'));
