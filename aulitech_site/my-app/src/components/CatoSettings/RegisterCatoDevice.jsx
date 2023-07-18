import React, { useState } from "react";
import { get, set } from "idb-keyval";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

export const defaultConfig = JSON.stringify({
  name: {
    label: "Device Name",
    description:
      "a user-settable string for assigning the name of the Cato device",
    access: "rw",
    value: "Cato_a1b2c3",
  },

  operation_mode: {
    label: "Mode",
    description: "a user-settable integer defining the operation mode of Cato",
    access: "rw",
    value: 0,
    options: [0, 1, 2, 3],
  },

  screen_size: {
    label: "Screen Size",
    description: "structure containing screen height and width in pixels",
    access: "rw",
    value: {
      height: {
        description: "height in pixels",
        access: "rw",
        value: 1920,
        range: {
          min: 600,
          max: 4320,
        },
      },
      width: {
        description: "width in pixels",
        access: "rw",
        value: 1080,
        range: {
          min: 800,
          max: 8192,
        },
      },
    },
  },

  mouse: {
    label: "Mouse",
    description: "structure containing values defining mouse operation",
    access: "rw",
    value: {
      idle_thresh: {
        label: "Mouse Idle Threshold",
        description:
          "Value of move speed below which is considered idle. Causes mouse exit. High number = easier to idle out",
        access: "rw",
        value: 6.0,
        range: {
          min: 3.0,
          max: 12.0,
        },
      },
      min_run_cycles: {
        label: "Minimum Mouse Runtime",
        description:
          "Number of cycles mouse will always run before beginning to check idle condns",
        access: "rw",
        value: 30,
        range: {
          min: 0,
          max: 100,
        },
      },
      idle_duration: {
        label: "Idle timeout cycles",
        description:
          "Number of consecutive cycles for mouse to observe idle behavior before exiting due to idle",
        access: "rw",
        value: 25,
        range: {
          min: 15,
          max: 50,
        },
      },
      scale: {
        label: "Movement Scale Factor",
        description: "Flat multiplier for all mouse movements",
        access: "rw",
        value: 0.8,
        range: {
          min: 0.1,
          max: 4.0,
        },
      },
      dynamic_mouse: {
        label: "Dynamic Mouse",
        description:
          "Settings for mouse acceleration, please see graphic on Cato wiki",
        access: "rw",
        note: "For both input and output, Fast > Slow.",
        value: {
          input: {
            label: "Input",
            description:
              "User movement conditions defining slow and fast head movement for dynamic scaling",
            access: "rw",
            value: {
              slow: {
                label: "Slow",
                description:
                  "Rotation speed floor below which scale remains constant",
                access: "rw",
                value: 15.0,
                range: {
                  min: 0.0,
                  max: 400.0,
                },
              },
              fast: {
                label: "Fast",
                description:
                  "Rotation speed ceiling above which scale remains constant",
                access: "rw",
                value: 160.0,
                range: {
                  min: 0.0,
                  max: 500.0,
                },
              },
            },
          },
          output: {
            label: "Output",
            description:
              "Cursor speed output scaling. Slow when input slow, fast when input fast",
            access: "rw",
            value: {
              slow: {
                label: "Slow",
                description: "Scale factor at (and below) slowest input speed",
                access: "rw",
                value: 0.25,
                range: {
                  min: 0.1,
                  max: 2.0,
                },
              },
              fast: {
                label: "Fast",
                description: "Scale factor at (and above) fastest input speed",
                access: "rw",
                value: 2.5,
                range: {
                  min: 1.0,
                  max: 6.0,
                },
              },
            },
          },
        },
      },
    },
  },

  gesture: {
    label: "Gesture Parameters",
    description: "structure describing gesture collection and cutoff tools",
    access: "r",
    value: {
      key: {
        label: "Gesture Key",
        description:
          "Human-readable field describing Gesture model's names of gestures - indexed",
        access: "rw",
        value: [
          "None",
          "Nod Up",
          "Nod Down",
          "Nod Right",
          "Nod Left",
          "Tilt Right",
          "Tilt Left",
          "Shake Yes",
          "Shake No",
          "Circle CW",
          "Circle CCW",
        ],
      },
      length: {
        label: "Length",
        description: "Number of samples (max) in a gesture to be fed to Neuton",
        access: "r",
        value: 200,
      },
      idle_cutoff: {
        label: "Idle Cutoff",
        description:
          "Number of consecutive idle samples leading to gesture cutoff",
        access: "r",
        value: 20,
      },
      movement_threshold: {
        label: "Movement Threshold",
        description:
          "movement required to start capturing gesture. Startup threshold",
        access: "r",
        value: 500,
      },
      idle_threshold: {
        label: "Idle Threshold",
        description:
          "Value of move speed below which is considered idle - leading to mouse exit. Low number = more stillness to idle out of mouse",
        access: "r",
        value: 30,
      },
      timeout: {
        label: "Timeout",
        description:
          "Maximum Time to Wait for Gesture Start before returning 'noop'",
        access: "r",
        value: 6.0,
      },
      gc_timeout: {
        label: "Gesture Collection Timeout",
        description: "Gesture Collection Startup Delay Timeout",
        access: "r",
        value: 10,
      },
    },
  },

  calibration: {
    label: "Calibration (including automatic) Parameters",
    description:
      "structure containing both current calibration (trim) values and preferences for auto calibration",
    access: "rw",
    value: {
      drift: {
        label: "drift",
        description:
          "x, y, z gyroscope drift per-cycle - used as trim adjustments",
        access: "r",
        value: [0, 0, 0],
      },
      auto_threshold: {
        label: "Auto-Calibration Threshold",
        description:
          "An movement period with variation below this threshold triggers automatic calibration to remove drift",
        access: "rw",
        value: 3.0,
        range: {
          min: 1.0,
          max: 6.0,
        },
      },
      auto_samples: {
        label: "Auto-Calibration Samples Taken",
        description:
          "number of samples to wait (at below auto_threshold) required to trigger auto recalibratoion",
        access: "rw",
        value: 100,
      },
    },
  },

  sleep_threshold: {
    label: "Sleep Threshold",
    description:
      "Movement level below which Cato starts counting towards sleep",
    access: "rw",
    value: 40,
  },

  battery: {
    label: "Battery",
    description:
      "DEV TOOL: analog pin values of high and low battery charge [low, high]",
    access: "r",
    value: {
      low: {
        label: "Low",
        description:
          "Value of analog pin indicating discharged battery. Typ. ~23000",
        access: "r",
        value: 23000,
      },
      high: {
        label: "High",
        description:
          "Value of analog pin indicating charged battery. Typ. ~30000",
        access: "r",
        value: 29000,
      },
    },
  },

  confidence_threshold: {
    label: "Confidence Threshold",
    description:
      "Threshold of gesture confidence probability [0, 1), for Cato to accept gesture and execute command",
    note: "Low value -> few dry-fires, more frequent mistakes. High value -> frequent dry-fires, rare mistakes",
    access: "rw",
    value: 0.65,
    range: {
      min: 0.51,
      max: 0.95,
    },
  },

  bindings: {
    label: "Bindings",
    description: "structure linking gestures to actions in different modes",
    access: "rw",
    action_key: {
      label: "Action Key",
      description: "Human-readable field describing available Cato actions",
      access: "r",
      value: [
        "noop",
        "all_release",
        "_scroll",
        "_scroll_lr",
        "button_action",
        "type_enter_key",
        "type_esc_key",
        "type_meta_key",
        "type_up_key",
        "type_left_key",
        "type_right_key",
        "quick_calibrate",
        "quick_sleep",
      ],
    },

    value: {
      gesture_mouse: {
        label: "Gesture Mouse",
        note: "formerly known as mode 0",
        description:
          "Operation loop: Mouse movement -> Idle -> Gesture -> Action",
        access: "rw",
        value: [
          [["noop"]],
          [["button_action", 0, "tap", 2]],
          [["button_action", 0, "tap", 1]],
          [["_scroll"]],
          [["button_action", 0, "toggle", 1]],
          [["_scroll_lr"]],
          [["_scroll"]],
          [["button_action", 0, "double_tap", 1]],
          [["noop"]],
          [["quick_sleep"]],
          [["quick_sleep"]],
        ],
      },
      tv_remote: {
        label: "TV Remote",
        description: "Operation Loop: Gesture -> (Turbo) Action",
        access: "rw",
        value: [
          [["noop"]],
          [["button_action", 1, "toggle", 82]],
          [["button_action", 1, "toggle", 81]],
          [["button_action", 1, "toggle", 79]],
          [["button_action", 1, "toggle", 80]],
          [["button_action", 1, "tap", 227]],
          [["noop"]],
          [["button_action", 1, "tap", 81]],
          [["button_action", 1, "tap", 81]],
          [["noop"]],
          [["noop"]],
        ],
      },
      Clicker: {
        label: "Clicker",
        description: "Operation Loop: Tap/Double Tap",
        access: "rw",
        value: [
          [["button_action", 0, "tap", 1]],
          [["button_action", 0, "tap", 2]],
        ],
      },
    },
  },

  turbo_rate: {
    label: "Turbo Options",
    description:
      "Options for 'Turbo' (repeated, accelerating button presses until cancelled)",
    access: "rw",
    value: {
      initial: {
        label: "Initial Spacing",
        description: "Initial button-press spacing",
        access: "rw",
        value: 1,
      },
      minimum: {
        label: "Minimum Spacing",
        description: "Minimum (fastest) button press spacings",
        access: "rw",
        value: 0.2,
      },
      decay_rate: {
        label: "Decay Rate",
        description: "Rate (geometric) of time-between-press decay",
        access: "rw",
        value: 0.9,
        range: {
          min: 0.65,
          max: 0.95,
        },
      },
    },
  },
});

