import React, { useState } from "react";
import get from "lodash.get";
import set from "lodash.set";
import OptionsDropdwn from "./OptionsDropdwn";

export default function FlattenJson({ classNames, devices, curr }) {
  let thing = [];


  // let tester = []

  // const setUpJsonArr = (deviceJson) => {
  //   for (const [key, value] of Object.entries(deviceJson)) {
  //     let test;
  //     let children = []
  //     if (value.access === "rw") {
  //       if(typeof(value.value) === 'object') {

  //           for (const [key, value] of Object.entries(value.value)) {
  //             children.push({child: key})
  //           }
  //       }
  //         test = Object.create(
  //           {},
  //           {
  //             item: { value: { parent: key, children: children, pathstr: [] } },
  //           }
  //         );
  //         tester.push(test);
  //       }
      
  //   }
  // }


  const breakDownJson = (deviceJson, i, preStr, preKey, first) => {
    let path = "";
    let valPath = "";
    let mainKey = "";

    if (first) {
      thing = [];

      // setUpJsonArr(deviceJson)
      // console.log("tester: ", tester);
      for (const [key, value] of Object.entries(deviceJson)) {
        let test;
        if (value.access === "rw") {
          if(typeof(value.value) === 'object') {

          }
          test = Object.create(
            {},
            {
              item: { value: { key: key, pathstr: [] } },
            }
          );
          thing.push(test);
        }
      }
    }

    try {
      if (devices[curr].jsondata.length - 10 === i) {
        console.log("REACHED END OF ENTRIES");
      } else {
        for (const [key, value] of Object.entries(deviceJson)) {
          if (value.access === "rw") {
            if (preStr === "") {
              valPath = `${key}.value`;
              path = `${key}`;
              mainKey = `${key}`;
            } else {
              valPath = `${preStr}.${key}.value`;
              path = `${preStr}.${key}`;
              mainKey = `${preKey}`;
            }
            if (typeof value.value === "object") {

              if (Array.isArray(value.value)) {
                addItems(mainKey, path, valPath);
              }
              breakDownJson(value.value, i + 1, valPath, mainKey, false);
            } else {
              addItems(mainKey, path, valPath);
            }
          }
        }
      }
    } catch (err) {
      console.log("breakdownjson err: ", err);
    }
  };

  const addItems = (mainKey, path, valPath) => {
    let depthOne = false;
    if (path === mainKey) {
      depthOne = true;
    }

    thing.forEach((item) => {
      if (item.item.key === mainKey) {
        item.item.pathstr.push({
          path: path,
          valPath: valPath,
          depthOne: depthOne,
        });
      }
    });
  };

  const handleOptSelect = (opt) => {
    if (typeof opt === "number") {
      // set(devices[curr].jsondata, e.target.id, +opt)
      console.log(opt);
    } else {
      // set(devices[curr].jsondata, e.target.id, e.target.value)
      console.log(opt);
    }
  };

  const handleInput = (e) => {
    e.preventDefault();
    if (typeof get(devices[curr].jsondata, e.target.id) === "number") {
      set(devices[curr].jsondata, e.target.id, +e.target.value);
    } else {
      set(devices[curr].jsondata, e.target.id, e.target.value);
    }
    console.log(devices[curr].jsondata);
  };

  // const Range = (deviceJson, pthInfo) => {
  //   console.log(pthInfo)
  //   return (
  //     <>
  //       <div className="pt-2.5">
  //         <p className="pt-2.5 text-base leading-6 text-gray-600">
  //           {`Max: ${get(deviceJson, pthInfo.path).label} Min: ${get(deviceJson, pthInfo.path)}` }
  //         </p>
  //         <input
  //           type="text"
  //           id={pthInfo.valPath}
  //           onInput={handleInput}
  //           placeholder={get(deviceJson, pthInfo.valPath)}
  //           className="m-1 block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
  //         />
  //       </div>
  //       <p className="text-pink-500">RANGE</p>
  //     </>
  //   );
  // };

  const Display = () => {
    try {
      const deviceJson = devices[curr].jsondata;
      breakDownJson(deviceJson, 0, "", "", true);
      console.log(devices[curr].jsondata);
      console.log(thing);

      return (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 divide-y divide-gray-200">
            {thing.map((item, index) => (
              <div key={index}>
                <h2 className="pt-10 text-2xl font-semibold leading-7 text-gray-900">
                  {get(deviceJson, item.item.key).label}
                </h2>
                <p className="pt-2.5 text-lg leading-6 text-gray-600">
                  {get(deviceJson, item.item.key).description}
                </p>
                {item.item.pathstr.map((pthInfo, index) => (
                  <div key={index} className="p-5">
                    {pthInfo.depthOne ? null : (
                      <>
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">
                          {get(deviceJson, pthInfo.path).label}
                        </h2>
                        <p className="pt-2.5 text-base leading-6 text-gray-600">
                          {get(deviceJson, pthInfo.path).description}
                        </p>
                      </>
                    )}
                    {get(deviceJson, pthInfo.path).options !== undefined ? (
                      <>
                        <OptionsDropdwn
                          classNames={classNames}
                          current={get(deviceJson, pthInfo.valPath)}
                          options={get(deviceJson, pthInfo.path).options}
                          handleOptSelect={handleOptSelect}
                        />
                      </>
                    ) : get(deviceJson, pthInfo.path).range !== undefined ? (
                      <>
                        <div className="pt-2.5">
                          <p className="pt-2.5 text-base leading-6 text-blue-500">
                            <strong>Range : </strong>
                            {`${get(deviceJson, pthInfo.path).range.max} - ${
                              get(deviceJson, pthInfo.path).range.min
                            }`}
                          </p>
                          <input
                            type="text"
                            id={pthInfo.valPath}
                            onInput={handleInput}
                            placeholder={get(deviceJson, pthInfo.valPath)}
                            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base sm:leading-6"
                          />
                        </div>
                      </>
                    ) : Array.isArray(get(deviceJson, pthInfo.valPath)) ? (
                      <>
                        <OptionsDropdwn
                          classNames={classNames}
                          current={'Select'}
                          options={get(deviceJson, pthInfo.valPath)}
                          handleOptSelect={handleOptSelect}
                        />
                      </>
                    ) : (
                      <>
                        <div className="pt-2.5">
                          <input
                            type="text"
                            id={pthInfo.valPath}
                            onInput={handleInput}
                            placeholder={get(deviceJson, pthInfo.valPath)}
                            className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base sm:leading-6"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      );
    } catch (err) {
      console.log("display err: ", err);
    }
  };

  return (
    <div>
      <Display />
    </div>
  );
}
