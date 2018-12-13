import { toMQS, MediaQueryObject } from "./toMQS";

interface TestCase {
  input: MediaQueryObject[];
  output: string;
}

// TableTests
const tt: TestCase[] = [
  {
    input: [{ screen: true }],
    output: "screen",
  },
  {
    input: [{ handheld: false }],
    output: "not handheld",
  },
  {
    input: [{ minWidth: "100px", maxWidth: "200px" }],
    output: "(min-width: 100px) and (max-width: 200px)",
  },
  {
    input: [{ minWidth: "100px", maxWidth: "20em" }],
    output: "(min-width: 100px) and (max-width: 20em)",
  },
  {
    input: [
      { screen: true, minWidth: "100px" },
      { handheld: true, orientation: "landscape" },
    ],
    output:
      "screen and (min-width: 100px), handheld and (orientation: landscape)",
  },
  {
    input: [{ screen: true, minWidth: "100px", maxWidth: "200px" }],
    output: "screen and (min-width: 100px) and (max-width: 200px)",
  },
  {
    input: [{ minWidth: "100px", aspectRatio: "3/4" }],
    output: "(min-width: 100px) and (aspect-ratio: 3/4)",
  },
  {
    input: [{ minWidth: "10em", aspectRatio: "3/4" }],
    output: "(min-width: 10em) and (aspect-ratio: 3/4)",
  },
  {
    input: [
      { minWidth: "100px" },
      { handheld: true, orientation: "landscape" },
    ],
    output: "(min-width: 100px), handheld and (orientation: landscape)",
  },
  {
    input: [{ all: true, monochrome: true }],
    output: "all and monochrome",
  },
];

describe("toMQS (toMediaQueryString)", () => {
  it("should transform media queries", async () => {
    let input: MediaQueryObject[];
    let output: string;

    for ({ input, output } of tt) {
      expect(toMQS(...input)).toEqual(output);
    }
  });
});
