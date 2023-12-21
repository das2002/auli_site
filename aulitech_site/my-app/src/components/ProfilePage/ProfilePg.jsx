import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { query, getDoc, doc } from "firebase/firestore";

import SignOutAccount from "../GoogleAuth/SignOutAccount";
import StoreProfileData from "../CloudFirestore/StoreProfileData";

const ProfilePg = ({ user }) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [data, setData] = useState(null);
  const [save, setSave] = useState(false);
  // const [email, setEmail] = useState("")

  /* Display the users current data from their usr document in the DB*/
  useEffect(() => {
    const getUserData = async () => {
      try {
        /* Get user doc from the DB */
        const userQuery = query(doc(db, "users", user.uid));
        const userDocSnap = await getDoc(userQuery);
        /* Set user data to local variable */
        setData(userDocSnap.data());
      } catch (error) {
        console.log("query user collection error:", error);
      }
    };
    return () => {
      getUserData();
    };

    /* [save] makes this useEffect trigger when value changed so when the user saves the changes the new info is displayed right afterwards */
  }, [save]);

// --------------------------------------------------------------------------------------------------------------------------------------------------

  /* Cancel button resets local variables holding user input */
  const handleCancel = () => {
    setFirst("");
    setLast("");
  };

  /* Save button that send the changes made to the DB and retriggers the useEffect */
  const handleSaveInfo = async () => {
    try {
      /* Update user document in DB */
      StoreProfileData(user, first, last);

      /* Retrigger useEffect and reset local variables */
      setSave(!save);
      setFirst("");
      setLast("");
    } catch (err) {
      console.log("send to store profile data: ", err);
    }
  };

// --------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>
      <div className="flex min-h-full flex-col">
        <header className="flex justify-between bg-transparent border-b border-gray-200">
          <div className="flex h-16 max-w-7xl justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
              My Account
            </h2>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <SignOutAccount />
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 ">
          <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-5 mt-10">
            <div className="px-4 py-5 sm:p-6 lg:px-8">
              <div className="border-b border-gray-200 pb-5">
                <h3 className="text-xl font-semibold leading-6 text-gray-900">
                  Personal Information
                </h3>
              </div>
              <div>
                <div className="space-y-12">
                  <div className="border-b border-gray-200 pb-10">
                    <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="display-name"
                          className="block text-lg font-medium leading-6 text-gray-900"
                        >
                          Display Name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="display-name"
                            id="diplay-name"
                            autoComplete="given-name"
                            onChange={(e) => setFirst(e.target.value)}
                            value={first}
                            placeholder={data === null ? null : data.first}
                            className="block w-full rounded-md outline-0 border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-md sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-lg font-medium leading-6 text-gray-900"
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
                            placeholder={data === null ? null : data.last}
                            className="block w-full rounded-md outline-0 border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-md sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-lg font-medium leading-6 text-gray-900"
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
                            className="block w-full outline-0 border-0 rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-md sm:leading-6"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-2.5 py-1 text-lg font-semibold leading-6 text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={first === "" && last === "" ? true : false}
                    onClick={handleSaveInfo}
                    className="rounded-full bg-gray-900 px-2.5 py-1 text-lg font-semibold text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePg;
