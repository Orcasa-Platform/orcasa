'use client';

import { H3HexagonLayer, H3HexagonLayerProps } from '@deck.gl/geo-layers/typed';
import { LineLayer, LineLayerProps } from '@deck.gl/layers/typed';

import DeckLayer from '@/components/map/layers/deck-layer';
import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  return (
    <DeckMapboxOverlayProvider>
      <DeckLayer<LineLayerProps>
        id="line-layer"
        type={LineLayer}
        data="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json"
        getColor={(d) => [Math.sqrt(d.inbound + d.outbound), 140, 0]}
        getSourcePosition={(d) => d.from.coordinates}
        getTargetPosition={(d) => d.to.coordinates}
        getWidth={8}
        pickable
        beforeId="admin-1-boundary-bg"
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
        getFillColor={(d) => [255, 140, 0]}
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
