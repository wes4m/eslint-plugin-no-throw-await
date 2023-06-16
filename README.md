# eslint-plugin-no-throw-await

Forces explicit error handling for promises (Similar to golang) through disallowing unpredictable awaits

## Why?

`await` can't be trusted. and try-catching everything is 💩. Explicit error handling is the way. It doesn't clutter your code it makes it better. Take a look at the following code:
```typescript
async function foo() {
    await bar()
}
```
Is `bar` safe to await? does it throw an exception maybe? Just in case let's wrap it in a try-catch
```typescript
async function foo() {
    try {
        await bar()
    } catch (e) {
        /* whatever */
    }
}
```
Now assume you don't know what `foo` does. Or you don't want to read every async function line by line to check if it may throw an exception before using it. So what do you do? Also wrap `foo` in a try-catch just in case
```typescript
try { await foo() } catch (e) { }
```
When/how do you propgate an error to the caller? or do you silence everything throuh a try catch? What if you have a series of async functions. But you don't want one throw to stop everything. Do you just wrap every single one in a try-catch. Or worse, use `.catch` for a quick nesting hell trip. There are many other examples of how bad this trycatching can get, amongst other issues with throwing in an async func.

The goal of this plugin is to treat every promise as unsafe, which they are, and only allow awaiting a safe promise. A safe promise in this case means one that will not crash the application if left outside of a try-catch (will never throw). To to that, a linter rule will prevent you from awaiting a promise unless it's wrapped by an `awaitable` function.

## awaitable
Turns any unsafe promise into safe promise. One implementation (golang like error handling):
```typescript
/**
 * Guarantees that a promise throw will be handled and returned gracefully as an error if any
 * The returned promise will never throw an exception
 * Result and error type can be specified through awaitable<ResultType, ErrorType>
 * @param fn Promise
 * @returns Promise<[result, error]>
 * - `result`: Always returned, but internally it's null on fail (Infered type of `fn`)
 * Not checking for erros and directly using result will lead to major issues. Always check error.
 * - `error`: Null on success, returned on throw (Default to Error)
 */
/* See: https://github.com/wes4m/eslint-plugin-no-throw-await */
/* Modified version from karanpratapsingh */
export default async function awaitable<R, E = Error> (
  fn: Promise<R>
): Promise<[R, E | null]> {
  try {
    // eslint-disable-next-line no-throw-await/no-direct-await
    const data: R = await fn
    return [data, null]
  } catch (error: any) {
    return [null as R, error]
  }
}
```

## Example
```typescript
async function foo (): Promise<boolean> {
  throw new Error('Some error')
}

async function testing (): Promise<void> {
  const [result, err] = await awaitable(foo())
  if (err != null) {
    console.log(err.message)
    return
  }

  // Do stuff with result
  console.log(result)
}
```


## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-throw-await`:

```sh
npm install eslint-plugin-no-throw-await --save-dev
```

## Usage

Add `no-throw-await` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-throw-await"
    ]
}
```


Then configure the rule under the rules section.

```json
{
    "rules": {
        "no-throw-await/no-direct-await": "error"
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                             | Description                                        | 🔧 | 💡 |
| :----------------------------------------------- | :------------------------------------------------- | :- | :- |
| [no-direct-await](docs/rules/no-direct-await.md) | Enforces using an await handler before every await | 🔧 | 💡 |

<!-- end auto-generated rules list -->


