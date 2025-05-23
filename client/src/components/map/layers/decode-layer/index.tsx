import { RasterLayer } from 'react-map-gl';

import { Layer, LayerExtension } from '@deck.gl/core';
import { GeoBoundingBox, TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { GL } from '@luma.gl/constants';
import { RasterSource } from 'mapbox-gl';

export interface DecodeLayerProps {
  source: RasterSource;
  styles: RasterLayer[];
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
}

type DecodeExtensionType = Layer<{
  decodeFunction: string;
  decodeParams: Record<string, unknown>;
  zoom: number;
}>;

class DecodeExtension extends LayerExtension {
  getShaders(this: DecodeExtensionType) {
    return {
      inject: {
        'fs:#decl': `
          uniform float zoom;
          uniform float startYear;
          uniform float endYear;
        `,

        'fs:DECKGL_FILTER_COLOR': `
          ${this.props.decodeFunction}
        `,
      },
    };
  }

  updateState(this: DecodeExtensionType) {
    const { decodeParams = {}, zoom } = this.props;

    for (const model of this.getModels()) {
      model.setUniforms({
        zoom,
        ...decodeParams,
      });
    }
  }
}

class DecodeLayer {
  constructor({ source, styles, decodeFunction, decodeParams }: DecodeLayerProps) {
    return new TileLayer<
      unknown,
      {
        decodeFunction: DecodeLayerProps['decodeFunction'];
        decodeParams: DecodeLayerProps['decodeParams'];
      }
    >({
      id: styles[0].id,
      data: source.tiles,
      tileSize: source.tileSize ?? 256,
      minZoom: source.minzoom,
      maxZoom: source.maxzoom,
      visible: (styles[0].layout?.visibility as unknown as boolean) ?? true,
      opacity: (styles[0].paint?.['raster-opacity'] as number) ?? 1,
      refinementStrategy: 'no-overlap',
      decodeFunction,
      decodeParams,
      renderSubLayers: (subLayer) => {
        const {
          id: subLayerId,
          data: subLayerData,
          tile: subLayerTile,
          visible: subLayerVisible,
          opacity: subLayerOpacity,
        } = subLayer;

        const { zoom } = subLayerTile;
        const { west, south, east, north } = subLayerTile.bbox as GeoBoundingBox;
        if (subLayerData) {
          return new BitmapLayer({
            id: subLayerId,
            image: subLayerData,
            bounds: [west, south, east, north],
            textureParameters: {
              minFilter: 'nearest',
              magFilter: 'nearest',
              mipmapFilter: undefined,
            },
            zoom,
            visible: subLayerVisible,
            opacity: subLayerOpacity,
            decodeParams,
            decodeFunction,
            extensions: [new DecodeExtension()],
            updateTriggers: {
              decodeParams,
              decodeFunction,
            },
          });
        }
        return null;
      },
    });
  }
}

export default DecodeLayer;
