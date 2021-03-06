import Pivot from "./pivot";

type Node = {
  node_id: string;
  node_num: number;
  farm_id: string;
  is_gprs: boolean;
  gateway?: string;
  pivots: Pivot[] | null;
};

export default Node;
export type NodeCreate = {
  node_num: number;
  farm_id: string;
  is_gprs: boolean;
  gateway?: string;
};
