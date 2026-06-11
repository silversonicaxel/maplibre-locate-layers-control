# maplibre-locate-layers-control

MapLibre Locate Layers Control is a plugin to fit map bounds to the geometry extent of style layers in MapLibre GL JS, in a simple but flexible way.

The control renders a clean button that, when clicked, dynamically calculates the bounding box of active geometric layers and fits the map view to that extent.

## Features

- Locates all layers containing geometries (fill, line, circle, symbol, fill-extrusion, heatmap)
- Resolves bounds dynamically using the official `getData()` API with backwards compatibility fallbacks
- Support for custom padding configuration
- Smooth flying animation (`flyTo`) or instant jump option
- Seamless visual integration with standard MapLibre control groups

## Installation

```bash
npm install maplibre-locate-layers-control
```

## Api

### Locate Layers Options

| Option | Type | Default | Description | Mandatory |
| - | - | - | - | - |
| `padding` | `number \| PaddingOptions` | `0` | Padding in pixels to add around the bounds | No |
| `flyTo` | `boolean` | `true` | Enable smooth zoom flying animation, otherwise jumps instantly | No |

## Example

The example below shows how to instantiate and add the Locate Layers Control to a MapLibre GL map.

```javascript
import { MapLibreLocateLayersControl } from "maplibre-locate-layers-control";
import "maplibre-locate-layers-control/style.css";

const locateLayerControl = new MapLibreLocateLayersControl({
    padding: { top: 80, bottom: 80, left: 80, right: 80 },
    flyTo: true
});
map.addControl(locateLayerControl, 'top-left');
```