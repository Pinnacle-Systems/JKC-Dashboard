import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import {
  DropdownWithSearch,
  DropdownWithSearch1,
  DropdownWithSearch2,
  MultiSelectDropdown,
} from "../../input/inputcomponent/index.js";
import {
  useUpdateuserOnPageMutation,
  useGetUserBasicDetailsQuery,
  useGetuseroneQuery,
} from "../../redux/service/user.js";
import { useGetCompCodeDataQuery } from "../../redux/service/commonMasters.js";
import {
  useGetRoleQuery,
  useCreateRoleOnPageMutation,
} from "../../redux/service/Rolemaster.js";
import tabs from "../../components/tabIndex.js";

import { ColorContext } from "../global/context/ColorContext.js";
import { findFromList, multiSelectOption } from "../../utils/hleper.js";
import secureLocalStorage from "react-secure-storage";
import { data } from "../../components/GoogleGeoChart.jsx";
import { getCommonParams } from "../../utils/hleper.js";

const UserCreate = ({
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
  console.log(id, "compCode");
  const { color } = useContext(ColorContext);
  const [permissions, setPermissions] = useState({});
  const [employeeId, setEmployeeId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [COMPCODE, setCOMPCODE] = useState("");
  const [compList, setCompList] = useState([]);
  const [issuperAdmin, setIssuperAdmin] = useState(false);
  const [allowcomp, setAllowcomp] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isExistingPassword, setIsExistingPassword] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [active, setActive] = useState(false);
  const [toggleScroll, setToggleScroll] = useState(false);

  const { data: getRole } = useGetRoleQuery();
  const { data: basicDetails } = useGetUserBasicDetailsQuery({
    COMPCODE,
  });
  const [createUser] = useCreateRoleOnPageMutation();
  const [updateUser] = useUpdateuserOnPageMutation();
  const { data: compCode } = useGetCompCodeDataQuery(
    { userId: issuperAdmin ? false : parseInt(userId) },
    { skip: !issuperAdmin && !userId },
  );
  console.log(compCode, "compCode");
  const params = getCommonParams();

  const { finYearId, isSuperAdmin } = params;
  console.log(isSuperAdmin, "isSuperAdmin");
  const {
    data: singleData1,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
    refetch: refetchSingleUser,
  } = useGetuseroneQuery(id);
  console.log(singleData1, "singleData1");

  async function Fliter() {
    const userId = secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userId",
    );
    setUserId(userId);
    const isSuperAdmin = secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "superAdmin",
    );
    setIssuperAdmin(isSuperAdmin);
  }
  const syncFormWithDb = () => {
    setUsername(singleData1?.data?.username ? singleData1.data.username : "");
    setCOMPCODE(singleData1?.data?.COMPCODE ? singleData1.data.COMPCODE : "");
    setEmployeeId(
      singleData1?.data?.employeeId ? singleData1.data.employeeId : "",
    );
    setRoleId(singleData1?.data?.roleId ? singleData1.data.roleId : "");
    setActive(singleData1?.data?.active ? singleData1.data.active : false);
    if (id && singleData1?.data?.password) {
      setPassword("");
      setIsExistingPassword(true); // ✅ flag that password exists in DB
    } else {
      setIsExistingPassword(false);
    }
    if (id) {
      const pages = singleData1?.data?.Useronpage.filter(
        (item) => item?.userId === id,
      );
      const CompanyList = singleData1?.data?.Useroncompany?.filter(
        (item) => item?.userId === id,
      );

      if (issuperAdmin) {
        setCompList(
          CompanyList
            ? CompanyList?.map((item) => {
                return {
                  value: item.companyName,
                  label: item.companyName,
                };
              })
            : [],
        );
      } else {
        setCompList(
          CompanyList
            ? CompanyList?.map((item) => {
                return {
                  value: item.companyName,
                  label: item.companyName,
                };
              })
            : [],
        );
      }

      if (pages) {
        const transformed = pages.reduce((acc, perm) => {
          acc[perm.link] = {
            read: !!perm.read,
            create: !!perm.create,
            edit: !!perm.edit,
            delete: !!perm.delete,
            isdefault: !!perm.isdefault,
          };
          return acc;
        }, {});
        setPermissions(transformed);
      }
    }
  };

  useEffect(() => {
    Fliter();
  }, [
    userId,
    issuperAdmin,
    isSingleFetching,
    isSingleLoading,
    id,
    singleData1,
  ]);

  // console.log(singleData1?.data?.username, "compList");

  // const SingleData = allData?.users?.find((item) => item?.id === id);
  // console.log(pages,"pages and company");

  useEffect(() => {
    syncFormWithDb();
  }, [isSingleFetching, isSingleLoading, singleData1]);

  const handlePermissionChange = (page, permission) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      if (!updated[page]) {
        updated[page] = {
          read: false,
          create: false,
          edit: false,
          delete: false,
          isdefault: false,
        };
      }
      if (permission === "isdefault") {
        const isDefault = updated[page].isdefault;
        updated[page] = isDefault
          ? {
              read: false,
              create: false,
              edit: false,
              delete: false,
              isdefault: false,
            }
          : {
              read: true,
              create: true,
              edit: true,
              delete: true,
              isdefault: true,
            };
      } else {
        updated[page] = {
          ...updated[page],
          [permission]: !updated[page][permission],
        };
      }
      const allFalse = Object.values(updated[page]).every(
        (val) => val === false,
      );
      if (allFalse) delete updated[page];
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (text === "Cancel") {
      onNew();
      onClose();
      return;
    }
    // console.log(permissions, username, roleId, employeeId, COMPCODE, password);
    if (edit) {
      if (
        !username ||
        !roleId ||
        !employeeId ||
        !COMPCODE ||
        Object.keys(permissions).length === 0
      ) {
        Swal.fire({
          title: "please fill the required fields",
          icon: "warning",
        });
        return;
      }
    } else if (
      !username ||
      !roleId ||
      !employeeId ||
      !password ||
      !COMPCODE ||
      Object.keys(permissions).length === 0
    ) {
      Swal.fire({
        title: "please fill the required fields",
        icon: "warning",
      });
      return;
    }
    const formData = {
      id,
      username,
      employeeId,
      permissions,
      roleId,
      COMPCODE,
      password,
      active,
      compList,
      createdbyId: issuperAdmin ? Number(issuperAdmin) : userId,
    };
    // console.log(
    //   id,
    //   username,
    //   employeeId,
    //   permissions,
    //   roleId,
    //   COMPCODE,
    //   password,
    //   active,
    //   compList
    // );

    try {
      const response = edit
        ? await updateUser(formData).unwrap()
        : await createUser(formData).unwrap();

      if (response.count > 0) {
        Swal.fire({
          title: `User ${edit ? "Updated" : "Created"} Successfully`,
          icon: "success",
        });
        // console.log(response);

        // toast.success(`User ${edit ? "Updated" : "Created"} Successfully`);
        refetchSingleUser();
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
  console.log(compList, "compList");

  return (
    <>
      <div className="w-full  mx-auto rounded-md shadow-lg px-2 py-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold text-gray-800 mt-2">
            {edit
              ? text === "Cancel"
                ? "View User"
                : "Edit User"
              : "New User"}
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
                // console.log(onNew);
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
          <h2 className="font-medium text-slate-700 ">User Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-3 mt-3">
            {issuperAdmin ? (
              <DropdownWithSearch
                options={compCode?.data || []}
                labelField={"com"}
                // required={true}
                label={"company Name"}
                value={COMPCODE}
                setValue={setCOMPCODE}
                disabled={readonly}
              />
            ) : (
              <DropdownWithSearch2
                options={(compCode?.data?.Useroncompany || []).filter(
                  (item) => item && item.companyName,
                )}
                labelField={"companyName"}
                // required={true}
                label={"company Name"}
                value={COMPCODE}
                setValue={setCOMPCODE}
                disabled={readonly}
              />
            )}
            {/* <DropdownWithSearch
                options={compCode?.data || []}
                labelField={"com"}
                // required={true}
                label={"company Name"}
                value={COMPCODE}
                setValue={setCOMPCODE}
                disabled={readonly}
              /> */}
            <DropdownWithSearch1
              options={basicDetails?.data || []}
              labelField={"FNAME"}
              // required={true}
              label={"Employee Name"}
              value={employeeId}
              setValue={setEmployeeId}
              disabled={readonly}
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                User Name
              </label>
              <input
                readOnly={readonly}
                value={username}
                type={"text"}
                required={true}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
            focus:border-indigo-300 focus:outline-none transition-all duration-200
            hover:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password{" "}
                {edit && (
                  <span className="text-gray-400 font-normal text-xs">
                    (leave to keep current)
                  </span>
                )}
              </label>
              <input
                value={isExistingPassword ? "••••••••" : password}
                type="text"
                readOnly={readonly}
                onFocus={() => {
                  // ✅ When user clicks to type, clear dots and let them type fresh
                  if (isExistingPassword) {
                    setIsExistingPassword(false);
                    setPassword("");
                  }
                }}
                onChange={(e) => {
                  setIsExistingPassword(false);
                  setPassword(e.target.value);
                }}
                onBlur={() => {
                  // ✅ If user focused but typed nothing, restore the dots
                  if (
                    !isExistingPassword &&
                    password.trim() === "" &&
                    id &&
                    singleData1?.data?.password
                  ) {
                    setIsExistingPassword(true);
                  }
                }}
                className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
      focus:border-indigo-300 focus:outline-none transition-all duration-200
      hover:border-slate-400`}
              />
            </div>
            <DropdownWithSearch
              options={getRole || []}
              labelField={"rolename"}
              // required={true}
              disabled={readonly}
              label={"Role Name"}
              value={roleId}
              setValue={setRoleId}
            />
            {issuperAdmin ? (
              <MultiSelectDropdown
                name="Allocation Company List"
                // required={true}
                readOnly={readonly}
                options={multiSelectOption(
                  compCode ? compCode?.data : [],
                  "com",
                  "com",
                )}
                selected={compList}
                setSelected={setCompList}
              />
            ) : (
              <MultiSelectDropdown
                name="Allocation Company List"
                // required={true}
                readOnly={readonly}
                options={multiSelectOption(
                  compCode ? compCode?.data?.Useroncompany : [],
                  "companyName",
                  "companyName",
                )}
                selected={compList}
                setSelected={setCompList}
              />
            )}

            <div className="mt-3">
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
      <div className="space-y-3 h-full py-3">
        <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
          <h3 className="font-medium text-slate-700 mb-4">Page Permissions</h3>
          <div
            className={`overflow-y-auto ${
              toggleScroll ? "h-auto" : "h-[300px]"
            } border rounded`}
          >
            <table className="w-full border-collapse text-sm">
              <thead className="text-white" style={{ backgroundColor: color }}>
                <tr>
                  {["Page", "Read", "Create", "Edit", "Delete", "Default"].map(
                    (head) => (
                      <th
                        key={head}
                        className="py-2 px-3 text-center border text-sm"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {tabs
                  .filter((item) => item.list)
                  .map((item) => {
                    const p = permissions[item.name] || {};
                    return (
                      <tr
                        key={item.name}
                        className="text-center border-b hover:bg-gray-50 text-xs"
                      >
                        <td className="text-left pl-2">{item.list_name}</td>
                        {["read", "create", "edit", "delete", "isdefault"].map(
                          (perm) => (
                            <td key={perm}>
                              <button
                                disabled={readonly}
                                onClick={() =>
                                  handlePermissionChange(item.name, perm)
                                }
                                className={`w-8 h-8 rounded ${
                                  p[perm]
                                    ? "bg-gray-300"
                                    : "bg-gray-100 hover:bg-gray-300"
                                } transition`}
                              >
                                {p[perm] ? "✔" : ""}
                              </button>
                            </td>
                          ),
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setToggleScroll(!toggleScroll)}
              className="text-blue-600 hover:underline text-sm"
            >
              {toggleScroll ? "Show More ▼" : "Show Less ▲"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserCreate;
