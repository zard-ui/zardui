// Nothing here touches MapLibre when the module is evaluated: `ng-mapcn` only creates a map inside
// `afterNextRender`, so the barrel is safe to import on the server. Lazy-load the routes or `@defer`
// blocks that render `<ng-map>` to keep the engine out of the initial bundle.
export * from './map.imports';
export * from './map.provider';
export * from './map-style.service';
export * from './map-styles';
