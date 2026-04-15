    // import * as React from "react";
    // import { useEffect } from "react";
    // import { Modal } from '@mui/material';
    // import AddIcon from '@mui/icons-material/Add';
    // import { useGetUsersQuery } from "../../redux/service/user";
    // import Form from "../form";

    // export default function OutlinedCard() {
    //   const [open, setOpen] = React.useState(false);
    //   const handleOpen = () => setOpen(true);
    //   const handleClose = () => {
    //     setOpen(false);
    //     refetch();
    //   };

    //   const { data: userDt, refetch } = useGetUsersQuery();
    //   const userData = userDt?.data || [];

    //   useEffect(() => {
    //     refetch();
    //   }, [refetch]);

    //   const groupedUsers = userData.reduce((acc, user) => {
    //     if (!acc[user.userName]) {
    //       acc[user.userName] = {
    //         userName: user.userName,
    //         roles: [],
    //       };
    //     }
    //     if (user.role && !acc[user.userName].roles.includes(user.role)) {
    //       acc[user.userName].roles.push(user.role);
    //     }
    //     return acc;
    //   }, {});

    //   const uniqueRoles = [...new Set(userData.map(user => user.role).filter(role => role))];

    //   return (
    //     <div className="w-full mt-5">
    //       <div className="flex w-full justify-center items-center">
    //         <div className="flex w-full justify-center text-white">
    //           <h2 className="text-lg select-clr rounded">User Details</h2>
    //         </div>
    //         <div className="flex justify-end">

    //           <button
    //             onClick={handleOpen}
    //             className="p-5 btn btn-info flex items-center justify-center h-10 bg-blue-500 text-white rounded hover:bg-blue-700 shadow-md"
    //           >
    //             <span className="px-1">Create Role</span>
    //           </button>
    //           <button
    //             onClick={handleOpen}
    //             className="flex items-center justify-center h-8 bg-blue-500 text-white rounded hover:bg-blue-700 shadow-md"
    //           >
    //             <span className="px-1">Add </span>
    //           </button>
    //         </div>
    //       </div>
    //       <div className="w-full">
    //         <div className="overflow-x-auto shadow-lg rounded-lg">
    //           <table className="min-w-full">
    //             <thead>
    //               <tr className="side-bar uppercase text-sm leading-normal text-white border">
    //                 <th className="py-2 px-6 text-left border border-white">Username</th>
    //                 {uniqueRoles.map((role, index) => (
    //                   <th key={index} className="py-3 px-6 text-center border border-white">{role}</th>
    //                 ))}
    //               </tr>
    //             </thead>
    //             <tbody className="text-sm font-medium">
    //               {Object.values(groupedUsers).map((user, index) => (
    //                 <tr key={index} className={`border border-gray-300 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
    //                   <td className="py-3 px-6 text-left whitespace-nowrap">{user.userName}</td>
    //                   {uniqueRoles.map((role, idx) => (
    //                     <td key={idx} className="py-3 px-6 text-center border border-gray-300">
    //                       {user.roles.includes(role) ? "✓" : "-"}
    //                     </td>
    //                   ))}
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //       <Modal
    //         open={open}
    //         onClose={handleClose}
    //         aria-labelledby="modal-modal-title"
    //         aria-describedby="modal-modal-description"
    //       >
    //         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    //           <div className="bg-white p-6 rounded shadow-lg">
    //             <Form onClose={handleClose} />
    //           </div>
    //         </div>
    //       </Modal>
    //     </div>

    //   );
    // }

    // import React, { useEffect, useState } from "react";
    // import { Dropdown } from 'primereact/dropdown';
    // import "./User.css"
    // import CustomDataTable from "../User & Role/Customtable.jsx"
    // import tabs from "../../components/tabIndex.js";

    // import { motion } from "framer-motion";
    // import { toast } from "react-toastify";
    // import "react-toastify/dist/ReactToastify.css";
    // import { Grid } from "@mui/material";
    // import { useAddnewuserMutation, useAddRoleMutation, useCreateRoleOnPageMutation, useGetRoleQuery } from "../../redux/service/Rolemaster.js";
    // import { useDeleteUserMutation, useGetUserBasicDetailsMutation, useGetUserBasicDetailsQuery, useGetuserdetailQuery, useUpdateuserOnPageMutation } from "../../redux/service/user.js";
    // import { useGetCompCodeDataQuery } from "../../redux/service/commonMasters.js";
    // import { isOverflown } from "@mui/x-data-grid/utils/domUtils.js";
    // import { ReusableTable } from "../../input/index.js";
    // import { Power } from "lucide-react";
    // import Swal from 'sweetalert2';

    // toast.configure();

  //   const UserCreation = () => {
  //     const [permissions, setPermissions] = useState({});
  //     const [selectedRole, setSelectedRole] = useState(null);
  //     const [roleId, setroleId] = useState("");
  //     const [edit, setEdit] = useState(false);
  //     const [currentEditingId, setCurrentEditingId] = useState(null);
  //     const [toggleScroll, setToggleScroll] = useState(false);

  //     const [employeeId, setemployeeId] = useState("")
  //     const [username, setusername] = useState("")
  //     const [password, setpassword] = useState("")
  //     const [COMPCODE, setCOMPCODE] = useState("")
  //     const [active, setactive] = useState(false)
  //     const [mode,setmode]=useState(true)
  //     // const[alldata,setalldata]=useState([])

  //     const { data: compCode } = useGetCompCodeDataQuery({ params: {} })

  //     //   const { data: createdRoles, refetch: refetchCreatedRoles } = useGetCreatedRolesOnPageQuery();
  //     const { data: getRole } = useGetRoleQuery();
  //     // console.log(COMPCODE);
      
  //     const { data: basicDetails,error, isLoading } = useGetUserBasicDetailsQuery({COMPCODE})
  //     const [createRole] = useCreateRoleOnPageMutation();
  //     const [adduser] = useAddnewuserMutation()
  //       const [updateRole] = useUpdateuserOnPageMutation();
  //     //   const [deleteRow] = useDelete_CommonMutation();
  //     // const [addRole, { isLoading }] = useAddRoleMutation();
  //     // console.log("basic", basicDetails);
  //   const[form,setForm]=useState(false)
         
  //         const { data: allData,refetch } = useGetuserdetailQuery();

  //         const[deleteUser]=useDeleteUserMutation();
      




  //     const onNew = () => {
  //       setPermissions({});
  //       setemployeeId("")
  //       setusername("")
  //       setpassword("")
  //       setCOMPCODE("")
  //       setEdit(false);
  //       setroleId("");
  //       setSelectedRole(null);
  //       setmode(true)
  //     };

  //     const handlePermissionChange = (page, permission) => {
  //       setPermissions((prev) => {

  //         // console.log(prev,"prev");
          
  //         const updated = { ...prev };

  //         if (!updated[page]) {
  //           updated[page] = {
  //             read: false,
  //             create: false,
  //             edit: false,
  //             delete: false,
  //             isdefault: false,
  //           };
  //         }

  //         if (permission === "isdefault") {
  //           const isCurrentlyDefault = updated[page].isdefault;

  //           if (isCurrentlyDefault) {
  //             // Unset all when toggled off
  //             updated[page] = {
  //               read: false,
  //               create: false,
  //               edit: false,
  //               delete: false,
  //               isdefault: false,
  //             };
  //           } else {
  //             // Set all when toggled on
  //             updated[page] = {
  //               read: true,
  //               create: true,
  //               edit: true,
  //               delete: true,
  //               isdefault: true,
  //             };
  //           }
  //         } else {
  //           updated[page] = {
  //             ...updated[page],
  //             [permission]: !updated[page][permission],
  //           };
  //         }

  //         const perms = updated[page];
  //       const allFalse = Object.values(perms).every((val) => val === false);
  //       if (allFalse) {
  //         delete updated[page];
  //       }
  //         console.log("permission",permission);
          
  //         return updated;
  //       });
  //     };

  //     const handleSubmit = async () => {
  //       if(edit){
  //         if (!username || !roleId || !employeeId || !COMPCODE ||  Object.keys(permissions).length === 0) {
  //         toast.warning("Please fill all rerwtequired fields");
  //         return;

  //       }
  //     }
  //       else if(!username || !roleId || !employeeId || !password || !COMPCODE ||  Object.keys(permissions).length === 0) {
  //         toast.warning("Please fill all required fields");
  //         return;
  //       }

  //       // console.log(permissions);
        
  //       const formData = {
  //         id:currentEditingId,username,employeeId,
  //         permissions, roleId,COMPCODE,password,active,
  //         ...(edit && { id: currentEditingId }),
  //       };
  //      console.log(formData,'formdata');
       
  //       try {
  //           const response = !edit? await createRole(formData).unwrap():
  //                            await updateRole(formData).unwrap();
  //                            console.log("respones",response);
                             

  //         if (response.count > 0) {
  //           toast.success(`User ${edit ? "Updated" : "Created"} Successfully`);
  //           // refetchCreatedRoles();
  //           onNew();
  //           refetch();
  //         }
  //       } catch (error) {

  //         console.log(error);
  //         const errMsg =
  //       error.data.message || // message from your backend
  //       error.message ||                 // generic network error
  //       "Something went wrong";          // fallback message

  //     toast.error(errMsg);
  //       }
  //     };

  //     const handleDelete = async (item) => {
  //       if (window.confirm("Are you sure you want to delete this role?")) {
  //         //   const res = await deleteRow({ table: "role", where: { id: item.id } });
  //         //   if (res?.data?.status === 1) {
  //         //     toast.info("Data Deleted Successfully");
  //         //     // refetchCreatedRoles();
  //         //   }
  //       }
  //     };

  //     const handleChange =(e)=>{
  //       const { value, type, checked } = e.target;
  //       setactive(type === 'checkbox' ? checked : value);

  //     }

  //     const editData = async (item) => {
  //       setEdit(true);
  //       setroleId(item.name);
  //       setSelectedRole(item.name);
  //       // setCurrentEditingId(item.id);

  //       const data = item.RoleOnPage;
  //       if (data) {
  //         const transformed = data.reduce((acc, perm) => {
  //           acc[perm.link] = {
  //             read: !!perm.read,
  //             create: !!perm.create,
  //             edit: !!perm.edit,
  //             delete: !!perm.delete,
  //             isdefault: !!perm.isdefault,
  //           };
  //           return acc;
  //         }, {});
  //         setPermissions(transformed);
  //       }
  //     };

  //     const tableHead = ["Page", "Read", "Create", "Edit", "Delete", "Default"];
  //     const tableData = (tabs || [])
  //       .filter((item) => item.list)
  //       .map((item) => {
  //         const p = permissions[item.name] || {};
  //         return (
  //           <tr key={item.name} className="text-center border-b border-gray-200">
  //             <td className="font-medium">{item.list_name}</td>
  //             {["read", "create", "edit", "delete", "isdefault"].map((perm) => (
  //               <td key={perm}>
  //                 <button
  //                   disabled={item.default}
  //                   onClick={() => handlePermissionChange(item.name, perm)}
  //                   className={`w-8 h-8 rounded ${p[perm] ? "bg-gray-300" : "bg-gray-100"
  //                     } hover:bg-gray-400 transition`}
  //                 >
  //                   {p[perm] ? "✔" : ""}
  //                 </button>
  //               </td>
  //             ))}
  //           </tr>
  //         );
  //       });

  //     // const fields = [
  //     //   { key: "name", label: "Name" },
  //     //   { key: "active", label: "Active" },
  //     // ];
      
  //         const ACTIVE = (
  //         <div className="bg-gradient-to-r from-green-200 to-green-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-green-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
  //           <Power size={10} />
  //         </div>
  //       );
  //       const INACTIVE = (
  //         <div className="bg-gradient-to-r from-red-200 to-red-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-red-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
  //           <Power size={10} />
  //         </div>
  //       );
  //     const columns = [
  //       {
  //         header: "S.No",
  //         accessor: (item, index) => index + 1,
  //         className: "font-medium text-gray-900 w-12  text-center",
  //       },

  //       {
  //         header: "User Name",
  //         accessor: (item) => item?.username,
  //         //   cellClass: () => "font-medium  text-gray-900",
  //         className: "font-medium text-gray-900 text-center uppercase w-96",
  //       },

  //       {
  //         header: "Status",
  //         accessor: (item) => (item.active ? ACTIVE : INACTIVE),
  //         //   cellClass: () => "font-medium text-gray-900",
  //         className: "font-medium text-gray-900 text-center uppercase w-16",
  //       },

  //     ];

  //     // const onNew =()=>{
  //     //       setForm(true);

  //     //   }
  //   const handleView=()=>{

  //   }
  //   const handleEdit=async(id)=>{
      
      
  //     const user = allData.users.find((item)=>item.id === id)
  //     const pages =allData.perrmissions.filter((item)=>item.userId == id)
  //  console.log(user);

   

  //     setCurrentEditingId(id)
  //     setCOMPCODE(user.COMPCODE)
  //     setusername(user.username)
  //     setemployeeId(user.employeeId)
  //     setroleId(user.roleId)
  //     setactive(user.active)
  //     setmode(false)
  //     setEdit(true);
  //      if (pages) {
  //         const transformed = pages.reduce((acc, perm) => {
  //           acc[perm.link] = {
  //             read: !!perm.read,
  //             create: !!perm.create,
  //             edit: !!perm.edit,
  //             delete: !!perm.delete,
  //             isdefault: !!perm.isdefault,
  //           };
  //           return acc;
  //         }, {});
  //         setPermissions(transformed);
  //       }
      
             


  //   }
  //   const deleteData=async(id)=>{
  //     // console.log(id,"id");
      
  //     if (id) {
  //       if (!window.confirm("Are you sure to delete...?")) {
  //         return;
  //       }
  //       try {
  //         let deldata = await deleteUser(id).unwrap();
  //         if (deldata?.statusCode == 1) {
  //           toast.error(deldata?.message)
  //           return
  //         }
          
  //         Swal.fire({
  //           title: "Deleted" + "  " + "Successfully",
  //           icon: "success",
  //           draggable: true,
  //           timer: 1000,
  //           showConfirmButton: false,
  //           didOpen: () => {
  //             Swal.showLoading();
  //           }
  //         });
  //         setForm(false)
  //         refetch();
  //       } catch (error) {
  //         toast.error("something went wrong");
  //       }
  //     }
        
  //   }

  //     // const filterRole = getRole?.data?.map((fdata) => ({ label: fdata?.roleId, value: fdata?.id }));
  //     // const filterRole1 = basicDetails?.data?.map((fdata) => ({optionLabel:fdata?.FNAME,optionValue:fdata?.EMPID}));
  //     // console.log(filterRole1);

  //     return (
  //       <Grid container>
  //         <Grid item lg={7}>

  //           <motion.div
  //             className="p-1"
  //             initial={{ opacity: 0, y: 30 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             transition={{ duration: 0.6 }}
  //           >

  //             <div className="max-w-6xl mx-auto space-y-6" style={{overflow:"scroll",maxHeight:"85vh"}} >
  //               {/* User Info */}
  //               <div className="bg-white p-5 rounded-xl shadow">
  //                 <h2 className="text-xl font-bold border-b pb-2 mb-3 text-center">
  //                   New User
  //                 </h2>
  //                 <div className="mt-1 z-10 mb-2">
  //                   <label className="text-sm font-bold  pb-2 mb-3">Select Company</label>
  //                   {/* <Dropdown value={employeeId} onChange={(e) => setemployeeId(e.value)} options={[{}]} optionLabel="name" 
  //         editable placeholder="Select a City" className="w-full md:w-14rem" /> */}
  //                   <Dropdown
  //                     value={COMPCODE}
  //                     onChange={(e) => setCOMPCODE(String(e.value))}
  //                     options={compCode?.data || []}
  //                     optionLabel="com"
  //                     optionValue="com"
  //                     filter
  //                     showClear
  //                     virtualScrollerOptions={{ itemSize: 38 }}
  //                     placeholder="Select an company"
  //                     className="border p-1 w-80 h-10 rounded ml-5 custom-dropdown"
  //                     panelClassName="custom-dropdown-panel"
  //                   // dropdownAppendTo="body"
  //                   />
  //                 </div>
  //                 <div className="mt-1 z-10 mb-2">
  //                   <label className="text-sm font-bold  pb-2 mb-3">Select EmpID</label>
  //                   {/* <Dropdown value={employeeId} onChange={(e) => setemployeeId(e.value)} options={[{}]} optionLabel="name" 
  //         editable placeholder="Select a City" className="w-full md:w-14rem" /> */}
  //                   <Dropdown
  //                     value={employeeId}
  //                     onChange={(e) => setemployeeId(String(e.value))}
  //                     options={basicDetails?.data || []}
  //                     optionLabel="FNAME"
  //                     optionValue="EMPID"
  //                     filter
  //                     showClear
  //                     virtualScrollerOptions={{ itemSize: 38 }}
  //                     placeholder="Select an Employee"
  //                     className="border p-1 w-80 h-10 rounded ml-9 custom-dropdown"
  //                     panelClassName="custom-dropdown-panel"
  //                   // dropdownAppendTo="body"
  //                   />
  //                 </div>
  //                 <div>
  //                   <label className="text-sm font-bold  pb-2 mb-3">
  //                     User Name
  //                   </label>
  //                   <input type="text" value={username} className="rounded p-2 ml-12  w-80 h-10" onChange={(e) => setusername(e.target.value)} />

  //                 </div>
  //                 <div className="mt-2">
  //                   <label className="text-sm font-bold  pb-2 mb-3 ">
  //                     Password
  //                   </label>
  //                   <input type="text" value={password} className={`rounded p-2 ml-14 w-80 h-10 ${mode === false ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} onChange={(e) => setpassword(e.target.value)} disabled={mode=== false} />
  //                 </div>


  //                 <div className="mt-3 z-10">
  //                   <label className="text-sm font-bold  pb-2 mb-3">Select Role</label>
                    
  //                     <Dropdown
  //                       value={roleId}
  //                       onChange={(e) => { setroleId(e?.value) }}
  //                       placeholder="Select Role"
  //                       filter
  //                       showClear
  //                       options={getRole || []}
  //                       optionLabel={"rolename"}
  //                       optionValue={"id"}
  //                       className="border p-1 w-80 h-10 rounded ml-12 custom-dropdown"
  //                       panelClassName="custom-dropdown-panel"
  //                       // dropdownAppendTo="body"
  //                       virtualScrollerOptions={{ itemSize: 38 }}
  //                     // width={"100%"}
  //                     />
                    
  //                 </div>
  //                 <div className="mt-2">
  //                       <label className="">
  //                           <input type="checkbox" name="active" checked={active} onChange={handleChange} className="" />
  //                           Active
  //                       </label>
  //                     </div>
                




  //               {/* Permissions Table */}
  //               {/* <div className="bg-white p-5 rounded-xl shadow"> */}
  //                 <h2 className="text-xl font-bold border-b pb-2 mb-3 text-center">
  //                   Page Permissions
  //                 </h2>

  //                 <div
  //                   className={`overflow-y-auto ${toggleScroll ? "h-auto" : "h-[300px]"
  //                     }`}
  //                 >
  //                   <table className="w-full border-collapse text-sm ">
  //                     <thead>
  //                       <tr className="bg-red-800 text-white">
  //                         {tableHead.map((head) => (
  //                           <th key={head} className="py-2 px-3 text-center">
  //                             {head}       
  //                           </th>
  //                         ))}
  //                       </tr>
  //                     </thead>
  //                     <tbody>{tableData}
                        
  //                     </tbody>
  //                   </table>
  //                 </div>

  //                 <div className="flex justify-center mt-2">
  //                   <button
  //                     onClick={() => setToggleScroll(!toggleScroll)}
  //                     className="text-blue-600 hover:underline"
  //                   >
  //                     {toggleScroll ?  "Show More ▼" : "Show Less ▲"}
  //                   </button>
  //                 </div>
  //               {/* </div> */}

  //               {/* Created Roles */}
  //               {/* <div className="bg-white p-5 rounded-xl shadow">
  //               <h2 className="text-xl font-bold border-b pb-2 mb-3 text-center">
  //                 Available Roles
  //               </h2>
  //               <CustomDataTable
  //                 title="Available Roles"
  //                 // data={createdRoles?.data || []}
  //                 fields={fields}
  //                 onEdit={editData}
  //                 onDelete={handleDelete}
  //                 itemsPerPage={3}
  //               />
  //             </div> */}

  //               {/* Action Buttons */}
  //               <div className="flex justify-center gap-4 mt-5">
  //                 <button
  //                   onClick={onNew}
  //                   className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
  //                 >
  //                   New
  //                 </button>
  //                 <button
  //                   onClick={handleSubmit}
  //                   className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
  //                 >
  //                   {edit ? "Update" : "Save"}
  //                 </button>
  //               </div>
  //             </div>
  //             </div>
  //           </motion.div>

  //         </Grid>
  //         <Grid item lg={5}>

  //           <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
  //                   <ReusableTable
  //                     columns={columns}
  //                     data={allData?.users || ""}
  //                     onView={handleView}
  //                     onEdit={handleEdit}
  //                     onDelete={deleteData}
  //                     itemsPerPage={14}
  //                   />
  //                 </div>
            

  //         </Grid>

  //       </Grid>

  //     );
  //   }
  //   export default UserCreation