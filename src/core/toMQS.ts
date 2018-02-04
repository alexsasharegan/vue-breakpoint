import { CamelToKebab } from "./camelToKebab";

export type MediaQueryString = string;
export type MediaQueryObject = {
	[mediaFeature: string]: string | boolean;
};

export type MediaQueryMap = {
	[mediaAlias: string]: MediaQueryObject | MediaQueryObject[];
};
export type MediaQueryFlatMap = {
	[mediaAlias: string]: MediaQueryString;
};

function mqo2str(mqo: MediaQueryObject): MediaQueryString {
	let feat: string;
	let val: string | boolean;
	let mq: string[] = [];

	for (feat of Object.keys(mqo)) {
		// Cache the feature's value before normalization.
		val = mqo[feat];
		// Normalize to css kebab casing.
		feat = CamelToKebab(feat);

		/* Handle boolean features like "print" & "screen" */
		if (val === true) {
			mq.push(feat);
			continue;
		}
		/* Handle negated boolean features */
		if (val === false) {
			mq.push(`not ${feat}`);
			continue;
		}

		mq.push(`(${feat}: ${val})`);
	}

	return mq.join(" and ");
}

export function toMQS(...mqos: MediaQueryObject[]): MediaQueryString {
	return mqos.map(mqo2str).join(", ");
}

export function FlattenMediaQueryMap(map: MediaQueryMap): MediaQueryFlatMap {
	const flat: MediaQueryFlatMap = Object.create(null);
	let alias: string;
	let mqo: MediaQueryObject | MediaQueryObject[];

	for (alias of Object.keys(map)) {
		mqo = map[alias];

		if (!Array.isArray(mqo)) {
			mqo = [mqo];
		}

		flat[alias] = toMQS(...mqo);
	}

	return flat;
}
