import { useParams } from 'react-router-dom';

const Devices = ({devices}) => {
  const { deviceName } = useParams();

  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);

  // Check if the device was found
  if (!thisDevice) {
    return <div>Device not found</div>;
  }

  return (
    <div>
      <h1>Device: {JSON.stringify(thisDevice)}</h1>
      {/* Device details and logic */}
    </div>
  );
};

export default Devices;