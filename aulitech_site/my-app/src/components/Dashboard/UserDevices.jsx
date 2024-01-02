import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function UserDevices({ devices }) {
  console.log("devices", devices);
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  
  const noDevices = (
    <>
      <div>
        <div className="rounded-md w-full bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-500">
                No Devices Registered
              </h3>
              <div className="text-sm text-blue-500">
                <p>
                  Go to <strong>+ Register Device</strong> page to register your Cato Devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const listDevices = (
    <>
      <div>
        <p className="text-lg font-semibold leading-6 text-gray-900 pb-4">
          My Devices
        </p>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {devices.map((device) => (
          <li
            key={device.data.device_info.device_nickname}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
          >
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-xl font-medium text-gray-900">
                    {device.data.device_info.device_nickname}
                  </h3>
                </div>
                <p className="mt-1 truncate text-lg text-gray-500">
                  {/* {device.jsondata.operation_mode.value} */}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
  const HandleDisplay = () => {
    try {
      if (devices === "undefined") {
      } else if (devices.length === 0) {
        return noDevices;
      } else {
        return listDevices;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex-1">
        <HandleDisplay />
        {/* logout */}
        <button
          onClick={handleLogout}
          className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );  
}
