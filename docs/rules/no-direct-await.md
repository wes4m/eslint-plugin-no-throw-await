# Enforces using an await handler before every await (`no-throw-await/no-direct-await`)

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

The goal of this rule is to provide a way of error handling that is similar to golang. [Why?](../../README.md#Why) 

## Rule Details

This rule aims to enforces using of an await handler before every await

Examples of **incorrect** code for this rule:

```js
// 1
await someAsyncFunc()
// 2
const aPromise = new Promise()
await aPromise
// 3
await new Promise()
```

Examples of **correct** code for this rule:

```js
// 1
await awaitable(someAsyncFunc())
// 2
const aPromise = new Promise()
await awaitable(aPromise)
// 3
await awaitable(new Promise())
```
