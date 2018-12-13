// @ts-ignore
import Vue, { VueConstructor } from "vue";
import { MediaQueryFlatMap, FlattenMediaQueryMap } from "../../core/toMQS";
import { SubscribeToMediaQuery, UnsubscribeFunc } from "../../core/matchMedia";
import { VNode } from "vue/types/vnode";
import { CreateElement } from "vue/types/vue";
import { Bootstrap4Grid } from "./mediaQueryMap";

export type ActiveMap = { [alias: string]: boolean };

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
    subscriptions: Array<() => void>;
    activeMap: ActiveMap;
  } {
    return {
      subscriptions: [],
      activeMap: Object.keys(this.breakpointMap).reduce(
        (map: ActiveMap, alias: string) => {
          map[alias] = false;
          return map;
        },
        {}
      ),
    };
  },

  watch: {
    flatMap() {
      this.unsubscribe();
      this.initMediaQueries();
    },
  },

  computed: {
    flatMap(): MediaQueryFlatMap {
      return FlattenMediaQueryMap(this.breakpointMap);
    },
    context(): ActiveMap {
      return Object.assign({}, this.activeMap);
    },
  },

  methods: {
    initMediaQueries(): void {
      for (let alias of Object.keys(this.flatMap)) {
        this.subscriptions.push(
          SubscribeToMediaQuery(this.flatMap[alias], mql => {
            if (!mql.matches) {
              this.activeMap[alias] = false;
              return;
            }

            this.activeMap[alias] = true;
          })
        );
      }
    },
    unsubscribe(): void {
      let fn: UnsubscribeFunc;
      for (fn of this.subscriptions) {
        fn();
      }
    },
  },

  created() {
    this.initMediaQueries();
  },

  beforeDestroy() {
    this.unsubscribe();
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
});
