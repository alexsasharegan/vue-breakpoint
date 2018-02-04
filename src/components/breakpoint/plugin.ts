import { PluginObject, CreateElement, VNode } from "vue";
import { MediaQueryMap, FlattenMediaQueryMap } from "../../core/toMQS";
import { SubscribeToMediaQuery, Bootstrap4Grid } from "../../core/matchMedia";

export const BreakpointPlugin: PluginObject<MediaQueryMap> = {
	install(Vue, mqm = Bootstrap4Grid()) {
		type ActiveMap = { [alias: string]: boolean };
		const flatMap = FlattenMediaQueryMap(mqm);

		const Rx = new Vue({
			data: {
				active: "",
				...Object.keys(flatMap).reduce((map: ActiveMap, alias: string) => {
					map[alias] = false;
					return map;
				}, {}),
			},
		});

		for (let alias of Object.keys(flatMap)) {
			SubscribeToMediaQuery(flatMap[alias], mql => {
				if (!mql.matches) {
					Rx.$data[alias] = false;
					return;
				}

				Rx.$data[alias] = true;
				Rx.$data.active = alias;
			});
		}

		Vue.component(
			"breakpoint",
			Vue.extend({
				computed: {
					context(): { [alias: string]: string | boolean } {
						return Rx.$data;
					},
				},

				render(createElement: CreateElement): VNode {
					// Reference context up front for reactivity.
					// Copy this so internals can't be affected.
					const ctx = { ...this.context };

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
			})
		);
	},
};
