import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import Swal from "sweetalert2";
import { ReusableTable } from "../../input/inputcomponent/index.js";
import {
  useDeleteUserMutation,
  useGetuserdetailQuery,
} from "../../redux/service/user.js";

import UserCreate from "./UserCreation.js";
import CompanyAllocation from "./CompanyAllocation.js";
export default function UserCompany() {
  const [usercreate, setusercreate] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const [mode, setMode] = useState(false);
  const [text, setText] = useState("");

  const { data: allData, refetch: Getrefetch } = useGetuserdetailQuery();
  const [deleteUser] = useDeleteUserMutation();

  const onNew = () => {
    setCurrentEditingId("");
    setReadonly(false);
    setText("");
    setEdit(false);
    setMode(false);
  };

  const handleView = (id) => {
    setEdit(true);
    setCurrentEditingId(id);
    setReadonly(true);
    setusercreate(true);
    setText("Cancel");
  };

  const handleEdit = async (id) => {
    setEdit(true);
    setCurrentEditingId(id);
    setReadonly(false);
    setusercreate(true);
    setText("Update");
    setMode(true);
  };

  const deleteData = async (id) => {
    if (!window.confirm("Are you sure to delete...?")) return;
    try {
      let deldata = await deleteUser(id).unwrap();
      if (deldata?.statusCode === 1) {
        // toast.error(deldata?.message);
        Swal.fire({
          title: "Something went wrong",
          icon: "error",
          text: deldata?.message,
        });

        return;
      }
      Swal.fire({
        title: "Deleted Successfully",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      Getrefetch();
    } catch {
      // toast.error("Something went wrong");
      Swal.fire({
        title: "Something went wrong",
        icon: "error",
      });
    }
  };

  const columns = [
    {
      header: "S.No",
      accessor: (_, index) => index + 1,
      className: "text-center w-12",
    },
    {
      header: "User Name",
      accessor: (item) => item?.username,
      className: "text-center w-64",
    },
    {
      header: "Company List",
      accessor: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.active ? "Active" : "Inactive"}
        </span>
      ),
      className: "text-center w-24",
    },
  ];

  return (
    <>
      {usercreate ? (
        <CompanyAllocation
          onClose={() => {
            setusercreate(false);
          }}
          readonly={readonly}
          setId={setCurrentEditingId}
          allData={allData}
          id={currentEditingId}
          onNew={onNew}
          text={text}
          edit={edit}
          setEdit={setEdit}
          mode={mode}
          setMode={setMode}
          getRefetch={Getrefetch}
        />
      ) : (
        <div className="p-2 bg-[#F1F1F0] min-h-screen">
          <div className="flex flex-col sm:flex-row justify-between bg-white py-1.5 px-1 items-start sm:items-center mb-4 gap-x-4 rounded-tl-lg rounded-tr-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-1 shadow-2xl">
             User Company Details
            </h3>

            <button
              onClick={() => setusercreate(true)}
              className="hover:bg-green-700 bg-white border border-green-700 hover:text-white text-green-800 px-4 py-1.5 rounded-md flex items-center gap-2 text-sm"
            >
              <AddIcon fontSize="small" /> Add User
            </button>
          </div>
          {/* TABLE */}
          <div className="w-full overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <ReusableTable
              columns={columns}
              data={allData?.users || []}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deleteData}
              itemsPerPage={10}
            />
          </div>
        </div>
      )}
    </>
  );
}
