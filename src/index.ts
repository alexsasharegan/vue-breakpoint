import { BreakpointComponent } from "./components/breakpoint/component";
import { PluginObject } from "vue";

export { BreakpointComponent };

export const VueLayoutPlugin: PluginObject<{}> = {
	install(V, options) {
		V.component("BreakpointComponent", BreakpointComponent);
	},
	name: "vue-layout",
};
