import React, {useState} from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import OperationModeSet from "./OperationModeSet";
import ScrnSizeSet from "./ScrnSizeSet";

const CatoSettings = ({classNames, user}) => {
  const [catoConfig, setCatoConfig] = useState("");
  const [configDocId, setConfigDocId] = useState(null);

  const [catoIdName, setCatoIdName] = useState("name");
  const [opMode, setOpMode] = useState(0);

  const [scrnSizeA, setScrnSizeA] = useState(0);
  const [scrnSizeB, setScrnSizeB] = useState(0);

  const [idleThrs, setIdleThrs] = useState(0);
  const [minCycles, setMinCycles] = useState(0);
  const [idleDur, setIdleDur] = useState(0);
  const [scale, setScale] = useState(0);
  const [slowThrs, setSlowThrs] = useState(0);
  const [fastThrs, setFastThrs] = useState(0);
  const [slowScale, setSlowScale] = useState(0);
  const [fastScale, setFastScale] = useState(0);



  const getCatoSettings = async() => {
    let settingsData;
    let docId;

    try {
      const colRef = collection(db, "users", user.uid, "userCatos");

      const catoIdNameQuery = query(colRef, where("cato_id", "==", catoIdName));
      const docIdSnapshot = await getDocs(catoIdNameQuery);

      docIdSnapshot.forEach((doc) => {
        settingsData = doc.data();
        docId = doc.id;
      })

        handleDocDataIdState(settingsData, docId);
    }
    catch(error) {
      console.log(error);
    }
  }

  const handleDocDataIdState = (docData, docId) => {
    setCatoConfig(docData);
    setConfigDocId(docId)
    setScrnSizeA(catoConfig.screen_size[0]);
    setScrnSizeB(catoConfig.screen_size[1]);
  };

  const HandleHeader = () => {
    getCatoSettings();

    return (
      <>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Cato Settings</h1>
      </>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    OperationModeSet( {user}, configDocId, opMode );
    ScrnSizeSet( {user}, configDocId, scrnSizeA, scrnSizeB);

  }

  

 return (
  <>
    <HandleHeader/>
    <br/>
    <form onSubmit={handleSubmit}>
      <p>
        current operation mode: {catoConfig.operation_mode}
      </p>
      <label>
        operation mode - 
        <select
          value={catoConfig.operation_mode}
          onChange={(e) => setOpMode(e.target.value)}
        >
          <option value={0}> 0 </option>
          <option value={1}> 1 </option>
          <option value={2}> 2 </option>
        </select>
      </label>
      <br/>
      <br/>
      <p>
        current screen size: 
        <br/>
        {scrnSizeA}
        <br/>
        {scrnSizeB}
      </p>
      <label>
        screen size value A - 
        <input
          type="text"
          value={scrnSizeA}
          onChange={(e) => setScrnSizeA(e.target.value)}
        />
      </label>
      <label>
        screen size value B - 
        <input
          type="text"
          value={scrnSizeB}
          onChange={(e) => setScrnSizeB(e.target.value)}
        />
      </label>
      <br/>
      <br/>
      <button
      type="submit"
      className="bg-gray-900 text-white rounded-full p-2"
      >
        save
      </button>
    </form>
  </>
 )
}

export default CatoSettings;