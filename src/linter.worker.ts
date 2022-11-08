/* eslint-disable no-restricted-globals */
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import { Linter } from "eslint/lib/linter/linter.js";

// eslint语法检查,使用webworker

const linter = new Linter();

const rules = linter.getRules();

const rule = {
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
    ecmaFeatures: {},
  },
  rules: {
    "constructor-super": ["error"],
    "for-direction": ["error"],
    "getter-return": ["error"],
    "no-async-promise-executor": ["error"],
    "no-case-declarations": ["error"],
    "no-class-assign": ["error"],
    "no-compare-neg-zero": ["error"],
    "no-cond-assign": ["error"],
    "no-const-assign": ["error"],
    "no-constant-condition": ["error"],
    "no-control-regex": ["error"],
    "no-debugger": ["error"],
    "no-delete-var": ["error"],
    "no-dupe-args": ["error"],
    "no-dupe-class-members": ["error"],
    "no-dupe-else-if": ["error"],
    "no-dupe-keys": ["error"],
    "no-duplicate-case": ["error"],
    "no-empty": ["error"],
    "no-empty-character-class": ["error"],
    "no-empty-pattern": ["error"],
    "no-ex-assign": ["error"],
    "no-extra-boolean-cast": ["error"],
    "no-extra-semi": ["error"],
    "no-fallthrough": ["error"],
    "no-func-assign": ["error"],
    "no-global-assign": ["error"],
    "no-import-assign": ["error"],
    "no-inner-declarations": ["error"],
    "no-invalid-regexp": ["error"],
    "no-irregular-whitespace": ["error"],
    "no-loss-of-precision": ["error"],
    "no-misleading-character-class": ["error"],
    "no-mixed-spaces-and-tabs": ["error"],
    "no-new-symbol": ["error"],
    "no-nonoctal-decimal-escape": ["error"],
    "no-obj-calls": ["error"],
    "no-octal": ["error"],
    "no-prototype-builtins": ["error"],
    "no-redeclare": ["error"],
    "no-regex-spaces": ["error"],
    "no-self-assign": ["error"],
    "no-setter-return": ["error"],
    "no-shadow-restricted-names": ["error"],
    "no-sparse-arrays": ["error"],
    "no-this-before-super": ["error"],
    "no-undef": ["error"],
    "no-unexpected-multiline": ["error"],
    "no-unreachable": ["error"],
    "no-unsafe-finally": ["error"],
    "no-unsafe-negation": ["error"],
    "no-unsafe-optional-chaining": ["error"],
    "no-unused-labels": ["error"],
    "no-unused-vars": ["error"],
    "no-useless-backreference": ["error"],
    "no-useless-catch": ["error"],
    "no-useless-escape": ["error"],
    "no-with": ["error"],
    "require-yield": ["error"],
    "use-isnan": ["error"],
    "valid-typeof": ["error"],
  },
  env: {
    es6: true,
    browser: true,
    greasemonkey: true,
  },
};

const severityMap = {
  2: 8, // 2 for ESLint is error
  1: 4, // 1 for ESLint is warning
};

self.addEventListener("message", (event) => {
  const { code, id } = event.data;
  const errs = linter.verify(code, rule);
  const markers = errs.map((err: any) => ({
    code: {
      value: err.ruleId,
      target: rules.get(err.ruleId).meta.docs.url,
    },
    startLineNumber: err.line,
    endLineNumber: err.endLine,
    startColumn: err.column,
    endColumn: err.endColumn,
    message: err.message,
    // 设置错误的等级，此处ESLint与monaco的存在差异，做一层映射
    // @ts-ignore
    severity: severityMap[err.severity],
    source: "ESLint",
  }));
  // 发回主进程
  self.postMessage({ markers, id });
});
