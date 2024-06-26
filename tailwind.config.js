/** @type {import('tailwindcss').Config} */

const range = (start, end, increment = 1) => {
  const count = Math.floor((end - start + 1) / increment);
  return Array(count)
    .fill(0)
    .map((_, idx) => start + idx * increment);
};

const minSpacingPixel = 0;
const maxSpacingPixel = 2000;
const spacingPixelIncrement = 1;

const minFontSize = 4;
const maxFontSize = 140;

module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    spacing: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
    },
    fontFamily: {
      Avenir: "Avenir",
    },
    extend: {
      fontSize: {
        ...range(minFontSize, maxFontSize).reduce((merged, f) => ({ ...merged, [f]: `${f}px` }), {}),
      },
      gap: (theme) => theme("spacing"),
      height: (theme) => ({
        ...theme("spacing"),
      }),
      width: (theme) => ({
        ...theme("spacing"),
      }),
      inset: (theme, { negative }) => ({
        ...theme("spacing"),
        ...negative(theme("spacing")),
      }),
      borderRadius: (theme) => ({
        ...theme("spacing"),
      }),
    },
  },
  plugins: [],
};
