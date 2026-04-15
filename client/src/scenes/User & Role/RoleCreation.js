import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";

import {
 
  useAddRoleMutation,
  useUpdateroleMutation,
} from "../../redux/service/Rolemaster.js";


import { ColorContext } from "../global/context/ColorContext.js";

const RoleCreation = ({
  onClose,
  readonly,
  setReadonly,
  setId,
  id,
  allData,
  onNew,
  text,
  edit,
  setEdit,
  mode,
  setMode,
  getRefetch,
}) => {
   
  const { color } = useContext(ColorContext);
  const [rolename, setRolename] = useState("");
  const [active, setActive] = useState(false);
  const [createUser] = useAddRoleMutation();
  const [updateUser] = useUpdateroleMutation();

  const SingleData = allData.find((item) => item.id === id);
 
  const syncFormWithDb = () => {

    setRolename(SingleData?.rolename ? SingleData.rolename : "");
    setActive(SingleData?.active ? SingleData.active : false);
      
  };
  useEffect(() => {
    syncFormWithDb();
  }, [SingleData]);

  const handleSubmit = async () => {

    console.log(rolename);
    
    if (text === "Cancel") {
      onNew();
      onClose();
      return;
    }
    
    if (edit) {
      if (!rolename) {
        Swal.fire({
          title: "please fill the required fields",
          icon: "warning",
        });
        return;
      }
    } 
    const formData = {
      id,
      rolename,active
      
    };
   

    try {
      const response = edit
        ? await updateUser(formData).unwrap()
        : await createUser(formData).unwrap();

      if (response) {
        Swal.fire({
          title: `User ${edit ? "Updated" : "Created"} Successfully`,
          icon: "success",
        });
        // toast.success(`User ${edit ? "Updated" : "Created"} Successfully`);

        onNew();
        onClose();
        getRefetch();
      }
    } catch (error) {
      Swal.fire({
        title: "please fill the required fields",
        icon: "warning",
        text: error?.data?.message || "Something went wrong",
      });
      // toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="w-full  mx-auto rounded-md shadow-lg px-2 py-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {edit
              ? text === "Cancel"
                ? "View Role "
                : "Edit Role "
              : "New Role "}
          </h1>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className=" text-white px-4 py-1 rounded-md flex items-center text-sm"
              style={{ backgroundColor: color }}
            >
              {edit ? (text === "Cancel" ? "Cancel" : "Update") : "Save"}
            </button>
            <button
              onClick={() => {
                console.log(onNew);
                onNew();
                onClose();
              }}
              className="text-indigo-600 hover:text-indigo-700 ml-3"
              title="Open Report"
            >
              <img
                src="https://img.icons8.com/?size=100&id=11511&format=png&color=000000"
                alt=""
                style={{ height: "30px", width: "30px" }}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3 h-full py-3">
        <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
          <h2 className="font-medium text-slate-700 mb-4">Role Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
              <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Role Name 
              </label>
              <input
                readOnly={readonly}
                value={rolename}
                type={"text"}
                required={true}
                onChange={(e) => setRolename(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
            focus:border-indigo-300 focus:outline-none transition-all duration-200
            hover:border-slate-400"
              />
            </div>
            
             <div className="m-4">
              <input
                disabled={readonly}
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              <label className="block text-xs font-bold text-slate-700 mb-3">
                Active
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default RoleCreation;
