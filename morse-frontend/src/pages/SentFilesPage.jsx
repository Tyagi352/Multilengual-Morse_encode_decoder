import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SharedByMe from '../components/SharedByMe';

const SentFilesPage = () => {
  const { token } = useOutletContext() || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sent Files</h1>
      <SharedByMe token={token} />
    </div>
  );
};

export default SentFilesPage;
