import { PluginObject, CreateElement, VNode } from "vue";
import { MediaQueryMap, FlattenMediaQueryMap } from "../../core/toMQS";
import { SubscribeToMediaQuery } from "../../core/matchMedia";
import { Bootstrap4Grid } from "./mediaQueryMap";

export const BreakpointPlugin: PluginObject<MediaQueryMap> = {
  name: "BreakpointPlugin",
  install(Vue, mqm = Bootstrap4Grid()) {
    type ActiveMap = { [alias: string]: boolean };
    const flatMap = FlattenMediaQueryMap(mqm);

    const Rx = new Vue({
      data: Object.keys(flatMap).reduce((map: ActiveMap, alias: string) => {
        map[alias] = false;
        return map;
      }, {}),
    });

    for (let alias of Object.keys(flatMap)) {
      SubscribeToMediaQuery(flatMap[alias], mql => {
        if (!mql.matches) {
          Rx.$data[alias] = false;
          return;
        }

        Rx.$data[alias] = true;
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
          const ctx = Object.assign({}, this.context);

          // If the slot scope isn't used,
          // render default slot.
          if (!this.$scopedSlots.default) {
            // Wrap multiple elements in root div.
            if ((this.$slots.default || []).length > 1) {
              return createElement("div", this.$slots.default);
            }

            return (this.$slots.default || [])[0];
          }

          const scoped: VNode = this.$scopedSlots.default(ctx) as any;

          if (this.$slots.default) {
            return createElement("div", [...this.$slots.default, scoped]);
          }

          return scoped;
        },
      })
    );
  },
};
