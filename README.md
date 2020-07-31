[![Actions Status](https://github.com/deebloo/joist/workflows/CI/badge.svg)](https://github.com/deebloo/joist/actions)

<img height="250" src="images/logo.png" data-canonical-src="images/logo.png" />

A small (~2kb) library to help with the creation of web components and web component based applications. Support for [lit-html](https://lit-html.polymer-project.org/) is baked in but can work with whatever view library you like. [See it in action.](https://webcomponents.dev/edit/ZwmxGJSHldWQH5T7j8fH)

## Getting Started

### [webcomponents.dev](https://webcomponents.dev/new/)
The easiest way get started with Joist is to go to use the Joist starter on [webcomponents.dev](https://webcomponents.dev/create/joist).
There you can play around with Joist (and other frameworks) with 0 setup required. (You can even test and publish!)

### [starter-app-snowpack](https://github.com/joist-framework/starter-app-snowpack)
If you want to build an application or just run everything yourself you can use the [rollup starter snowpack](https://github.com/joist-framework/starter-app-snowpack). This starter uses snowpack for dev and rollup for creating your production bundle.

### [starter-app-rollup](https://github.com/joist-framework/starter-app-rollup)
If you want to build an application or just run everything yourself you can use the [rollup starter app](https://github.com/joist-framework/starter-app-rollup).

### [starter-app-webpack](https://github.com/joist-framework/starter-app-webpack)
If you want to build an application or just run everything yourself you can use the [webpack starter app](https://github.com/joist-framework/starter-app-webpack).

### Packages

| Package                                | Description           |
| -------------------------------------- | --------------------- |
| [@joist/component](packages/component) | Create Web Components |
| [@joist/di](packages/di)               | IOC container         |
| [@joist/router](packages/router)       | simple router         |

### Integration

| Project                                                  | Description                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| [hello-world](integration/hello-world)                   | Hello World no view lib                                           |
| [hello-world-js](integration/hello-world-js)             | Hello World vanilla js                                            |
| [hello-world-lit-html](integration/hello-world-lit-html) | Hello World lit-html                                              |
| [todo-app](integration/todo-app)                         | Todo app                                                          |
| [hacker-news](integration/hacker-news)                   | Hacker news PWA                                                   |
| [resistor-value](integration/resistor-value)             | PWA for calculating the value of resistors from their color bands |
| [router-test](integration/router-test)                   | small routing example                                             |
