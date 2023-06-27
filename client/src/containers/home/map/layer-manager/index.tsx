'use client';

import { H3HexagonLayer, H3HexagonLayerProps } from '@deck.gl/geo-layers/typed';
import { LineLayerProps, ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers/typed';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import DeckLayer from '@/components/map/layers/deck-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';
import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  return (
    <DeckMapboxOverlayProvider>
      <MapboxLayer
        beforeId="building"
        source={{
          id: 'vector-mapbox-layer',
          type: 'vector',
          url: 'mapbox://layer-manager.1ecpue1k',
        }}
        styles={[
          {
            id: 'indicators',
            'source-layer': 'Indicators',
            type: 'fill',
            paint: {
              // fill color depends on a category value called bws_cat that goe from 0 to 4
              'fill-color': [
                'match',
                ['get', 'bws_cat'],
                0,
                '#f7f7f7',
                1,
                '#d9f0a3',
                2,
                '#addd8e',
                3,
                '#78c679',
                4,
                '#31a354',
                /* other */ '#ccc',
              ],
              'fill-opacity': 0.5,
            },
          },
        ]}
        settings={{
          opacity: 1,
          visibility: true,
        }}
      />

      <DeckJsonLayer<LineLayerProps>
        id="deck-json-layer"
        beforeId="poi-label"
        layer={{
          '@@type': 'LineLayer',
          data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
          getColor: [255, 0, 0],
          getSourcePosition: '@@=from.coordinates',
          getTargetPosition: '@@=to.coordinates',
          getWidth: 5,
          pickable: true,
        }}
        settings={{
          opacity: 1,
          visibility: true,
        }}
        onHover={(info) => console.info(info)}
      />

      <DeckLayer<ScatterplotLayerProps>
        id="scatterplot-layer"
        type={ScatterplotLayer}
        data="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json"
        getFillColor={[255, 140, 0]}
        getLineColor={[0, 0, 0]}
        getPosition={(d) => d.coordinates}
        getRadius={(d) => Math.sqrt(d.exits)}
        lineWidthMinPixels={1}
        radiusMaxPixels={100}
        radiusMinPixels={1}
        radiusScale={6}
        stroked
        pickable
        settings={{
          opacity: 1,
          visibility: true,
        }}
        onHover={(info) => console.info(info)}
      />

      <DeckLayer<H3HexagonLayerProps>
        id="h3-hexagon-layer"
        type={H3HexagonLayer}
        data="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json"
        extruded={true}
        getHexagon={(d) => d.hex}
        getFillColor={(d) => [d.count, 140, 0]}
        getElevation={(d) => d.count}
        elevationScale={100}
        pickable
        settings={{
          opacity: 1,
          visibility: true,
        }}
        onHover={(info) => console.info(info)}
      />
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;
