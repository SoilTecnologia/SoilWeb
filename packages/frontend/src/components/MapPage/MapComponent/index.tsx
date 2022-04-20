import {
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import * as S from "./styles";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useContextUserData } from "hooks/useContextUserData";
import { useContextData } from "hooks/useContextData";
import theme from "styles/theme";
import Router from "next/router";
import IndicadorAH from "../../../../public/icons/indicadorAH.png";
import IndicadorH from "../../../../public/icons/indicadorH.png";
import IndicadorIddle from "../../../../public/icons/inicialpos.png";
import PivotList from "utils/models/pivotlist";
import Pivot from "utils/models/pivot";
import { setCookie } from "nookies";

type InitializeMapProps = {
  setMap: Dispatch<SetStateAction<null>> | null;
  mapContainer: MutableRefObject<string>;
};

const MapComponent = () => {
  const { farm, setPivot } = useContextUserData();
  const { pivotMapList } = useContextData();
  const [map, setMap] = useState(null);
  const mapContainer = useRef("");

  // const metersToPixelsAtMaxZoom = (meters, latitude) =>
  //   meters / 0.019 / Math.cos(latitude * Math.PI / 180)
  // const metersToPixelsAtMinZoom = (meters, latitude) =>
  //   meters / 78271.484 / Math.cos(latitude * Math.PI / 180)
  const createGeoJSONCircle = (pivot: Pivot) => {
    const points = 64;
    const km = pivot.pivot_radius / 1000;

    const coords = {
      latitude: pivot.pivot_lat,
      longitude: pivot.pivot_lng,
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
      type: "geojson",
      data: {
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
      },
    };
  };
  const createGeoJSON = (pivot: Pivot) => {
    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [pivot.pivot_lng, pivot.pivot_lat],
            },
          },
        ],
      },
    };
  };
  const stateSelector = (pivot: Pivot) => {
    if (pivot.connection) {
      if (pivot.power) {
        if (pivot.water) return `${theme.colors.wet}`;
        return `${theme.colors.dry}`;
      }
      return `${theme.colors.off}`;
    }
    return `${theme.colors.offline}`;
  };
  const directionIndicator = (pivot: Pivot) => {
    if (pivot.direction) {
      if (pivot.direction == "CLOCKWISE") return "Clockwise";
      return "Anti_Clockwise";
    }
    return "Iddle";
  };
  const pivotPathDraw = (pivot: Pivot) => {};
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZWR1YXJkb3BtOTgiLCJhIjoiY2wxNnBmM2R4MDlwMTNibGxxcGk1ZmJ1NyJ9.32_foZvLX17jQIypXtYmCg";

    const initializeMap = ({ setMap, mapContainer }: InitializeMapProps) => {
      if (farm) {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/satellite-streets-v11", // stylesheet location
          center: [farm?.farm_lng, farm?.farm_lat],
          zoom: 13.5,
          maxPitch: 65,
        });
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        map.on("load", () => {
          setMap(map);
          map.resize();
          map.once("load", () => {
            map.loadImage(IndicadorH.src, (error, image) => {
              if (error) throw error;
              map.addImage("Clockwise", image);
            });
            map.loadImage(IndicadorAH.src, (error, image) => {
              if (error) throw error;
              map.addImage("Anti_Clockwise", image);
            });
            map.loadImage(IndicadorIddle.src, (error, image) => {
              if (error) throw error;
              map.addImage("Iddle", image);
            });

            if (pivotMapList.pivots) {
              pivotMapList.pivots.map((pivot) => {
                map.addSource(`${pivot.pivot_id}`, createGeoJSONCircle(pivot));
                map.addSource(`${pivot.pivot_id}+image`, createGeoJSON(pivot));

                map.addLayer({
                  id: `${pivot.pivot_id}`,
                  type: "fill",
                  source: `${pivot.pivot_id}`,
                  paint: {
                    "fill-color": stateSelector(pivot),
                  },
                });
                map.addLayer({
                  id: `${pivot.pivot_id}+image`,
                  type: "symbol",
                  source: `${pivot.pivot_id}+image`,
                  layout: {
                    "icon-image": directionIndicator(pivot),
                    "icon-size": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      11,
                      ["/", ["/", pivot.pivot_radius, 35.914], 115],
                      12,
                      ["/", ["/", pivot.pivot_radius, 17.957], 115],
                      13,
                      ["/", ["/", pivot.pivot_radius, 8.978], 115],
                      14,
                      ["/", ["/", pivot.pivot_radius, 4.489], 115],
                      15,
                      ["/", ["/", pivot.pivot_radius, 2.245], 115],
                      16,
                      ["/", ["/", pivot.pivot_radius, 1.122], 115],
                      17,
                      ["/", ["/", pivot.pivot_radius, 0.561], 115],
                      18,
                      ["/", ["/", pivot.pivot_radius, 0.28], 115],
                    ],
                    "icon-allow-overlap": true,
                    "icon-rotation-alignment": "map",
                    "icon-rotate": pivot.end_angle,
                  },
                });

                map.on("click", `${pivot.pivot_id}`, (e) => {
                  const propsCookie = { maxAge: 60 * 60 * 2 };
                  setCookie(
                    undefined,
                    "user-pivot-id",
                    pivot.pivot_id,
                    propsCookie
                  );
                  setPivot(pivot);
                  Router.push("/intent");
                });
                map.on("mouseenter", `${pivot.pivot_id}`, (e) => {
                  map.getCanvas().style.cursor = "pointer";
                  popup
                    .setLngLat(e.lngLat)
                    .setHTML(`Pivô:${pivot.pivot_num}`)
                    .addTo(map);
                });

                map.on("mouseleave", `${pivot.pivot_id}`, () => {
                  map.getCanvas().style.cursor = "";
                  popup.remove();
                });
              });
            }
          });
        });
      }
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, pivotMapList]);

  return <S.Container ref={(el) => (mapContainer.current = el)} />;
};

export default MapComponent;
