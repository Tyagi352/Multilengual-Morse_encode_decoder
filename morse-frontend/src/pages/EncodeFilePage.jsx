import React from 'react';
import { useOutletContext } from 'react-router-dom';
import EncodeFile from '../components/EncodeFile';

const EncodeFilePage = () => {
  // receive token & setToken from DashboardPage outlet context
  const { token, setToken } = useOutletContext() || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Encode File</h1>
      <EncodeFile token={token} setToken={setToken} />
    </div>
  );
};

export default EncodeFilePage;
