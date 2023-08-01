import React, { useState, useRef, useId } from "react";
import { Fragment } from "react";

const FormatJson = ({ classNames, devices, curr }) => {
  // const [ky, setky] = useState('');
  // const [val, setVal] = useState({});
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [valueValue, setValueValue] = useState('');
  const [original, setOriginal] = useState(null);
  const [text, setText] = useState('');
  // const passwordHintId = useId();
  // const inputRef = useRef(null);
  // const [edit, setEdit] = useState(false);
  // const [currId, setCurrId] = useState('');

  function handleChange(e) {
    e.preventDefault();
    console.log(e.target.id);
    for (const [keyA, valueA] of Object.entries(devices[curr].jsondata)) {
      if(e.target.id === valueA.label) {
        console.log('matched label: ', e.target.value);
  
      }
    }
  }



  let count = 0;
  const displayCard = (firstData, i) => {
    try {
      let data;

      if (i === 0) {
        // setOriginal(firstData);
        data = Object.entries(firstData);
      } else {
        data = firstData;
      }

      if(original !== undefined) {
        count += 1;
        return (
          <>
            <div className="p-5">
              {data.length === i
                ? null
                : data.map((val, index) => (
                    <>
                      <div key={val[1].description} className="p-2.5">
                        {val[1].access === "rw" ? (
                          <>
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              {val[1].label}
                            </h2>
                            <p className="p-2.5 text-sm leading-6 text-gray-600">
                              {val[1].description}
                            </p>
  
                            {typeof val[1].value === "object" ? (
                              <>
                                <>
                                  {Array.isArray(val[1].value) ? (
                                    <>
                                      {val[1].value.map((item) => (
                                        <p className="p-2.5 text-base leading-6 text-blue-500">
                                          {item}
                                        </p>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {displayCard(
                                        Object.entries(val[1].value),
                                        i + 1
                                      )}
                                    </>
                                  )}
                                </>
                              </>
                            ) : typeof val[1].value === "string" ||
                              typeof val[1].value === "number" ? (
                              <>
                                <input
                                  type="text"
                                  id={val[1].label}
                                  value={val[1].value}
                                  onChange={(e) => val[1].value = e.target.value}
                                  placeholder={val[1].value}
                                  className="m-1 block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </>
                            ) : (

                              typeof val[1].value
                            )}
  
                            {val[1].options !== undefined ? (
                              <>
                                <label className="mt-3.5 block text-base font-medium leading-6 text-gray-900">
                                  Options:
                                </label>
                                {val[1].options.map((opt) => (
                                  <p className="p-1.5 text-sm leading-6 text-blue-500">
                                    {opt}
                                  </p>
                                ))}
                              </>
                            ) : null}
  
                            {val[1].range !== undefined ? (
                              <>
                                <label className="mt-3.5 block text-base font-medium leading-6 text-gray-900">
                                  Range:
                                </label>
                                {Object.entries(val[1].range).map((rng, idx) => (
                                  <>
                                    <label
                                      htmlFor="last-name"
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      {rng[0]}
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        id={rng[0]}
                                        onChange={handleChange}
                                        placeholder={rng[1]}
                                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                      />
                                    </div>
                                  </>
                                ))}
                              </>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    </>
                  ))}
            </div>
          </>
        );
      }

      // if ( !doOnce) {
      //   if (data.length - 10 === i) {
      //     console.log("reached end of entires");
      //     return;
      //   } else {
      //     for (const [keyA, valueA] of Object.entries(data)) {
      //       if (valueA[1].access === "rw") {
      //         console.log(valueA[1]);
      //         console.log(
      //           `
      //           LABEL: ${valueA[1].label}
      //           DESCRIPTION: ${valueA[1].description}
      //           VALUE FEILD TYPE: ${typeof valueA[1].value}
      //           `
      //         );
      //         switch (typeof valueA[1].value) {
      //           case "object":
      //             console.log("object:", valueA[1].value);
      //             displayCard(Object.entries(devices[curr].valuesinfo), i + 1, true);

      //             break;
      //           case "string":
      //             console.log("string:", valueA[1].value);
      //             break;
      //           case "number":
      //             console.log("number:", valueA[1].value);
      //             break;
      //           default:
      //             console.log("not string, num, obj");
      //             break;
      //         }
      //       } else {
      //         console.log(`READ ONLY: ${valueA[1].label}`);
      //       }
      //     }
      //   }
      //   console.log(i);
      // } else {
    } catch (err) {
      console.log("display card err: ", err);
    }
  };

  // -----------------------------------------------------------------------------------------------

  const Thing = (data) => {
    
    try {
      return <>{displayCard(devices[curr].jsondata, 0)}</>;
    } catch (err) {
      console.log("thing err: ", err);
    }
  };

  // ------------------------------------------------------------------------------------------------

  console.log(text);

  return (
    <>
      <div className="divide-y divide-gray-200">
        <Thing />
      </div>
    </>
  );
};

export default FormatJson;

// const ItemHead = (head) => {
//   return (
//     <>
//       <h2 className="text-base font-semibold leading-7 text-gray-900">
//         {head}
//       </h2>
//     </>
//   );
// };

// const DisplayInfo = () => {
//   try {
//     console.log(devices[0].keysinfo);
//     console.log(devices[0].jsondata);

//     return (
//       <>
//         {devices[curr].valuesinfo.map((item) => (
//           <div key={item.label}>
//             {item.access === 'rw' ? (
//                 <p>{item.label}</p>
//             ) : (
//               null
//             )}
//           </div>
//         ))}
//       </>
//     );
//   } catch (error) {
//     console.log("display err: ", error);
//   }
// };

// return (
//   <>
//     {/* {devices.forEach((device) => (
//       device.map((val, index) => (
//       <div key={index}>
//         val
//       </div>
//     ))))} */}
//     {devices[curr].valuesinfo.map((item) => (
//       <div key={item.label}>
//         {item.access === "rw" ? (
//           <>
//             <div key={item.label} className="p-5">
//               <div className="p-2.5">
//                 <h2 className="text-base font-semibold leading-7 text-gray-900">
//                   {item.label}
//                 </h2>
// <p className="p-2.5 text-sm leading-6 text-gray-600">
//   {item.description}
// </p>
//                 {item.options === undefined ? (
//                   <>
//                     {Object.keys(item.value) < 1 ||
//                     typeof item.value === "string" ? (
//                       <>
//                         <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 sm:max-w-md">
//                           <input
//                             type="text"
//                             name={`${item.name}`}
//                             id={`${item.name}`}
//                             className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                             placeholder={item.value}
//                           />
//                         </div>
//                       </>
//                     ) : (
//                       <>

//                       </>
//                     )}
//                     {/* <div className="mt-2">
//                   <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 sm:max-w-md">
//                     <input
//                       type="text"
//                       name={`${item.name}`}
//                       id={`${item.name}`}
//                       className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                       placeholder={item.value}
//                     />
//                   </div>
//                 </div> */}
//                   </>
//                 ) : (
//                   <>
//                     <label className="block text-sm font-medium leading-6 text-gray-900">
//                       Current option: {item.value}
//                     </label>
//                     {item.options.map((option, index) => (
//                       <button
//                         key={option}
//                         className="py-2 px-4 mr-2 rounded-md shadow-sm ring-1 ring-inset ring-gray-300"
//                       >
//                         {option}
//                       </button>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : null}
//       </div>
//     ))}
//   </>
// );

/* <Menu as="div" className="relative inline-block text-left">
// <div>
//   <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
//     Options
//     <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
//   </Menu.Button>
// </div>

<Transition
  as={Fragment}
  enter="transition ease-out duration-100"
  enterFrom="transform opacity-0 scale-95"
  enterTo="transform opacity-100 scale-100"
  leave="transition ease-in duration-75"
  leaveFrom="transform opacity-100 scale-100"
  leaveTo="transform opacity-0 scale-95"
>
  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    <div className="py-1">
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            Account settings
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            Support
          </a>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block px-4 py-2 text-sm'
            )}
          >
            License
          </a>
        )}
      </Menu.Item>
      <form method="POST" action="#">
        <Menu.Item>
          {({ active }) => (
            <button
              type="submit"
              className={classNames(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block w-full px-4 py-2 text-left text-sm'
              )}
            >
              Sign out
            </button>
          )}
        </Menu.Item>
      </form>
    </div>
  </Menu.Items>
</Transition>
</Menu> */
