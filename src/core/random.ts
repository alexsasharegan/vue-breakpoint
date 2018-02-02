function makeRandomGenerator(chars: string) {
	let charLen = chars.length;

	return (len: number, prefix: string = "", suffix: string = "") => {
		for (let i = 0; i < len; i++) {
			prefix += chars[Math.floor(Math.random() * charLen)];
		}

		return prefix + suffix;
	};
}

const lcStart = "a".charCodeAt(0);
const lowercase = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(lcStart + i)
);

const ucStart = "A".charCodeAt(0);
const uppercase = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(ucStart + i)
);

const zero = "0".charCodeAt(0);
const numeric = Array.from({ length: 10 }, (_, i) =>
	String.fromCharCode(zero + i)
);

export const RandomLCAlpha = makeRandomGenerator(lowercase.join(""));
export const RandomUCAlpha = makeRandomGenerator(uppercase.join(""));
export const RandomAlpha = makeRandomGenerator(
	lowercase.join("") + uppercase.join("")
);
export const RandomLCAlphaNumeric = makeRandomGenerator(
	lowercase.join("") + numeric.join("")
);
export const RandomUCAlphaNumeric = makeRandomGenerator(
	uppercase.join("") + numeric.join("")
);
export const RandomAlphaNumeric = makeRandomGenerator(
	lowercase.join("") + numeric.join("") + uppercase.join("")
);
export const RandomHex = (
	len: number,
	prefix: string = "",
	suffix: string = ""
) => {
	for (let i = 0; i < len; i++) {
		prefix += Math.floor(Math.random() * 16).toString(16);
	}

	return prefix + suffix;
};
