import Vue, { VueConstructor } from "vue";
import { NewStyleManager } from "../core/stylesheet";

export const name = "vl-breakpoint";

export const BreakpointComponent = Vue.extend({
	name,
	props: {
		breakpointMap: {
			type: Object,
			default: () => ({}),
		},
		styleLookup: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			manager: NewStyleManager(),
		};
	},
	beforeCreate() {
		this.writeStyles();
	},
	destroyed() {
		if (this.manager) {
			this.manager.Destroy();
		}
	},
	methods: {
		writeStyles() {
			// AddRule(this.styleInternals.sheet);
		},
	},
	render(createElement) {
		if (this.$slots.default.length > 1) {
			console.warn(`This component`);
		}

		return this.$slots.default[0];
	},
});
