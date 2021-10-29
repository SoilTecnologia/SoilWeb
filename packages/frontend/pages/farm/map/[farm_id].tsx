import React, { useState, useEffect, SetStateAction } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../../components/Header';
import withAuth from '../../../lib/withAuth';
import Axios from 'axios';
import {FaClipboardList} from 'react-icons/fa'
import {AiOutlineArrowLeft} from 'react-icons/ai';

const PivotList: NextPage = () => {
  const router = useRouter();
  const [pivots, setPivots] = useState([]);
  const { farm_id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      const response = await Axios.get(
        `http://localhost:3308/pivot/readAll/${farm_id}`
      );

      setPivots(response.data);
    };

    fetchData();
  }, [farm_id]);

  return (
    <div>
      <Header>
        <h4>MAPA</h4>
      </Header>
      <div className="flex justify-between">
        <Link href="/">
          <div className="flex items-center cursor-pointer bg-primary m-8 p-4 w-44 rounded-lg font-sans text-white font-semibold">
            <AiOutlineArrowLeft size="26" color="secondary"/>
          <a className="pl-8">
            Fazendas
          </a>
          </div>
        </Link>
        <Link href={`/farm/pivot-list/${farm_id}`}>
          <div className="items-center inline-block cursor-pointer bg-primary m-8 p-4 w-44 rounded-lg font-sans text-white font-semibold">
            <a className="pr-8">
              Lista
            </a>
            <FaClipboardList size="26" color="secondary" className="float-right"/>
          </div>
        </Link>
      </div>

      <div className="flex flex-wrap justify-evenly">
        {pivots.map((pivot) => (
          <Pivot pivot={pivot} />
        ))}
      </div>
    </div>
  );
};

export default withAuth(PivotList);

type PivotData = {
  pivot_id: string;
  pivot_name: string;
};

type CycleData = {
  power: boolean;
  direction?: 'NULL' | 'CLOCKWISE' | 'ANTICLOCKWISE';
  water?: 'NULL' | 'DRY' | 'WET';
  percentimeter?: number;
  voltage?: number;
  pressure?: number;
};

const Pivot = ({ pivot }: { pivot: PivotData }) => {
  const [inputValue, setInputValue] = useState('00000');
  const [cycleData, setCycleData] = useState<CycleData>({ power: false });

  useEffect(() => {
    const fetchData = async (pivot_id: string) => {
      const response = await Axios.get(
        `http://localhost:3308/cycle/read/${pivot_id}`
      );
      setCycleData(response.data);
    };

    fetchData(pivot.pivot_id);
  }, []);

  const { pivot_id, pivot_name } = pivot;

  return (
    <div className="flex min-w-min">
      <div className="bg-primary m-8 h-auto rounded-lg text-center p-4">
        <h4 className="bg-secondary rounded-lg p-4">Pivô {pivot_name}</h4>
        <h2 className="text-white m-4">
          {cycleData.power ? 'Ligado' : 'Desligado'}
        </h2>

        <div className="grid grid-cols-3 text-white">
          <div>
            <p>Sentido:</p>
            <p>{cycleData.direction}</p>
          </div>
          <div>
            <p>Água:</p>
            <p>{cycleData.water}</p>
          </div>
          <div>
            <p>Percentímetro:</p>
            <div className="h-full">{cycleData.percentimeter}</div>
          </div>
          <div>
            <p>Voltagem:</p>
            <span>{cycleData.voltage}</span>
          </div>
          <div>
            <p>Pressão:</p>
            <span>{cycleData.pressure}</span>
          </div>
          <div>
            <p>RSSI:</p>
            <span>-73</span>
          </div>
          <div>
            <p>Rank:</p>
            <span>0</span>
          </div>
          <div>
            <p>IPV6:</p>
            <span>00:00:5e:00:53:af</span>
          </div>
        </div>

        <h4 className="bg-secondary rounded-lg p-4">Acionar</h4>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              // const response = await Axios.post(
              //   `http://192.168.100.105:3031/cmd?ID=${pivot_name}&intencao=${inputValue}`
              // );
              const response = await Axios.post(
                `http://localhost:3308/raspberry/update/${pivot_name}/${inputValue}`
              );
              console.log(response.data);
            } catch (err) {
              if (err instanceof Error) {
                alert(`Erro na requisição da intenção: ${err.message}`);
              } else {
                alert('Erro desconhecido na requisição da intenção...');
              }
            }
          }}
        >
          <label>Intencão:</label>
          <input
            type="text"
            id="intent"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></input>
          <button type="submit" className="bg-secondary p-2 m-2">
            ENVIAR
          </button>
        </form>
      </div>
    </div>
  );
};
