import Node from "./node";
import Pivot from "./pivot";

type Farm = {
  farm_id: string;
  user_id: string;
  farm_name: string;
  farm_city: string;
  farm_lng: number;
  farm_lat: number;
  pivots: Pivot[] | null;
  node: Node[] | null;
};

export default Farm;

export type FarmCreate = {
  farm_name: string;
  farm_city: string;
  farm_lng: number;
  farm_lat: number;
};
