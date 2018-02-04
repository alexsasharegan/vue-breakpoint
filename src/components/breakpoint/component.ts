// @ts-ignore
import Vue, { VueConstructor } from "vue";
import {
	MediaQueryMap,
	MediaQueryFlatMap,
	FlattenMediaQueryMap,
} from "../../core/toMQS";
import { SubscribeToMediaQuery } from "../../core/matchMedia";
import { VNode } from "vue/types/vnode";
import { CreateElement } from "vue/types/vue";

export const Bootstrap4Grid: () => MediaQueryMap = () => ({
	xs: { minWidth: "0px" },
	sm: { minWidth: "576px" },
	md: { minWidth: "768px" },
	lg: { minWidth: "992px" },
	xl: { minWidth: "1200px" },
});

export const BreakpointComponent = Vue.extend({
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
		context(): { [alias: string]: boolean } {
			return Object.assign(Object.create(null), this.activeMap);
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
		if (!this.$scopedSlots.default) {
			return this.$slots.default[0];
		}

		let rendered = this.$scopedSlots.default(
			Object.assign({ breakpoint: this.active }, this.context)
		);

		if (typeof rendered == "string") {
			return createElement("span", rendered);
		}

		if (Array.isArray(rendered) && Array.isArray(rendered[0])) {
			throw new TypeError(`Cannot render an array of children.`);
		}

		return rendered[0];
	},
});
