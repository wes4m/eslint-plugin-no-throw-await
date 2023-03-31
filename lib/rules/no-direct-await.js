/**
 * @fileoverview Enforces using an await handler before every await
 * @author wes4m
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const AWAITABLE_HANDLER_FUNC = "awaitable"

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforces using an await handler before every await",
      recommended: true,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [], // Add a schema if the rule has options
    messages: {
      noDirectAwait: `Using await directly is not allowed. Wrap it with a handler\ne.g: await ${AWAITABLE_HANDLER_FUNC}(foo())`,
      noThrowingInAwaitHandler: "Are you serious? Throwing in the await handler defeats the purpose."
    }
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      AwaitExpression(node) {
        var report = false
        if (node.argument.type == "CallExpression" && node.argument.callee.name != AWAITABLE_HANDLER_FUNC) {
          report = true
        } else if(node.argument.type == "Identifier") {
          report = true
        } else if (node.argument.type == "NewExpression") {
          report = true
        }

        if (report) {
          context.report({ node: node, messageId: 'noDirectAwait',
            suggest: [
              {
                // eslint-disable-next-line eslint-plugin/prefer-message-ids
                desc: `Wrap call in ${AWAITABLE_HANDLER_FUNC} handler`,
                fix: function(fixer) {
                  return [
                    fixer.insertTextBefore(node.argument, `${AWAITABLE_HANDLER_FUNC}(`),
                    fixer.insertTextAfter(node.argument, `)`)
                  ]
                }
              }
            ]
          })
        }
      },
      FunctionDeclaration(node) {
        if (node.id.name == AWAITABLE_HANDLER_FUNC) {
          node.body.body.forEach((n) => {
            if (n.type == "ThrowStatement") {
              context.report({ node: node, messageId: 'noThrowingInAwaitHandler',
                fix: function(fixer) {
                  return fixer.remove(n)
                }
              });
            }
          })
        }
      }
    };
  },
};
