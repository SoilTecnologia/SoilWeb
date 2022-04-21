import Map, { Layer, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MainMap from "components/MapPage/MainMap";
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useEffect } from "react";
import { useContextUserData } from "hooks/useContextUserData";
import MapComponent from "components/MapPage/MapComponent";
import { parseCookies } from "nookies";

const MapPage = () => {
  const { farm, setFarm } = useContextUserData();
  const { getGetPivotsListForMapWithFarmId, getOneFarms } =
    useContextActionCrud();

  const getFarm = async (farm_id: string) => {
    const resultFarm = await getOneFarms(farm_id);
    if (resultFarm) setFarm(resultFarm);
  };

  useEffect(() => {
    if (farm && farm.farm_id) {
      console.log("Tem farm");
      getGetPivotsListForMapWithFarmId(farm.farm_id);
    } else {
      console.log("Não tem farm");
      const { "user-farm-id": farm_id } = parseCookies();
      getFarm(farm_id);

      getGetPivotsListForMapWithFarmId(farm_id);
    }
  }, []);

  return <MainMap />;
  //return <MapComponent/>
};
export default MapPage;
