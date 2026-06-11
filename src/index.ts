import type { IControl, Map, LayerSpecification, GeoJSONSource } from 'maplibre-gl';
import { LngLatBounds } from 'maplibre-gl';

export interface MapLibreLocateLayersControlOptions {
    padding?: number | { top: number; bottom: number; left: number; right: number };
    flyTo?: boolean;
}

export class MapLibreLocateLayersControl implements IControl {
    #map?: Map;
    #container?: HTMLDivElement;
    #button?: HTMLButtonElement;
    #padding: MapLibreLocateLayersControlOptions['padding'];
    #flyTo: MapLibreLocateLayersControlOptions['flyTo'];

    constructor(options: MapLibreLocateLayersControlOptions = {}) {
        this.#padding = options.padding || 0;
        this.#flyTo = options.flyTo || true;
    }

    async #fitToAllLayers(): Promise<void> {
        if (!this.#map) return;

        const style = this.#map.getStyle();
        if (!style || !style.layers || style.layers.length === 0) return;

        const combinedBounds = new LngLatBounds();
        const processedSources = new Set<string>();

        const geometricLayerTypes = ['fill', 'line', 'circle', 'symbol', 'fill-extrusion', 'heatmap'];

        for (const layer of style.layers) {
            if (!geometricLayerTypes.includes(layer.type)) continue;

            if (!('source' in layer)) continue;
            const sourceId = layer.source;
            if (!sourceId || typeof sourceId !== 'string' || processedSources.has(sourceId)) continue;

            const source = this.#map.getSource(sourceId);
            if (!source) continue;

            processedSources.add(sourceId);

            if (source.type === 'geojson') {
                const geojsonSource = source as any;
                let data: any = null;

                if (typeof geojsonSource.getData === 'function') {
                    try {
                        data = await geojsonSource.getData();
                    } catch (e) {
                        console.error('Error calling getData():', e);
                    }
                }

                if (!data && geojsonSource._data) {
                    const rawData = geojsonSource._data;
                    if (rawData && typeof rawData === 'object' && 'geojson' in rawData) {
                        data = rawData.geojson;
                    } else {
                        data = rawData;
                    }
                }

                if (data && typeof data === 'object') {
                    const bounds = this.#getGeoJsonBounds(data);
                    if (bounds) {
                        combinedBounds.extend(bounds);
                    } else {
                        const features = this.#map.queryRenderedFeatures(undefined, { layers: [layer.id] });
                        features.forEach((feature) => {
                            const bounds = this.#getFeatureBounds(feature);
                            if (bounds) combinedBounds.extend(bounds);
                        });
                    }
                } else {
                    const features = this.#map.queryRenderedFeatures(undefined, { layers: [layer.id] });
                    features.forEach((feature) => {
                        const bounds = this.#getFeatureBounds(feature);
                        if (bounds) combinedBounds.extend(bounds);
                    });
                }
            } else if ('bounds' in source && source.bounds) {
                const b = source.bounds as [number, number, number, number];
                combinedBounds.extend([
                    [b[0], b[1]],
                    [b[2], b[3]]
                ]);
            }
        }

        if (!combinedBounds.isEmpty()) {
            const fitOptions = {
                padding: this.#padding,
                essential: true,
            };

            if (this.#flyTo) {
                this.#map.fitBounds(combinedBounds, { ...fitOptions, duration: 1500 });
            } else {
                this.#map.fitBounds(combinedBounds, { ...fitOptions, duration: 0 });
            }
        }
    }

    #getFeatureBounds(feature: any): any {
        const geom = feature.geometry;
        if (!geom) return null;
        if (geom.type === 'Point') return geom.coordinates;
        if (geom.type === 'LineString' || geom.type === 'MultiPoint') return geom.coordinates;
        if (geom.type === 'Polygon' || geom.type === 'MultiLineString') return geom.coordinates.flat();
        if (geom.type === 'MultiPolygon') return geom.coordinates.flat(2);
        return null;
    }

    #getGeoJsonBounds(geojson: any): [[number, number], [number, number]] | null {
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        const processCoords = (coords: any) => {
            if (typeof coords[0] === 'number') {
                minLng = Math.min(minLng, coords[0]); maxLng = Math.max(maxLng, coords[0]);
                minLat = Math.min(minLat, coords[1]); maxLat = Math.max(maxLat, coords[1]);
            } else { coords.forEach(processCoords); }
        };

        if (geojson.type === 'FeatureCollection') {
            geojson.features.forEach((f: any) => { if (f.geometry) processCoords(f.geometry.coordinates); });
        } else if (geojson.type === 'Feature') {
            if (geojson.geometry) processCoords(geojson.geometry.coordinates);
        } else {
            processCoords(geojson.coordinates);
        }

        if (minLng === Infinity) return null;
        return [[minLng, minLat], [maxLng, maxLat]];
    }

    #createContainer(): HTMLDivElement {
        const container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        return container;
    }

    #createButton(): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = 'maplibregl-ctrl-locate-layers';
        button.type = 'button';
        button.title = 'Locate layers';
        button.setAttribute('aria-label', 'Locate layers');

        button.innerHTML = `
            <svg viewBox="0 0 20 20" width="20" height="20" style="display:block;margin:auto;">
                <path d="M2 6V2h4M14 2h4v4M18 14v4h-4M6 18H2v-4" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;

        button.addEventListener('click', () => this.#fitToAllLayers());
        return button;
    }

    onAdd(map: Map): HTMLElement {
        this.#map = map;
        this.#container = this.#createContainer();
        this.#button = this.#createButton();

        this.#container.appendChild(this.#button);

        return this.#container;
    }

    onRemove(): void {
        this.#container?.remove();
        this.#map = undefined;
    }
}
