import React from "react";

const FormatJson = (configString) => {
  return (
    <>
      <p>
        {JSON.stringify(configString)};
      </p>
    </>
  )
}

export default FormatJson;