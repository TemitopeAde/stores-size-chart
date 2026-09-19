/// <reference types="@wix/sdk-types/client" />
/// <reference path="../.astro/types.d.ts" />

// NOTE: This file should not be edited. This is an auto-generated file.
declare module 'node:test' {
  const test: (name: string, fn: () => void | Promise<void>) => void;
  export default test;
}

declare module 'node:assert' {
  const assert: {
    strictEqual: (actual: any, expected: any, message?: string) => void;
    ok: (value: any, message?: string) => void;
    deepStrictEqual: (actual: any, expected: any, message?: string) => void;
  };
  export default assert;
}
