import { useParams, useNavigate } from 'react-router-dom';

const Devices = ({devices}) => {
  const { deviceName } = useParams();
  const navigate = useNavigate();

  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);

  // Check if the device was found
  if (!thisDevice) {
    return <div>Device not found</div>;
  }

  const handleRegisterInterface = () => {
    navigate(`/devices/${deviceName}/register-interface`);
  };

  console.log('Device:', thisDevice)
  return (
    <div>
      <h1>Device: {JSON.stringify(thisDevice)}</h1>
      {/* Device details and logic */}
      <button onClick={handleRegisterInterface}
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}>
        <span>+</span>
      </button>
    </div>
  );
};

export default Devices;