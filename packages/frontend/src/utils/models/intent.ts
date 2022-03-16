type Intent ={
  power: boolean,
  water: boolean,
  direction: 'CLOCKWISE'|'ANTI_CLOCKWISE',
  percentimeter: number,

  /////deletar daqui para baixo
  connection: boolean,
  angle: number,
  timestamp:number
}
export default Intent;
