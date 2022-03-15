import Node from "./node";
import Pivot from "./pivot";

export interface FarmFormResponse {
  farm_id: string;
  farm_name: string;
  farm_city: string;
  farm_lng: number;
  farm_lat: number;
}
export interface FarmCreate extends FarmFormResponse {
  user_id: string;
}
interface Farm extends FarmCreate {
  pivots: Pivot[] | null;
  node: Node[] | null;
}
export default Farm;
export interface FarmFormCreate {
  farm_id: string;
  farm_name: string;
  farm_city: string;
  farm_lng: string;
  farm_lat: string;
}
