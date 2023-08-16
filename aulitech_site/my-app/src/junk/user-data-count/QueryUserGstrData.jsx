import React, { useState } from "react";
import { collection, query, where, getDocs, limit, getCountFromServer } from "firebase/firestore";
import { db } from "../../firebase";
import DropdownBtn from "./DropdownBtn";

const QueryUserGstrData = ({classNames, user}) => {
  const [nodUpCount, setNodUpCount] = useState(0);
  const [nodDownCount, setNodDownCount] = useState(0);
  const [nodRightCount, setNodRightCount] = useState(0);
  const [nodLeftCount, setNodLeftCount] = useState(0);
  const [tiltRightCount, setTiltRightCount] = useState(0);
  const [tiltLeftCount, setTiltLeftCount] = useState(0);
  const [shakeVerticalCount, setShakeVerticalCount] = useState(0);
  const [shakeHorizontalCount, setShakeHorizontalCount] = useState(0);
  const [clockwiseCount, setClockwiseCount]  = useState(0);
  const [counterclockwiseCount, setCounterclockwiseCount] = useState(0);

  const getUserGestureData = async function() {
    let gestureCounts = [
      {name: 'Select', count: 0},
      {name: 'Nod up', count: 0},
      {name: 'Nod down', count: 0},
      {name: 'Nod right', count: 0},
      {name: 'Nod left', count: 0},
      {name: 'Tilt right', count: 0},
      {name: 'Tilt left', count: 0},
      {name: 'Shake vertical', count: 0},
      {name: 'Shake horizontal', count: 0},
      {name: 'Circle clockwise', count: 0},
      {name: 'Circle counterclockwise', count: 0},
     ];
      try{
          const dataRef = collection(db, "gesture-data");

          const userDataQuery = query(dataRef, where("useruid", "==", user.uid));
          const  countSnapshot = await getCountFromServer(userDataQuery);

          if (countSnapshot.data().count !== 0) {
            console.log("Count > 0")
            const queryTest = query(dataRef, where("useruid", "==", user.uid), limit(countSnapshot.data().count))
            const getTest = await getDocs(queryTest);

            if(getTest !== null) {
              getTest.forEach((doc) => {

                switch (doc.data().gesture) {
                  case 'Select':
                    return null;
                  case 'Nod up':
                    gestureCounts[1].count += 1;
                    break;
                  case 'Nod down':
                    gestureCounts[2].count += 1;
                    break;
                  case 'Nod right':
                    gestureCounts[3].count += 1;
                    break;
                  case 'Nod left':
                    gestureCounts[4].count += 1;
                    break;
                  case 'Tilt right':
                    gestureCounts[5].count += 1;
                    break;
                  case 'Tilt left':
                    gestureCounts[6].count += 1;
                    break;
                  case 'Shake vertical':
                    gestureCounts[7].count += 1;
                    break;
                  case 'Shake horizontal':
                    gestureCounts[8].count += 1;
                    break;
                  case 'Circle clockwise':
                    gestureCounts[9].count += 1;
                    break;
                  case 'Circle counterclockwise':
                    gestureCounts[10].count += 1;
                    break;
                  default:
                    console.log("switch error")
                }
                setGestureCounts(gestureCounts)
              })
            } else {
              console.log(getTest);
            }
        }
      }
      catch(error) {
        console.log("guery gesture-data collection error:", error);
      }
  };

  const setGestureCounts = (countArr) => {
    if (countArr !== null) {
      return (
        countArr.forEach((gesture) => {
          switch (gesture.name) {
            case 'Select':
              return null;
            case 'Nod up':
              setNodUpCount(countArr[1].count);
              break;
            case 'Nod down':
              setNodDownCount(countArr[2].count);
              break;
            case 'Nod right':
              setNodRightCount(countArr[3].count);
              break;
            case 'Nod left':
              setNodLeftCount(countArr[4].count);
              break;
            case 'Tilt right':
              setTiltRightCount(countArr[5].count);
              break;
            case 'Tilt left':
              setTiltLeftCount(countArr[6].count);
              break;
            case 'Shake vertical':
              setShakeVerticalCount(countArr[7].count);
              break;
            case 'Shake horizontal':
              setShakeHorizontalCount(countArr[8].count);
              break;
            case 'Circle clockwise':
              setClockwiseCount(countArr[9].count);
              break;
            case 'Circle counterclockwise':
              setCounterclockwiseCount(countArr[10].count);
              break;
            default:
              console.log("switch error");
          };
        })
      )
    }
  }


  const DisplayGestureCounts = (count) => {
    try{
      getUserGestureData();
  
     return(
      <tbody className="divide-y divide-gray-200 bg-white">
            {gestures.map((gesture) => (
              <tr key={gesture.name}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  {gesture.name}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only"></dt>
                    <dd className="mt-1 truncate text-gray-700">{gesture.count} / 5</dd>
                    <dt className="sr-only sm:hidden"></dt>
                    <dd className="mt-1 truncate text-gray-500 sm:hidden">Action</dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{gesture.count} / 5</td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  <DropdownBtn classNames={classNames}/>
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                {gesture.count >= 5 ? 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  <span className="sr-only">, {gesture.name}</span>
                </svg>
                :
                <span className="sr-only">, {gesture.name}</span>
                }
                </td>
              </tr>
            ))}
          </tbody>
     )
    // console.log(count);

    // return (
    //   <>
    //   {count.count >= 1?
    //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center text-blue-500">
    //     <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    //     </svg>
    // : null}
    //   </>
    // )
    }
    catch(error) {
      console.log("display gesture counts error:", error);
    }
  }

  const gestures = [
    {name: 'Nod up', count: nodUpCount},
    {name: 'Nod down', count: nodDownCount},
    {name: 'Nod right', count: nodRightCount},
    {name: 'Nod left', count: nodLeftCount},
    {name: 'Tilt right', count: tiltRightCount},
    {name: 'Tilt left', count: tiltLeftCount},
    {name: 'Shake vertical', count: shakeVerticalCount},
    {name: 'Shake horizontal', count: shakeHorizontalCount},
    {name: 'Circle clockwise', count: clockwiseCount},
    {name: 'Circle counterclockwise', count: counterclockwiseCount},
   ];

  // return (
  //   <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  //     {gestures.map((gest) => (
  //       <li key={gest.name} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
  //         <div className="flex w-full items-center justify-between space-x-6 p-6">
  //           <div className="flex-1 truncate">
  //             <div className="flex items-center space-x-3">
  //               <h3 className="truncate text-sm font-medium text-gray-900">{gest.name}</h3>
  //               <DisplayGestureCounts count={gest.count}/>
  //             </div>
  //             <p className="mt-1 truncate text-sm text-gray-500">
                
  //             </p>
  //           </div>
  //         </div>
  //         <div>
  //           <div className="-mt-px flex divide-x divide-gray-200">
  //             <div className="flex w-0 flex-1">
  //               <p
  //                 className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
  //               >
  //                 {gest.count} / 5
  //               </p>
  //             </div>
  //             <div className="-ml-px flex w-0 flex-1">
  //               {/* <p
  //                 className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
  //               >
                  
  //               </p> */}
  //             </div>
  //           </div>
  //         </div>
  //       </li>
  //     ))}
  //   </ul>
  // )

  return (
    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">

    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Gesture Training Status</h1>
        </div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Status 
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Action
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <DisplayGestureCounts/>
        </table>
      </div>
      </div>
    </div>
  )
}

export default QueryUserGstrData;