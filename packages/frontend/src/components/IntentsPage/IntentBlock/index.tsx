import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import Map, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";

const IntentBlock = () => {
  const { farm, pivot } = useContextUserData()

  var createGeoJSONCircle = function () {
    var points = 64;
    var km = (pivot.pivot_radius) / 1000;

    var coords = {
      latitude: pivot?.pivot_lat,
      longitude: pivot?.pivot_lng,
    };

    var ret = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;

    var theta, x, y;
    for (var i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'FeatureCollection',
      features: [{
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [ret]
        }
      }]
    };
  };



  // const geojson = {
  //   type: 'FeatureCollection',
  //   features: [{
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [
  //         farm?.farm_lng,
  //         farm?.farm_lat
  //       ]
  //     }
  //   }]
  // };
  const stateSelector = () => {

    if (pivot.power === true) {
      if (pivot.water === true)
        return 'blue'
      return 'green'

    }
    return 'gray'

  }


  const layerStyle = {
    id: 'polygon',
    type: 'fill',
    source: "polygon",
    paint: {
      'fill-color': stateSelector(),
    },
  };

  return (
    <S.Container>

      <S.MapContainer>
        <S.MapStyle>

          <Map
            initialViewState={{
              zoom: 12.5,
              latitude: farm?.farm_lat,
              longitude: farm?.farm_lng,
            }}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
            mapboxAccessToken="pk.eyJ1IjoiZWR1YXJkb3BtOTgiLCJhIjoiY2wxNnBmM2R4MDlwMTNibGxxcGk1ZmJ1NyJ9.32_foZvLX17jQIypXtYmCg"


          >

            <Source id="polygon" type="geojson" data={createGeoJSONCircle()}>
              <Layer {...layerStyle} />
            </Source>

          </Map>

        </S.MapStyle>
        <S.CaptionContainer>

        </S.CaptionContainer>
      </S.MapContainer>

      <S.IntentContainer>
        <IntentManager />
        <SendAndCancelButton />
      </S.IntentContainer>

    </S.Container>
  )

};

export default IntentBlock;
