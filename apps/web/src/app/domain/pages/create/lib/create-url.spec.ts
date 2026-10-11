import { DEFAULT_DESIGN, encodePreset } from '@zard/design';

import { parseCreateParams, serializeCreateParams, type ParamsLike } from './create-url';

function params(values: Record<string, string>): ParamsLike {
  return { keys: Object.keys(values), get: name => values[name] ?? null };
}

describe('create URL contract', () => {
  const lyra = { ...DEFAULT_DESIGN, style: 'lyra' as const };
  const lyraCode = encodePreset(lyra);

  it('reads the design out of the preset', () => {
    const parsed = parseCreateParams(params({ preset: lyraCode }));

    expect(parsed.design.style).toBe('lyra');
    expect(parsed.design.radius).toBe('none');
    expect(parsed.needsCanonicalization).toBe(false);
  });

  it('falls back to the default design for a missing preset and asks for canonicalization', () => {
    const parsed = parseCreateParams(params({}));

    expect(parsed.design).toEqual(DEFAULT_DESIGN);
    expect(parsed.needsCanonicalization).toBe(true);
  });

  it.each(['zzz', '', 'b2D0wqNxT', 'Z!!'])('survives the malformed or foreign preset "%s"', preset => {
    const parsed = parseCreateParams(params({ preset }));

    expect(parsed.design).toEqual(DEFAULT_DESIGN);
    expect(parsed.needsCanonicalization).toBe(true);
  });

  it('folds individual params into the design and marks the URL for rewriting', () => {
    const parsed = parseCreateParams(
      params({ preset: encodePreset(DEFAULT_DESIGN), style: 'lyra', baseColor: 'zinc' }),
    );

    expect(parsed.design.style).toBe('lyra');
    expect(parsed.design.baseColor).toBe('zinc');
    expect(parsed.needsCanonicalization).toBe(true);
  });

  it('lets an individual param override the preset it accompanies', () => {
    const parsed = parseCreateParams(params({ preset: lyraCode, style: 'nova' }));

    expect(parsed.design.style).toBe('nova');
  });

  it('accepts the composite menu colors shadcn spelled as one param', () => {
    const parsed = parseCreateParams(params({ menuColor: 'inverted-translucent' }));

    expect(parsed.design.menuColor).toBe('inverted');
    expect(parsed.design.menuAppearance).toBe('translucent');
  });

  it('never lands on a design the codec would reject', () => {
    const parsed = parseCreateParams(
      params({ style: 'rhea', radius: 'large', menuAppearance: 'translucent', menuAccent: 'bold' }),
    );

    expect(parsed.design.radius).toBe('default');
    expect(parsed.design.menuAccent).toBe('subtle');
  });

  it('defaults the item and reads it back', () => {
    expect(parseCreateParams(params({ preset: lyraCode })).item).toBe('preview-01');
    expect(parseCreateParams(params({ preset: lyraCode, item: 'preview-02' })).item).toBe('preview-02');
  });

  it('writes the preset always and the item only when it is not the default canvas', () => {
    expect(serializeCreateParams(lyra, 'preview-01')).toEqual({ preset: lyraCode });
    expect(serializeCreateParams(lyra, 'component:button')).toEqual({ preset: lyraCode, item: 'component:button' });
  });

  it('round-trips through the serialized query', () => {
    const query = serializeCreateParams(lyra, 'preview-02');
    const parsed = parseCreateParams(params(query));

    expect(parsed.design).toEqual(parseCreateParams(params({ preset: lyraCode })).design);
    expect(parsed.item).toBe('preview-02');
    expect(parsed.needsCanonicalization).toBe(false);
  });
});
