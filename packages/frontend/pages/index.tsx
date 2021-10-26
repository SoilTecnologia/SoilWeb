import React, { useState, useEffect } from 'react';
import withAuth from '../lib/withAuth';
import Header from '../components/Header';
import Axios from 'axios';
import Link from 'next/link';

const index = () => {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await Axios.get('http://localhost:3308/farm/readAll', {
        headers: {
          authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjg1Mzc1NjktZmI5NC00NjVjLWIxMDItM2JlN2QyNWQ4MmE3IiwidXNlcl90eXBlIjoiU1VETyIsImlhdCI6MTYzNTI3MTQ1MiwiZXhwIjoxNjM1Mjc4NjUyfQ.V8ztVFZgPNy9oaaI1YLwzmYHrS3dUB74RwbYOjyBkZw'
        }
      });

      let newFarms = [];
      for (let farmUser of response.data) {
        newFarms.push({
          farm_id: farmUser.farm.farm_id,
          farm_name: farmUser.farm.farm_name,
          city: farmUser.farm.city
        });
      }

      setFarms(newFarms);
      console.log('setada!');
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header>
        <h4>FAZENDAS</h4>
      </Header>

      {farms.map(({ farm_id, farm_name, city }) => (
        <Farm
          farm_id={farm_id}
          farm_name={farm_name}
          city={city}
        />
      ))}
    </div>
  );
};

export default withAuth(index);

const Farm = ({
  farm_id,
  farm_name,
  city,
}: {
  farm_id: String;
  farm_name: String;
  city: String;
}) => {
  return (
    <div className="bg-primary font-sans rounded-md text-xl text-white flex p-8 m-16">
      <div className="flex-col flex-grow">
        <h4>Fazenda: {farm_name}</h4>
        <h4>Cidade: {city}</h4>
      </div>
      <Link href={`/farm/pivot-list/${farm_id}`}>
        <button className="text-2xl">ENTRAR</button>
      </Link>
    </div>
  );
};
