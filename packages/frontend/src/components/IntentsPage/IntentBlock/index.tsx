import IntentManager from "../IntentManager";
import SendAndCancelButton from "../SendAndCancelButton";
import Map, { Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as S from "./styles";
import { useContextUserData } from "hooks/useContextUserData";
import CaptionComponent from "../CaptionComponent";
import theme from "styles/theme";

const IntentBlock = () => {
  const { farm, pivot } = useContextUserData();
  console.log(`Farm : ${JSON.stringify(farm, null, 2)}`);
  console.log(".....");
  console.log(`Pivot : ${JSON.stringify(pivot, null, 2)}`);

  const createGeoJSONCircle = function () {
    const points = 64;
    const km = pivot.pivot_radius / 1000;

    const coords = {
      latitude: pivot?.pivot_lat,
      longitude: pivot?.pivot_lng,
    };

    const ret = [];
    const distanceX =
      km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ret],
          },
        },
      ],
    };
  };

  const stateSelector = () => {
    if (pivot.connection) {
      if (pivot.power) {
        if (pivot.water) return `${theme.colors.wet}`;
        return `${theme.colors.dry}`;
      }
      return `${theme.colors.off}`;
    }
    return `${theme.colors.offline}`;
  };

  const layerStyle = {
    id: "polygon",
    type: "fill",
    source: "polygon",
    paint: {
      "fill-color": stateSelector(),
    },
  };

  return (
    <S.Container>
      <S.MapContainer>
        <S.MapStyle>
          <Map
            initialViewState={{
              zoom: 13.5,
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
          <CaptionComponent />
        </S.CaptionContainer>
      </S.MapContainer>

      <S.IntentContainer>
        <IntentManager />
        <SendAndCancelButton />
      </S.IntentContainer>
    </S.Container>
  );
};

export default IntentBlock;
