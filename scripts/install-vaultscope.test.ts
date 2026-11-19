import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

function loadInstallerExports() {
  const installerPath = path.resolve(process.cwd(), 'install-vaultscope.js');
  const source = fs.readFileSync(installerPath, 'utf-8').replace(/^#![^\n]*\n/, '');
  const mod = { exports: {} as Record<string, any> };
  const requireFn = createRequire(installerPath);
  const wrapper = new vm.Script(
    `(function (exports, require, module, __filename, __dirname) {\n${source}\n})`,
  );
  const fn = wrapper.runInThisContext();
  fn(mod.exports, requireFn, mod, installerPath, path.dirname(installerPath));
  return mod.exports;
}

describe('install-vaultscope branch validation', () => {
  const { validateBranch } = loadInstallerExports();

  it('accepts valid branch and tag names', () => {
    expect(validateBranch('main')).toBe(true);
    expect(validateBranch('dev')).toBe(true);
    expect(validateBranch('release/v1.2.3')).toBe(true);
    expect(validateBranch('feature_security-fixes')).toBe(true);
  });

  it('rejects shell metacharacters, leading dashes, and traversal refs', () => {
    expect(validateBranch('')).toBe(false);
    expect(validateBranch('-u=evil')).toBe(false);
    expect(validateBranch('--upload-pack=evil')).toBe(false);
    expect(validateBranch('main; rm -rf /')).toBe(false);
    expect(validateBranch('dev && whoami')).toBe(false);
    expect(validateBranch('dev$(id)')).toBe(false);
    expect(validateBranch('dev`id`')).toBe(false);
    expect(validateBranch('../evil')).toBe(false);
    expect(validateBranch('branch.lock')).toBe(false);
    expect(validateBranch('foo//bar')).toBe(false);
  });
});
