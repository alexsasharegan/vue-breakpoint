// @ts-ignore
import Vue, { VueConstructor } from "vue";
import { MediaQueryFlatMap, FlattenMediaQueryMap } from "../../core/toMQS";
import { SubscribeToMediaQuery, Bootstrap4Grid } from "../../core/matchMedia";
import { VNode } from "vue/types/vnode";
import { CreateElement } from "vue/types/vue";

export const BreakpointComponent = Vue.extend({
	name: "breakpoint",

	props: {
		breakpointMap: {
			required: true,
			type: Object,
			default: Bootstrap4Grid,
		},
	},

	data(): {
		flatMap: MediaQueryFlatMap;
		active: string;
		unsubscribe: Array<() => void>;
		activeMap: { [alias: string]: boolean };
	} {
		return {
			flatMap: FlattenMediaQueryMap(this.breakpointMap),
			active: "",
			unsubscribe: [],
			activeMap: Object.keys(this.breakpointMap).reduce(
				(map: { [alias: string]: boolean }, alias: string) => {
					map[alias] = false;
					return map;
				},
				Object.create(null)
			),
		};
	},

	computed: {
		context(): { [alias: string]: boolean | string } {
			return Object.assign({ active: this.active }, this.activeMap);
		},
	},

	created() {
		for (let alias of Object.keys(this.flatMap)) {
			this.unsubscribe.push(
				SubscribeToMediaQuery(this.flatMap[alias], mql => {
					if (!mql.matches) {
						this.activeMap[alias] = false;
						return;
					}

					this.activeMap[alias] = true;
					this.active = alias;
				})
			);
		}
	},

	beforeDestroy() {
		let unsubscribe: () => void;
		for (unsubscribe of this.unsubscribe) {
			unsubscribe();
		}
	},

	render(createElement: CreateElement): VNode {
		// Reference context up front for reactivity.
		// Copy this so internals can't be affected.
		const ctx = Object.assign({}, this.context);
		// If the slot scope isn't used,
		// render default slot.
		if (!this.$scopedSlots.default) {
			return this.$slots.default[0];
		}

		const rendered = this.$scopedSlots.default(ctx);

		if (typeof rendered == "string") {
			return createElement("span", rendered);
		}

		if (Array.isArray(rendered) && Array.isArray(rendered[0])) {
			throw new TypeError(`Cannot render an array of children.`);
		}

		return rendered[0];
	},
});
