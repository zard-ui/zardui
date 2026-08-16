/**
 * Labels that ride a radial bar's ring.
 *
 * Recharts draws these with an SVG `<textPath>` on a circular arc, so every glyph sits on the
 * ring and leans with it. Canvas has no such thing, and ECharts' own polar label turns the whole
 * word to face the centre — a straight line of text across a curve, whose ends fall inside the
 * band. Placing one glyph at a time along the arc is the canvas equivalent.
 */

/** Where the text starts, past the beginning of the bar. Recharts' `<LabelList offset>`. */
const START_OFFSET_DEGREES = 5;

export interface ZardArcLabelGeometry {
  /** Centre of the polar system, in canvas pixels. */
  cx: number;
  cy: number;
  /** Radius of each ring, outermost last, matching the order of `texts`. */
  radii: readonly number[];
  /** Where the bars begin, in ECharts degrees: 0 is three o'clock, positive counter-clockwise. */
  startAngle: number;
  /** Whether the bars sweep towards a larger angle. */
  ascending: boolean;
  font: string;
  fontSize: number;
  fill: string;
}

type TextElement = Record<string, unknown>;

let ruler: CanvasRenderingContext2D | null | undefined;

function measureContext(): CanvasRenderingContext2D | null {
  if (ruler !== undefined) {
    return ruler;
  }

  try {
    ruler = globalThis.document?.createElement('canvas').getContext('2d') ?? null;
  } catch {
    ruler = null;
  }

  return ruler;
}

/** Lays one label along one ring, a glyph at a time. */
function glyphsOf(text: string, radius: number, geometry: ZardArcLabelGeometry): TextElement[] {
  const context = measureContext();
  if (!context || radius <= 0) {
    return [];
  }

  context.font = geometry.font;
  const sign = geometry.ascending ? 1 : -1;
  const characters = [...text];

  let travelled = (START_OFFSET_DEGREES * Math.PI * radius) / 180;

  return characters.map(character => {
    const { width } = context.measureText(character);
    const angle = geometry.startAngle + ((sign * (travelled + width / 2)) / radius) * (180 / Math.PI);
    const radians = (angle * Math.PI) / 180;
    travelled += width;

    // The tangent, pointing the way the text reads.
    const tangentX = -Math.sin(radians) * sign;
    const tangentY = -Math.cos(radians) * sign;

    return {
      type: 'text',
      x: geometry.cx + Math.cos(radians) * radius,
      y: geometry.cy - Math.sin(radians) * radius,
      rotation: -Math.atan2(tangentY, tangentX),
      z: 100,
      silent: true,
      style: {
        text: character,
        fill: geometry.fill,
        font: geometry.font,
        align: 'center',
        verticalAlign: 'middle',
      },
    };
  });
}

/** Every glyph of every label, ready to hand to ECharts as `graphic` elements. */
export function buildArcLabels(texts: readonly string[], geometry: ZardArcLabelGeometry): TextElement[] {
  return texts.flatMap((text, index) => glyphsOf(text, geometry.radii[index] ?? 0, geometry));
}

/** ECharts sizes a polar radius against half the shorter side; percentages resolve the same way. */
export function resolveRadius(value: string | number | undefined, base: number, fallback: number): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const percent = Number.parseFloat(value);
    return Number.isFinite(percent) ? (percent / 100) * base : fallback;
  }
  return fallback;
}
