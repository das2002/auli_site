import React from 'react';

const ConfirmationPage = ({ onConfirm }) => {
  return (
    <div className="confirmation-page">
      <h1>Get Started</h1>
      <p>Please read these instructions.</p>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
};

export default ConfirmationPage;
