import Map, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import MainMap from 'components/MapPage/MainMap';
import { useContextActionCrud } from "hooks/useActionsCrud";
import { useEffect } from 'react';
import { useContextUserData } from 'hooks/useContextUserData';
import MapComponent from 'components/MapPage/MapComponent';


const MapPage = () => {
  const { farm } = useContextUserData()
  const { getGetPivotsListForMapWithFarmId } = useContextActionCrud()

  useEffect(() => {
    if (farm) {
      getGetPivotsListForMapWithFarmId(farm.farm_id)
    }
  }, [])


  return <MainMap />
  //return <MapComponent/>
}
export default MapPage;
