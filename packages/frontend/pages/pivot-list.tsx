import React from 'react';
import type { NextPage } from 'next';
import Header from '../components/Header';

const Home2: NextPage = () => {
  return (
    <div>
      <Header>
        <h4>PIVÔS</h4>
      </Header>
      <div className="flex m-4">
        <button className="bg-primary h-16 m-8 flex-1 rounded-lg font-sans text-white font-semibold">
          Fazendas
        </button>
        <button className="bg-primary h-16 m-8 flex-1 rounded-lg font-sans text-white font-semibold">
          Mapa
        </button>
      </div>

      <div className="flex">
        <div className="bg-primary flex-1 m-6 h-auto rounded-lg text-center p-4">
          <h4 className="bg-secondary rounded-lg p-4">Pivô 1</h4>
          <h2 className="text-white m-4">Ligado</h2>
          <div className="grid grid-cols-3 text-white">
            <div>
              <p>Sentido:</p>
              <img className="p-8" src="https://www.imagensempng.com.br/wp-content/uploads/2020/12/Seta-Brush-Png-1024x1024.png"></img>
            </div>
            <div>
              <p>Água:</p>
              <img className="p-8" src="https://www.imagensempng.com.br/wp-content/uploads/2020/12/Seta-Brush-Png-1024x1024.png"></img>
            </div>
            <div>
              <p>Percentímetro:</p>
              <div className="h-full">99</div>
            </div>
            <div>
              <p>Voltagem:</p>
              <span>0</span>
            </div>
            <div></div>
            <div>
              <p>Pressão:</p>
              <span>0</span>
            </div>
            <div>
              <p>RSSI:</p>
              <span>-73</span>
            </div>
            <div></div>
            <div>
              <p>Rank:</p>
              <span>0</span>
            </div>
            <div className="col-span-3">
              <p>IPV6:</p>
              <span>00:00:5e:00:53:af</span>
            </div>
          </div>
        </div>
        <div className="bg-primary flex-1 m-6 h-80 rounded-lg"></div>
      </div>
    </div>
  );
};

export default Home2;
