import React from 'react';
import type { NextPage } from 'next';
import Header from '../components/Header';

const Home2: NextPage = () => {
  return (
    <div>
      <Header>
        <h4>STATUS</h4>
      </Header>
      <div className="flex justify-between">
        <button className="bg-primary m-8 max-w-sm p-4 w-1/2  rounded-lg font-sans text-white font-semibold">
          Pivôs
        </button>
        <button className="bg-primary m-8 max-w-sm p-4 w-1/2 rounded-lg font-sans text-white font-semibold">
          Mapa
        </button>
      </div>

      <div className="flex justify-between">
        <div className="bg-primary m-8 h-auto rounded-lg text-center p-4">
          <h4 className="bg-secondary rounded-lg p-4">Pivô 1</h4>
          <h2 className="text-white m-4">Ligado</h2>

          <div className="grid grid-cols-3 text-white">
            <div>
              <p>Sentido:</p>
              <p>CLOCKWISE</p>
            </div>
            <div>
              <p>Água:</p>
              <p>DRY</p>
            </div>
            <div>
              <p>Percentímetro:</p>
              <div className="h-full">99</div>
            </div>
            <div>
              <p>Voltagem:</p>
              <span>0</span>
            </div>
            <div>
              <p>Pressão:</p>
              <span>0</span>
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

        </div>
      </div>
    </div>
  );
};

export default Home2;
