import React, { useState } from "react";
import get from "lodash.get";
import set from "lodash.set";
import OptionsDropdwn from "./OptionsDropdwn";
import "toolcool-range-slider";
import "toolcool-range-slider/dist/plugins/tcrs-generated-labels.min.js";

export default function FlattenJson({ classNames, devices, curr }) {
  let thing = [];

  // let tester = [];

  // const setUpJsonArr = (first, deviceJson, preKey, parent, children) => {
  //   try {
  //     let test;
  //     let childrenArr = [];
  //     let mainKey = "";
  //     let parentKey = "";

  //     if (first) {
  //       tester = [];

  //       for (const [key, value] of Object.entries(deviceJson)) {
  //         if (value.access === "rw") {

  //         test = Object.create(
  //           {},
  //           {
  //             item: {
  //               value: { mainParent: key, children: [] },
  //             },
  //           }
  //         );
  //         tester.push(test);
  //       }
  //     }
  //     }

  //     for (const [key, value] of Object.entries(deviceJson)) {
  //       if (value.access === "rw") {
  //         if (parent === "") {
  //           mainKey = `${key}`;
  //           parentKey = `${key}`;
  //           // childrenArr = [];
  //         } else {
  //           mainKey = `${preKey}`;
  //           parentKey = `${parent}.value.${key}`;
  //           childrenArr = children
  //         }

  //         if (typeof value.value === "object") {
  //           if (!Array.isArray(value.value)) {
  //             // if (parentKey !== mainKey) {
  //             //   child = Object.create(
  //             //     {},
  //             //     { child: { value: { parent: parentKey, childs: [] } } }
  //             //   );

  //             //   childrenArr.push(child);
  //             // }
  //             childrenArr.push(parentKey)
  //             setUpJsonArr(false, value.value, mainKey, parentKey, childrenArr);
  //           }
  //         } else {
  //           tester.forEach((item) => {
  //             if (item.item.mainParent === mainKey) {
  //               item.item.children.push(childrenArr)
  //             }
  //           });
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     console.log("set up json arr err:", err);
  //   }
  // };

  const breakDownJson = (deviceJson, i, preStr, preKey, first) => {
    let path = "";
    let valPath = "";
    let mainKey = "";

    if (first) {
      thing = [];
      // setUpJsonArr(true, deviceJson, "", "", []);

      for (const [key, value] of Object.entries(deviceJson)) {
        let test;
        if (value.access === "rw") {
          if (typeof value.value === "object") {
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

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const handleOptSelect = (opt, valPath) => {
    if (typeof opt === "number") {
      set(devices[curr].jsondata, valPath, +opt);
      console.log("option num: ", opt);
    } else {
      set(devices[curr].jsondata, valPath, opt);
      console.log("option string: ", opt);
    }
    console.log(devices[curr].jsondata);
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

// --------------------------------------------------------------------------------------------------------------------------------------------------

  const DisplayInput = ({ deviceJson, pthInfo }) => {
    return (
      <div className="pt-2.5 mx-4">
        <input
          type="text"
          id={pthInfo.valPath}
          onInput={handleInput}
          placeholder={get(deviceJson, pthInfo.valPath)}
          className="relative w-full cursor-default border-0 outline-0 placeholder:text-gray-900 rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset sm:text-base sm:leading-6"
        />
      </div>
    );
  };

  const DisplaySlider = ({ deviceJson, pthInfo }) => {
    return (
      <div className="pt-2.5">
        <tc-range-slider
          slider-bg-fill="#111827"
          slider-bg="#e2e8f0"
          slider-height="0.5rem"
          pointer-bg-hover="#fef3ce"
          pointer-bg-focus="#FCDC6D"
          pointer-width="18px"
          pointer-height="18px"
          pointer-radius="100%"
          pointer-border="1px solid #111827"
          pointer-border-hover="1px solid #111827"
          pointer-border-focus="1px solid #fbd03b"
          pointer-shadow="none"
          pointer-shadow-hover="none"
          pointer-shadow-focus="none"
          id={pthInfo.valPath}
          value={get(deviceJson, pthInfo.valPath)}
          onMouseUp={handleInput}
          generate-labels="true"
          generate-labels-text-color="#111827"
          min={get(deviceJson, pthInfo.path).range.min}
          max={get(deviceJson, pthInfo.path).range.max}
          round={
            get(deviceJson, pthInfo.path).range.max -
              get(deviceJson, pthInfo.path).range.min >
            5
              ? "0"
              : null
          }
        ></tc-range-slider>
      </div>
    );
  };

  const DisplaySectionHeader = ({ deviceJson, item }) => {
    return (
      <div className="pt-10">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">
          {get(deviceJson, item.item.key).label}
        </h2>
        <p className="pt-2.5 text-lg leading-6 text-gray-600">
          {get(deviceJson, item.item.key).description}
        </p>
      </div>
    );
  };

  const DisplaySubSectionHeader = ({ deviceJson, pthInfo }) => {
    return (
      <div className="col-span-3">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">
          {get(deviceJson, pthInfo.path).label}
        </h2>
        <p className="pt-2.5 text-base leading-6 text-gray-600">
          {get(deviceJson, pthInfo.path).description}
        </p>
      </div>
    );
  };

  const Display = () => {
    try {
      const deviceJson = devices[curr].jsondata;
      breakDownJson(deviceJson, 0, "", "", true);

      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 divide-y divide-gray-200">
          {thing.map((item, index) => (
            <div key={index} className="pb-10">
              <DisplaySectionHeader deviceJson={deviceJson} item={item} />
              {item.item.pathstr.map((pthInfo, index) => (
                <div key={index}>
                  <div
                    className={classNames(
                      pthInfo.depthOne
                        ? "pt-2.5 grid-cols-5"
                        : "pt-10 px-10 grid-cols-5 gap-x-10 justify-between",
                      "pb-5 flex grid "
                    )}
                  >
                    {pthInfo.depthOne ? null : (
                      <DisplaySubSectionHeader
                        deviceJson={deviceJson}
                        pthInfo={pthInfo}
                      />
                    )}
                    <div className="col-span-2">
                      {get(deviceJson, pthInfo.path).options !== undefined ? (
                          <OptionsDropdwn
                            classNames={classNames}
                            current={get(deviceJson, pthInfo.valPath)}
                            options={get(deviceJson, pthInfo.path).options}
                            handleOptSelect={handleOptSelect}
                            path={pthInfo.valPath}
                          />
                      ) : get(deviceJson, pthInfo.path).range !== undefined ? (
                        <DisplaySlider
                          deviceJson={deviceJson}
                          pthInfo={pthInfo}
                        />
                      ) : Array.isArray(get(deviceJson, pthInfo.valPath)) ? (
                        <OptionsDropdwn
                          classNames={classNames}
                          current={"Select"}
                          options={get(deviceJson, pthInfo.valPath)}
                          handleOptSelect={handleOptSelect}
                          path={pthInfo.valPath}
                        />
                      ) : (
                        <DisplayInput
                          deviceJson={deviceJson}
                          pthInfo={pthInfo}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } catch (err) {
      console.log("display err: ", err);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <Display />
    </div>
  );
}
