import {
  DirectionState,
  WaterState,
  PowerState,
  ConnectionState,
} from '@prisma/client';

export type StringStatusData =
  `${number}${number}${number}-${number}${number}${number}-${number}${number}${number}-${number}`;

export type StringIntentData =
  `${number}${number}${number}-${number}${number}${number}`;

type PrismaPivotUpdateType = {
  connection: ConnectionState;
  direction: DirectionState;
  water: WaterState;
  power: PowerState;
  percentimeter: number;
  angle: number;
  timestamp: number;
};

type PrismaIntentUpdateType = {
  direction: DirectionState;
  water: WaterState;
  power: PowerState;
  percentimeter: number;
}

export const StatusStringToPrisma = (status: StringStatusData) => {
  let [_, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})-(\d{1})-(\d{1})-(\d{3})-(\d{3})-(\d+)/.exec(status) || [
      '',
      '',
      '',
      '',
      0,
      0,
      0
    ];

  let response: PrismaPivotUpdateType = {
    connection: 'ONLINE',
    direction: 'NULL',
    water: 'NULL',
    power: 'NULL',
    percentimeter: 0,
    angle: 0,
    timestamp: 0
  };

  if (direction == '3') {
    response.direction = 'CLOCKWISE';
  } else if (direction == '4') {
    response.direction = 'ANTI_CLOCKWISE';
  }

  if (water == '5') {
    response.water = 'DRY';
  } else if (water == '6') {
    response.water = 'WET';
  }

  if (power == '1') {
    response.power = 'ON';
  } else if (direction == '2') {
    response.power = 'OFF';
  }

  response.percentimeter = Number(percentimeter);
  response.angle = Number(angle);
  response.timestamp = Number(timestamp);

  return response;
};

export const IntentStringToPrisma = (intent: StringIntentData) => {
  let [_, direction, water, power, percentimeter] =
    /(\d{1})-(\d{1})-(\d{1})-(\d{3})/.exec(intent) || [
      '',
      '',
      '',
      ''
    ];

  let response: PrismaIntentUpdateType = {
    direction: 'NULL',
    water: 'NULL',
    power: 'NULL',
    percentimeter: 0,
  };

  if (direction == '3') {
    response.direction = 'CLOCKWISE';
  } else if (direction == '4') {
    response.direction = 'ANTI_CLOCKWISE';
  }

  if (water == '5') {
    response.water = 'DRY';
  } else if (water == '6') {
    response.water = 'WET';
  }

  if (power == '1') {
    response.power = 'ON';
  } else if (direction == '2') {
    response.power = 'OFF';
  }

  response.percentimeter = Number(percentimeter);

  return response;
};