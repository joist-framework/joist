# Joist

Web components are awesome! Joist is a set of small libraries designed to add the bare minimum to web components to make you as productive as possible. The entire project started years ago when I made my first attempt at bringing dependency injection (@joist/di) to Custom Elements as a way to share state between them. Along the way several other packges were added to solve different challenges.

When you have to integrate with many different applications, many different frameworks with many different technologies you need a toolkit to help.
From SalesForce to ServiceNow to React you need to write JavaScript/TypeScript and you need tools to help.

This toolkit is here to help provide just the functionality you need and nothing more. Use with Lit, FAST, Vanilla WC, Node, wherever you find yourself.

### Packages

| Package                                  | Description                                                           |
| ---------------------------------------- | --------------------------------------------------------------------- |
| [@joist/di](packages/di)                 | IOC container. Share state between elements                           |
| [@joist/observable](packages/observable) | Observe changes to class properties and HTML attributes               |
| [@joist/query](packages/query)           | query custom elements and assign to property.                         |
| [@joist/styled](packages/styled)         | Apply styles to shadow dom. (Constructable stylesheets with fallback) |

[Try it out with Vite and Stackblitz!](https://stackblitz.com/edit/joist-starter-app-vite)
