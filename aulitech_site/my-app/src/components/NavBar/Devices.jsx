import { useParams } from 'react-router-dom';
import BindingsPanel from './Bindings';

const Devices = ({devices}) => {
  const { deviceName } = useParams();

  // Find the specific device
  const thisDevice = devices.find(device => device.data.device_info.device_nickname === deviceName);
  console.log(thisDevice)

  // Check if the device was found
  if (!thisDevice) {
    return <div>Device not found</div>;
  }

  return (
    <div>
      <h1>Device: {deviceName}</h1>
      <BindingsPanel device={deviceName} />
      {/* Device details and logic */}
    </div>
  );
};

export default Devices;