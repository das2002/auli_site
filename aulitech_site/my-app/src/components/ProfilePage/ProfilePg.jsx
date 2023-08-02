import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  query,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import SignOutAccount from "../GoogleAuth/SignOutAccount";

const ProfilePg = ({ user }) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [data, setData] = useState(null);
  const [save, setSave] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userQuery = query(doc( db, "users", user.uid ));
        const userDocSnap = await getDoc(userQuery);
        setData(userDocSnap.data());

      } catch (error) {
        console.log("query user collection error:", error);
      }
    };
    return () => {
      getUserData();
    };
  }, [ save ]);

  const handleCancel = () => {
    setFirst("");
    setLast("");
  };

  const handleSaveProfileInfo = async () => {
    try {
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        firstname: first,
        lastname: last,
      });
      setSave(!save);
      setFirst("");
      setLast("");
    } catch (err) {
      console.log("save user data err: ", err);
    }
  };

  return (
    <>
      <div className="mb-10 flex items-center justify-end gap-x-6">
        <SignOutAccount />
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full md:max-w-lg">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              My Account
            </h2>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    onChange={(e) => setFirst(e.target.value)}
                    value={first}
                    placeholder={data === null ? null : data.firstname}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    onChange={(e) => setLast(e.target.value)}
                    value={last}
                    placeholder={data === null ? null : data.lastname}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={data === null ? null : data.email}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={handleCancel}
            className=" mb-6  px-2.5 py-1 text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={first === "" && last === "" ? true : false}
            onClick={handleSaveProfileInfo}
            className="mb-6 rounded-full bg-gray-900 px-2.5 py-1 text-sm font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePg;
