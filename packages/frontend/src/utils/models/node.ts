type Node = {
  node_id: string;
  node_num: number;
  farm_id: string;
  is_gprs: boolean;
  gateway?: string | null;
};

export default Node;
export type NodeCreate = {
  node_num: number;
  farm_id: string;
  is_gprs: boolean;
  gateway?: string | null;
};
