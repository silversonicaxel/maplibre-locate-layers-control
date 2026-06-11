# maplibre-locate-layers-control
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.alessandrorabitti.com/"><img src="https://avatars.githubusercontent.com/u/6851815?v=4?s=100" width="100px;" alt="Alessandro Rabitti"/><br /><sub><b>Alessandro Rabitti</b></sub></a><br /><a href="https://github.com/silversonicaxel/maplibre-locate-layers-control/commits?author=silversonicaxel" title="Code">💻</a> <a href="#a11y-silversonicaxel" title="Accessibility">️️️️♿️</a> <a href="https://github.com/silversonicaxel/maplibre-locate-layers-control/commits?author=silversonicaxel" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!