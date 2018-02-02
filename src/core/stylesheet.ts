import { RandomAlphaNumeric } from "./random";

// Internal reference for a single stylesheet this plugin will manage.
let styleSheet: CSSStyleSheet;
export let id = RandomAlphaNumeric(16);

export type CSSRuleObject = { [rule: string]: string };

function createStyleSheet(): CSSStyleSheet {
	let style = document.createElement("style");
	// For good measure
	style.type = "text/css";
	style.id = id;
	// For recognition
	style.setAttribute("data-v-plugin", "vue-layout");
	// WebKit hack (still necessary?)
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);

	if (!(style.sheet instanceof CSSStyleSheet)) {
		throw new TypeError();
	}

	return style.sheet;
}

function getStyleSheet(): CSSStyleSheet {
	if (!styleSheet) {
		styleSheet = createStyleSheet();
	}

	return styleSheet;
}

type RemoveRuleFunc = () => void;

export function AddRule(selector: string, rules: string[]): RemoveRuleFunc {
	let ss = getStyleSheet();
	let idx = ss.rules.length;
	let rm = () => ss.removeRule(idx);

	if (!ss.addRule) {
		ss.insertRule(`${selector}{${normalizeRules(rules)}}`, idx);
		return rm;
	}

	ss.addRule(selector, normalizeRules(rules), idx);
	return rm;
}

function normalizeRules(rules: string[] | CSSRuleObject) {
	if (Array.isArray(rules)) {
		return rules.join(";") + ";";
	}

	let r = "";
	for (let k of Object.keys(rules)) {
		r += `${k}:${rules[k]};`;
	}

	return r;
}
