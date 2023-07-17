import { addDoc, collection, doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

const StoreRegisterData = ({user}) => {
  console.log(user);
  const sendDocRef = async() => {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      uid: user.uid,
      firstname: 'First name',
      lastname: 'Last Name'
    })

    const colRef = collection(db, "users");
    await addDoc(collection(colRef, user.uid, 'userCatos'), {
      cato_id: "name",
      operation_mode: 0,
      screen_size: [
        3840,
        2160
      ],
      mouse: {
        idle_thresh: 6.0,
        min_run_cycles: 30,
        idle_duration: 25,
        scale: 0.8,
        slow_thresh: 15.0,
        fast_thresh: 160.0,
        slow_scale: 0.25,
        fast_scale: 2.4
      },
      gesture : {
        length : 200,
        idle_cutoff : 20,
        movement_threshold : 500,
        idle_threshold : 30,
        timeout : 5,
        gc_timeout : 10
      },
      calibration :{
        drift : [0,0,0],
        auto_samples : 100,
        auto_threshold: 0.5
      },
      sleep_threshold : 40,
      battery : {
        low : 22100,
        high: 30950
      },
      confidence_threshold : 0.65,
      gesture_key : [
        "None",
        "Nod Up",
        "Nod Down",
        "Nod Right",
        "Nod Left",
        "Tilt Right",
        "Tilt Left",
        "Shake Vertical",
        "Shake Horizontal",
        "Circle Clockwise",
        "Circle Counterclockwise"
      ],

      action_key : [
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
          "quick_sleep"
      ],
      turbo_rate : [1, 0.2, 0.9],
      gesture_window : 1.2,
      gesture_length : 75,
      min_gesture_threshold : 200
    })
  }
  return sendDocRef();
}

export default StoreRegisterData;