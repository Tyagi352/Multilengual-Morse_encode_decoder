import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SharedWithMe from '../components/SharedWithMe';

const ReceivedFilesPage = () => {
  const { token } = useOutletContext() || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Received Files</h1>
      <SharedWithMe token={token} />
    </div>
  );
};

export default ReceivedFilesPage;
