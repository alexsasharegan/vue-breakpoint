# Vue-Breakpoint

[![npm](https://img.shields.io/npm/v/vue-breakpoint.svg?style=for-the-badge)](https://img.shields.io/npm/v/vue-breakpoint)
[![npm downloads](https://img.shields.io/npm/dt/vue-breakpoint.svg?style=for-the-badge)](https://www.npmjs.com/package/vue-breakpoint)
[![GitHub issues](https://img.shields.io/github/issues/alexsasharegan/vue-breakpoint.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-breakpoint/issues)
[![GitHub stars](https://img.shields.io/github/stars/alexsasharegan/vue-breakpoint.svg?style=for-the-badge)](https://github.com/alexsasharegan/vue-breakpoint/stargazers)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=for-the-badge)](https://conventionalcommits.org)

A vue layout component to provide dynamic, reactive media query information.
Uses the
[match media api](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

Heavily inspired from
[Full Stack Radio episode #81](http://www.fullstackradio.com/81) and the
[vue-mq library](https://github.com/AlexandreBonaventure/vue-mq).

## Install

```sh
npm i vue-breakpoint
```

Currently two bundles are provided:

* a basic global variable export for quick use in the browser
  * `vue-breakpoint/dist/index.js` exposes `window.VueBreakpoint`
* an ES2015 module for use with any build system
  * `vue-breakpoint/dist/index.esm.js`

These are appropriately marked in the `package.json` manifest under `main` and
`module` respectively. TypeScript typings are also provided via the `types`
entry.

## Exports

The package exports two items: a component and a plugin (`BreakpointComponent`,
`BreakpointPlugin`). These two offer distinct use cases.

### BreakpointPlugin

`BreakpointPlugin` registers the component `<breakpoint />` globally, but uses a
single media query manager internally. This makes extensive usage throughout
your app efficient.

To install the plugin, provide an optional media query map. A default is
provided that queries screen width according to the Bootstrap 4 breakpoints and
aliases (`xs`, `sm`, `md`, `lg`, `xl`), but here's an example:

```js
// ES Module
import { BreakpointPlugin } from "vue-breakpoint";
// Window global
const { BreakpointPlugin } = window.VueBreakpoint;

Vue.use(BreakpointPlugin, {
	print: { print: true },
	portrait: { orientation: "portrait" },
	mobile: { maxWidth: "600px" },
	mobilePortrait: { maxWidth: "600px", orientation: "portrait" },
	tablet: { minWidth: "601px", maxWidth: "800px" },
	desktop: { minWidth: "801px" },
});
```

For a better look at the possibilities of the media queries, have a look at the
query builder's [test suite](./src/core/toMQS.test.ts)

### BreakpointComponent

`BreakpointComponent` is a Vue component that accepts the breakpoint/media-query
map as a prop. This means that each component instance manages it's own media
queries, and can have isolated control to provide one-off responsive queries. It
also means that if the breakpoint map gets updated, the component will remove
all the old listeners and re-register it's media queries. This allows for
dynamically responsive layouts—dynamic to whatever you want!

To use the discrete component, add it to your consuming component's `components`
object.

```js
// ES Module
import { BreakpointComponent } from "vue-breakpoint";
// Window global
const { BreakpointComponent } = window.VueBreakpoint;

const MyParentComponent = Vue.extend({
	components: {
		"my-breakpoint": BreakpointComponent,
	},
});
```

## Usage

Start off by determining your own set of media queries/breakpoints, or use the
built-in bootstrap 4 style map. You can find it's definition
[here in the source](./src/components/breakpoint/mediaQueryMap.ts).

Once you have the breakpoints decided and the installation taken care of, wrap
some of your layout in a `<breakpoint>` component _(wrap an element/component
with a single root node)_ and define the `slot-scope` attribute. The value of
`slot-scope` is the parameter name for the object that will hold all the
breakpoint values. For example:

```html
<breakpoint>
	<!-- `media` now holds our breakpoint values -->
	<main slot-scope="media">
		<h1>Hello world!</h1>
		<!-- The breakpoint values are booleans -->
		<!-- for whether or not their condition is met. -->
		<!-- Remember, these are based on the query map keys provided. -->
		<p v-if="media.lgUp">I'm on a large screen!</p>
		<p v-if="media.mdOnly">I'm in-between...</p>
		<p v-if="media.smDown">I'm on a small screen!</p>
	</main>
</breakpoint>
```

Since the `slot-scope` is an object, it can also be destructured to pull out the
relevant values more easily.

```html
<breakpoint>
	<main slot-scope="{ lgUp, smDown }">
		<my-navbar v-if="media.mdUp" />
		<my-mobile-navbar v-if="media.smDown" />
		<section :class="['content', {'font-size-mobile': media.smDown}">
			<h1>Hello world!</h1>
			<p v-if="lgUp">I'm on a large screen!</p>
			<p v-if="smDown">I'm on a small screen!</p>
		</section>
	</main>
</breakpoint>
```

When you need custom, one-off breakpoint logic, use the discrete component.

```html
<!-- Main grid setup -->
<breakpoint>
	<main slot-scope="media">
		<my-navbar v-if="media.mdUp" />
		<my-mobile-navbar v-if="media.smDown" />
		<router-view />
		<!-- Unique media queries -->
		<custom-breakpoint breakpoint-map="breakpointMap">
			<p slot-scope="{ mobileLandscape }" v-if="mobileLandscape">
				For best viewing, we recommend portrait orientation.
			</p>
		</custom-breakpoint>
	</main>
</breakpoint>

<script>
/* Regist the component and setup the query map. */
new Vue({
	components: {
		"custom-breakpoint": VueBreakpoint.BreakpointComponent
	},
	data: {
		breakpointMap: {
			mobileLandscape: { screen: true, orientation: 'landscape' }
		}
	}
})
</script>
```

For more info, consult the Vue documentation on
[scoped slots.](https://vuejs.org/v2/guide/components.html#Scoped-Slots)

## Try It Out

Hack on this fiddle:
[vue-breakpoint jsfiddle](https://jsfiddle.net/alexsasharegan/wbrnvwca/)
