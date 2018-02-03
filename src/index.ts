import {
	BreakpointComponent,
	name as BreakpointName,
} from "./components/breakpoint";
import { PluginObject } from "vue";

export { BreakpointComponent };

export const VueLayoutPlugin: PluginObject<{}> = {
	install(V, options) {
		V.component(BreakpointName, BreakpointComponent);
	},
	name: "vue-layout",
};
