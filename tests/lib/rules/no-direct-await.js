/**
 * @fileoverview Enforces usage of an await handler named async before every await
 * @author wes4m
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-direct-await"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  }
});
ruleTester.run("no-direct-await", rule, {
  valid: [`async function test() { await awaitable(foo()) }`],

  invalid: [
    {
      code: `async function test() { await foo() }`,
      errors: [{ messageId: "noDirectAwait" }],
      output: null
    },
    {
      code: `async function test() { await promise }`,
      errors: [{ messageId: "noDirectAwait" }],
      output: null
    },
    {
      code: `async function test() { await new Promise() }`,
      errors: [{ messageId: "noDirectAwait" }],
      output: null
    },
    {
      code: `async function awaitable() { throw new Error("error") }`,
      errors: [{ messageId: "noThrowingInAwaitHandler" }],
      output: `async function awaitable() {  }`
    },
  ],
});
