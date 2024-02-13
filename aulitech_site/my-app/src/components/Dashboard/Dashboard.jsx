import React, { useState, useEffect } from "react";
import { clear } from "idb-keyval";
import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../../firebase";

import { Link } from "react-router-dom";
import UserDevices from "./UserDevices";
import SignOutAccount from "../GoogleAuth/SignOutAccount";

export const styles = { ACTIVE_RING: "ring-1 ring-blue-500" };

export default function Dashboard({
  classNames,
  user,
  devices,
}) {

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex justify-between bg-transparent border-b border-gray-200">
        <div className="flex h-16 max-w-7xl justify-between items-center">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
            Dashboard
          </h2>
        </div>
      </header>
      <UserDevices devices={devices} />
    </div>
  );
};
