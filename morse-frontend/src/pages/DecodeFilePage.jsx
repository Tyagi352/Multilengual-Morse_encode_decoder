import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DecodeFile from '../components/DecodeFile';

const DecodeFilePage = () => {
  const { token, setToken } = useOutletContext() || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Decode File</h1>
      <DecodeFile token={token} setToken={setToken} />
    </div>
  );
};

export default DecodeFilePage;
