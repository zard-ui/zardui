import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createOgMarkup(title: string, description: string): any {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
      },
      children: [
        // Top border row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '100%',
              height: '12%',
              borderBottom: '1px solid #333333',
            },
            children: [
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderRight: '1px solid #333333' }, children: [] },
              },
              { type: 'div', props: { style: { flex: 1, height: '100%' }, children: [] } },
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderLeft: '1px solid #333333' }, children: [] },
              },
            ],
          },
        },
        // Content row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              width: '100%',
            },
            children: [
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderRight: '1px solid #333333' }, children: [] },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flex: 1,
                    height: '100%',
                    position: 'relative',
                    alignItems: 'center',
                    padding: '96px',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', flexDirection: 'column' },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 80,
                                fontWeight: 600,
                                color: 'white',
                                letterSpacing: '-0.025em',
                                lineHeight: 1,
                              },
                              children: title,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 28,
                                color: '#a3a3a3',
                                marginTop: 40,
                                lineHeight: 1.4,
                                maxWidth: '42ch',
                              },
                              children: description,
                            },
                          },
                        ],
                      },
                    },
                    // Zard logo SVG (bottom-right)
                    {
                      type: 'svg',
                      props: {
                        xmlns: 'http://www.w3.org/2000/svg',
                        width: 80,
                        height: 64,
                        viewBox: '0 0 360 287',
                        fill: 'none',
                        style: {
                          position: 'absolute',
                          bottom: 40,
                          right: 40,
                        },
                        children: [
                          {
                            type: 'path',
                            props: {
                              d: 'M229.217 0.5H0.217285L221.217 107C222.217 107.5 224.217 109.2 224.217 112L186.217 144.5H351.217L229.217 0.5Z',
                              fill: 'white',
                            },
                          },
                          {
                            type: 'path',
                            props: {
                              d: 'M129.217 284L12.2173 144.5H179.217L140.217 175V178L359.217 286L129.217 284Z',
                              fill: 'white',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderLeft: '1px solid #333333' }, children: [] },
              },
            ],
          },
        },
        // Bottom border row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '100%',
              height: '12%',
              borderTop: '1px solid #333333',
            },
            children: [
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderRight: '1px solid #333333' }, children: [] },
              },
              { type: 'div', props: { style: { flex: 1, height: '100%' }, children: [] } },
              {
                type: 'div',
                props: { style: { width: '8%', height: '100%', borderLeft: '1px solid #333333' }, children: [] },
              },
            ],
          },
        },
      ],
    },
  };
}

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Zard UI';
    const description = searchParams.get('description') || 'The @shadcn/ui alternative for Angular';

    const fontUrl = new URL('/fonts/GeistMono-SemiBold.woff', request.url);
    const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());

    return new ImageResponse(createOgMarkup(title, description), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist Mono',
          data: fontData,
          style: 'normal',
          weight: 600,
        },
      ],
      headers: {
        'Cache-Control': 'public, s-maxage=2592000, max-age=604800',
      },
    });
  } catch {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
