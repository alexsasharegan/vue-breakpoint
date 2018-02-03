const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const diffToLC = "a".charCodeAt(0) - A;
const isUpperCase: (charCode: number) => boolean = c => c >= A && c <= Z;
const toLC: (charCode: number) => string = c =>
	String.fromCharCode(c + diffToLC);

/**
 * isVendorPrefix returns true if the given string
 * begins with "webkit", "moz", or "ms".
 * It cannot detect Opera prefixes due to other
 * css declarations beginning with "o". All other prefixes
 * are unique enough to perform a simple check.
 */
const isVendorPrefix: (cssDecl: string) => boolean = s =>
	s.indexOf("webkit") == 0 || s.indexOf("moz") == 0 || s.indexOf("ms") == 0;

/**
 * CamelToKebab transforms ascii alpha chars
 * in camelcase to lowercase kebab casing.
 */
export function CamelToKebab(str: string) {
	let xform = "";
	let len = str.length;
	let code = 0;

	if (isVendorPrefix(str)) {
		xform += "-";
	}

	for (let i = 0; i < len; i++) {
		code = str.charCodeAt(i);
		if (isUpperCase(code)) {
			xform += "-" + toLC(code);
			continue;
		}

		xform += str[i];
	}

	return xform;
}
