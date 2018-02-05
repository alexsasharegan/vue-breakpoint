import { RandomAlphaNumeric } from "./random";

export type CSSRuleObject = { [rule: string]: string };
export type CSSRuleList = string[];
export type CSSRuleOption = CSSRuleObject | CSSRuleList;
export type CSSStyleMeta = {
  node: HTMLStyleElement;
  sheet: CSSStyleSheet;
  destroy(): void;
};

export interface StyleManager {
  /**
   * AddRule takes a CSS selector and an array of rules
   * or an object of rules such that `{ [property]: value }`.
   */
  AddRule(selector: string, rules: CSSRuleOption): StyleManager;
  /**
   * GetNode returns the underlying dom style element.
   */
  GetNode(): HTMLStyleElement;
  /**
   * GetSheet returns the underlying dom stylesheet.
   */
  GetSheet(): CSSStyleSheet;
  /**
   * Destroy the underlying stylesheet and dom node.
   */
  Destroy(): void;
}

export function NewStyleManager(): StyleManager {
  let { node, sheet, destroy } = CreateStyleSheet();

  const manager = {
    AddRule(selector: string, rules: CSSRuleOption) {
      AddRule(sheet, selector, rules);
      return manager;
    },
    GetNode: () => node,
    GetSheet: () => sheet,
    Destroy: destroy,
  };

  return manager;
}

export function CreateStyleSheet(): CSSStyleMeta {
  let style = document.createElement("style");
  // For good measure
  style.type = "text/css";
  style.id = RandomAlphaNumeric(16);
  // For recognition
  style.setAttribute("data-v-plugin", "vue-layout");
  // WebKit hack (still necessary?)
  style.appendChild(document.createTextNode(""));
  document.head.appendChild(style);

  if (!(style.sheet instanceof CSSStyleSheet)) {
    throw new TypeError();
  }

  return {
    node: style,
    sheet: style.sheet,
    destroy: () => document.head.removeChild(style),
  };
}

export function AddRule(
  styleSheet: CSSStyleSheet,
  selector: string,
  rules: CSSRuleOption
): number {
  let idx = styleSheet.rules.length;

  if (!styleSheet.addRule) {
    styleSheet.insertRule(`${selector}{${normalizeRules(rules)}}`, idx);
    return idx;
  }

  styleSheet.addRule(selector, normalizeRules(rules), idx);
  return idx;
}

function normalizeRules(rules: CSSRuleOption) {
  if (Array.isArray(rules)) {
    return rules.join(";") + ";";
  }

  let r = "";
  for (let k of Object.keys(rules)) {
    r += `${k}:${rules[k]};`;
  }

  return r;
}
