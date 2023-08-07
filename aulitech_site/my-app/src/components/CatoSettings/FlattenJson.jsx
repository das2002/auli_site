import React from "react";

export default function FlattenJson({ classNames, devices, curr }) {
  const data = devices[curr].jsondata;

  const Test = () => {
    console.log(data);
  }
  return (
    <>
      <p>Testing</p>
      <Test/>
    </>
  )
}