const RegisterCatoDevice = ({ user }) => {
  const [deviceName, setDeviceName] = useState("");
  //   const [hwUid, setHwUid] = useState('');

  const navigate = useNavigate();

  const getJsonData = async () => {
    try {
      const directory = await get("directory");
      console.log(directory);

      if (typeof directory !== "undefined") {
        const perm = await directory.requestPermission();

        if (perm === "granted") {
          const jsonHandleOrUndefined = await get("config.json");

          if (jsonHandleOrUndefined) {
            console.log("retrieved file handle:", jsonHandleOrUndefined.name);
          }

          const jsonFile = await directory.getFileHandle("config.json", {
            create: false,
          });

          await set("config.json", jsonFile);
          console.log("stored file handle:", jsonFile.name);

          const jsonDataFile = await jsonFile.getFile();
          const jsonData = await jsonDataFile.text();

          addDeviceDoc(jsonData);
        }
      }
    } catch (error) {
      console.log("get config.json error:", error);
    }
  };

  //   const getHWuid = (jsonData) => {
  //     const parsedJson = JSON.parse(jsonData);
  //     setHwUid(parsedJson.name);
  //   }

  const addDeviceDoc = (jsonData) => {
    // getHWuid(jsonData);

    try {
      const storeDevice = async () => {
        try {
          const colRef = collection(db, "users");
          await addDoc(collection(colRef, user.uid, "userCatos"), {
            // hardwareuid: hwUid,
            devicename: deviceName,
            configjson: jsonData,
          });
        } catch (error) {
          console.log("store another device error: ", error);
        }
      };
      storeDevice();
    } catch (error) {
      console.log("add device doc to usersCato error: ", error);
    }
    navigate('/cato-settings')
  };

  return (
    <>
      <h1>Register Cato Device</h1>

      <div>
        <label>
          Device Name
          <input
            type="text"
            value={deviceName}
            className="bg-gray-100"
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </label>
      </div>
      <button onClick={getJsonData}>get config.json</button>
    </>
  );
};

export default RegisterCatoDevice;
