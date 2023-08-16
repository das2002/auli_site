import React, { useState } from "react";
import get from "lodash.get";
import set from "lodash.set";

export default function FlattenJson({ classNames, devices, curr }) {
  let data = [];
  let thing = [];

  const breakDownJson = (deviceJson, i, preStr, preKey, first) => {
    let path = "";
    let valPath = "";
    let mainKey = "";
    let options = false;

    if (first) {
      data = [];
      thing = [];
      // console.log(deviceJson);

      for (const [key, value] of Object.entries(deviceJson)) {
        if (value.access === "rw") {
          const test = Object.create(
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
      if (deviceJson.length - 10 === i) {
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

            if(value.options !== undefined) {
              options = true;
            }

            if (typeof value.value === "object") {
              breakDownJson(value.value, i + 1, valPath, mainKey, false);
            } else {
              data.push({ mainKey: mainKey, path: path, valPath: valPath });

              addItems(mainKey, path, valPath, options);
            }
          }
        }
      }
    } catch (err) {
      console.log("breakdownjson err: ", err);
    }
  };

  const addItems = (mainKey, path, valPath, options) => {
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
          options: options
        });
      }
    });
  };

  const handleInput = (e) => {
    e.preventDefault();
    if (typeof(get(devices[curr].jsondata, e.target.id)) === "number") {
      set(devices[curr].jsondata, e.target.id, +e.target.value)
    } else {
      set(devices[curr].jsondata, e.target.id, e.target.value)
    }
    console.log(devices[curr].jsondata);
  };

  const Display = () => {
    try {
      const deviceJson = devices[curr].jsondata;
      breakDownJson(deviceJson, 0, "", "", true);

      return (
        <>
          {thing.map((item, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                {get(deviceJson, item.item.key).label}
              </h2>
              <p className="pt-2.5 text-base leading-6 text-gray-600">
                {get(deviceJson, item.item.key).description}
              </p>
              {item.item.pathstr.map((pthInfo, index) => (
                <div key={index} className="p-5">
                  {pthInfo.depthOne ? null : (
                    <>
                      <h2 className="text-lg font-semibold leading-7 text-gray-900">
                        {get(deviceJson, pthInfo.path).label}
                      </h2>
                      <p className="pt-2.5 text-base leading-6 text-gray-600">
                        {get(deviceJson, pthInfo.path).description}
                      </p>
                    </>
                  )}
                  {pthInfo.options ? 
                  <>

                  </>
                :
                
                <>
                </>}
                  <div className="pt-2.5">
                    <input
                      type="text"
                      id={pthInfo.valPath}
                      onInput={handleInput}
                      placeholder={get(deviceJson, pthInfo.valPath)}
                      className="m-1 block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      );
    } catch (err) {
      console.log("display err: ", err);
    }
  };

  return (
    <>
      <Display />
    </>
  );
}
