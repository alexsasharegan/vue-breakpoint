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
export const LCCharCodes = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(lcStart + i)
);

const ucStart = "A".charCodeAt(0);
export const UCCharCodes = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(ucStart + i)
);

const zero = "0".charCodeAt(0);
export const NumCharCodes = Array.from({ length: 10 }, (_, i) =>
	String.fromCharCode(zero + i)
);

export const RandomLCAlpha = makeRandomGenerator(LCCharCodes.join(""));
export const RandomUCAlpha = makeRandomGenerator(UCCharCodes.join(""));
export const RandomAlpha = makeRandomGenerator(
	LCCharCodes.join("") + UCCharCodes.join("")
);
export const RandomLCAlphaNumeric = makeRandomGenerator(
	LCCharCodes.join("") + NumCharCodes.join("")
);
export const RandomUCAlphaNumeric = makeRandomGenerator(
	UCCharCodes.join("") + NumCharCodes.join("")
);
export const RandomAlphaNumeric = makeRandomGenerator(
	LCCharCodes.join("") + NumCharCodes.join("") + UCCharCodes.join("")
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
