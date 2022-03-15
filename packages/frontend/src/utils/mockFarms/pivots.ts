const createDate = () => {
  const date = Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  return date;
};

export const pivots = [
  {
    pivot_id: "1",
    node_id: "1",
    pivot_name: "pivot_1",
    pivot_lng: -20.2333,
    pivot_lat: -46.2333,
    pivot_start_angle: 0,
    pivot_end_angle: 180,
    pivot_radius: 45,
    last_communication: createDate(),
    radio_id: 1,
  },
  {
    pivot_id: "2",
    node_id: "2",
    pivot_name: "pivot_2",
    pivot_lng: -20.2333,
    pivot_lat: -46.2333,
    pivot_start_angle: 0,
    pivot_end_angle: 180,
    pivot_radius: 45,
    last_communication: createDate(),
    radio_id: 2,
  },
  {
    pivot_id: "3",
    node_id: "3",
    pivot_name: "pivot_3",
    pivot_lng: -20.2333,
    pivot_lat: -46.2333,
    pivot_start_angle: 0,
    pivot_end_angle: 180,
    pivot_radius: 45,
    last_communication: createDate(),
    radio_id: 3,
  },
  {
    pivot_id: "4",
    node_id: "4",
    pivot_name: "pivot_4",
    pivot_lng: -20.2333,
    pivot_lat: -46.2333,
    pivot_start_angle: 0,
    pivot_end_angle: 180,
    pivot_radius: 45,
    last_communication: createDate(),
    radio_id: 4,
  },
];
