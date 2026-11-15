import type { CodeBlockData } from '@highlight/types';

export const MAP_DRAW_MANUAL_CODE: CodeBlockData[] = [
  {
    "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">export</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> *</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> 'ng-mapcn/draw'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">export</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> *</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> './map-draw.imports'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span></code></pre>",
    "code": "export * from 'ng-mapcn/draw';\nexport * from './map-draw.imports';\n",
    "language": "angular-ts",
    "title": "index.ts",
    "showLineNumbers": true,
    "copyButton": true,
    "expandable": true,
    "expandableTitle": "Expand"
  },
  {
    "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { MapDrawComponent } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> 'ng-mapcn/draw'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ZardMapImports } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/map/map.imports'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\">/**</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"> * Everything to draw on a map: the map bundle plus `ng-map-draw`. Drawing is optional because it needs `terra-draw`</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"> * and `terra-draw-maplibre-gl-adapter`, which the core `map` item never loads.</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"> */</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">export</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> const</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> ZardMapDrawImports</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> =</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> [</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">...</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">ZardMapImports, MapDrawComponent] </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">as</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> const</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span></code></pre>",
    "code": "import { MapDrawComponent } from 'ng-mapcn/draw';\n\nimport { ZardMapImports } from '@/shared/components/map/map.imports';\n\n/**\n * Everything to draw on a map: the map bundle plus `ng-map-draw`. Drawing is optional because it needs `terra-draw`\n * and `terra-draw-maplibre-gl-adapter`, which the core `map` item never loads.\n */\nexport const ZardMapDrawImports = [...ZardMapImports, MapDrawComponent] as const;\n",
    "language": "angular-ts",
    "title": "map-draw.imports.ts",
    "showLineNumbers": true,
    "copyButton": true,
    "expandable": true,
    "expandableTitle": "Expand"
  }
];
