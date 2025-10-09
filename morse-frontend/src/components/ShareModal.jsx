import React, { useState } from 'react';

const API_BASE = "http://localhost:5000";

export default function ShareModal({ file, token, onClose, subject, message_body }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      setStatus('Recipient email is required');
      return;
    }

    setStatus('Sending email...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient_email', recipientEmail);
    formData.append('subject', subject);
    formData.append('message_body', message_body);

    try {
      const res = await fetch(`${API_BASE}/api/share-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('Email sent successfully!');
        setTimeout(onClose, 1500);
      } else {
        setStatus(data.error || 'Failed to send email.');
      }
    } catch (err) {
      console.error(err);
      setStatus('A server error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Share File via Email</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Recipient's Email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div className='text-center'>
            <p>File to be sent: {file.name}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            className="px-6 py-2 font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            Send Email
          </button>
        </div>
        {status && <p className="mt-4 text-center text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}