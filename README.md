[![Actions Status](https://github.com/deebloo/joist/workflows/CI/badge.svg)](https://github.com/deebloo/joist/actions)

<img height="250" src="images/logo.png" data-canonical-src="images/logo.png" />

### [Read introduction here](https://dev.to/deebloo/introducing-joist-4724)

A small (~2kb or ~5kb with lit-html) library to help with the creation of web components and web component based applications. Support for [lit-html](https://lit-html.polymer-project.org/) is baked in but can work with whatever view library you like. [See it in action](https://webcomponents.dev/edit/ZwmxGJSHldWQH5T7j8fH).

## Getting Started

### [webcomponents.dev](https://webcomponents.dev/new/)

The easiest way get started with Joist is to go to use the Joist starter on [webcomponents.dev](https://webcomponents.dev/create/joist).
There you can play around with Joist (and other frameworks) with 0 setup required. (You can even test and publish!)

### [starter-app-snowpack](https://github.com/joist-framework/starter-app-snowpack)

If you want to build an application or just run everything yourself you can use the [snowpack starter app](https://github.com/joist-framework/starter-app-snowpack). This starter uses snowpack for dev and rollup for creating your production bundle.

```BASH
npx create-snowpack-app my-app --template @joist/starter-snowpack
```

Joist also publishes a canary version. If you use canary expect bugs.

```
npm i @joist/{component,di,router}@canary
```

### Packages

| Package                                | Description           |
| -------------------------------------- | --------------------- |
| [@joist/component](packages/component) | Create Web Components |
| [@joist/di](packages/di)               | IOC container         |
| [@joist/router](packages/router)       | simple router         |

### Integration

| Project                                                  | Description                                       |
| -------------------------------------------------------- | ------------------------------------------------- |
| [hello-world](integration/hello-world)                   | Hello World no view lib                           |
| [hello-world-lit-html](integration/hello-world-lit-html) | Hello World lit-html                              |
| [todo-app](integration/todo-app)                         | Todo app                                          |
| [hacker-news](integration/hacker-news)                   | Hacker news PWA. [Link](https://joist-hn.web.app) |

### Browser Support

Joist targets evergreen browsers.


<div style="display: flex">
  <img width="56" src="images/chrome_128x128.png">
  <img width="56" src="images/edge_128x128.png">
  <img width="56" src="images/firefox_128x128.png">
  <img width="56" src="images/opera_128x128.png">
  <img width="56" src="images/safari_128x128.png">
</div>

### Development

#### Install Dependencies

```BASH
npm i
```

#### Run Tests

This repo uses [@open-wc/testing](https://open-wc.org/testing/testing.html) as the testing library and [@web/test-runner](https://github.com/modernweb-dev/web/tree/master/packages/test-runner) as the, well, test runner.

```BASH
npm run test-libs
```

```BASH
npm run test-integration
```

```BASH
npm run test-all
```

```BASH
npx lerna run test --scope @joist/{package-name}
```
