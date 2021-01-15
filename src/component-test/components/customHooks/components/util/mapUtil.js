export function addCentroids(map, config, centroids) {
  if (!config.centroids) return;
  const { layers, sources } = centroids;
  map
    .addSource("centroids", { type: "vector", url: sources.url })
    .addLayer({
      id: layers.id,
      source: layers.source,
      "source-layer": layers.sourceLayer,
      type: "circle",
    })
    .addLayer({
      id: "label-layer",
      source: layers.source,
      "source-layer": layers.sourceLayer,
      type: "symbol",
    });
}
