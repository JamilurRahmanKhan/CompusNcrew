# CompassNCrew token decisions

## Color

- Canvas: `#111315` for the journey, inherited from its existing visual system.
- Primary dark surface: `#111315` at 95% opacity for the route bar.
- Primary text: `#f4ead6`.
- Secondary text: `#b7afa2`.
- Accent: `#dc7431`; brighter interaction state: `#ed8a49`.
- Borders: translucent white between 10% and 25%, increasing on interaction.

## Typography

- Website display: Instrument Serif through `--font-instrument-serif`.
- Interface text: Inter through `--font-inter`.
- Route labels use 10–11px uppercase text only as compact wayfinding metadata.

## Spacing and sizing

- Route bar: 60px high.
- Navigation controls: 44px minimum touch height.
- Compact component spacing: 8px; grouped controls: 12–20px.
- Responsive padding respects safe-area insets.

## Radius

- Navigation controls: 10px.
- Journey panels retain their established 6px, 10px, and 18px scale.

## Motion

- Route-control feedback: 150ms, transform and color properties only.
- Loading veil: 300ms opacity transition.
- All journey motion honors `prefers-reduced-motion`.

## Elevation and focus

- Dark surfaces use a subtle light border plus a low-opacity ambient shadow.
- Focus outline: 2px amber with a 2px offset.
- Route shell z-index: 70, above the shared site navigation while active.
