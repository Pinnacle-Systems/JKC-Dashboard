import React, { useState } from "react";

import { toast } from "react-toastify";
import { AiFillCloseSquare } from "react-icons/ai";
import { useCreateUserMutation } from "../../redux/service/user";

const Form = ({ closeModal, onClose }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [createUser, { isLoading, isError, error }] = useCreateUserMutation();

  const [checkboxes, setCheckboxes] = useState({});

  const pageNames = [
    { id: 1, label: "DASHBOARD" },
    { id: 2, label: "Employees Detail" },
    { id: 4, label: "Allocation" },
    { id: 4, label: "User" },
  ];

  const handleCheckboxChange = (id) => {
    setCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the checked state
    }));
  };

  const validateData = (data) => {
    const selectedCheckboxes = Object.values(checkboxes).some((checked) => checked);
    if (data.username && data.password && selectedCheckboxes) {
      return true;
    }
    return false;
  };

  const handleSubmitCustom = async (callback, data, text) => {
    try {
      const response = await callback(data).unwrap();
      console.log(response, 'res');
      if (response.statusCode === 1) {
        toast.error(`${response.message}`);
      } else {
        toast.success(`${text} Successfully`);
      }
      onClose();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCheckboxes = pageNames.filter(
      (checkbox) => checkboxes[checkbox.id]
    ).map((checkbox) => ({ id: checkbox.id, label: checkbox.label }));
    const formData = { username, password, checkboxes: selectedCheckboxes };
    console.log("Submitting form data:", formData);

    if (!validateData(formData)) {
      toast.info("Please fill all required fields...!", {
        position: "top-center",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to save the details?")) {
      return;
    }

    handleSubmitCustom(createUser, formData, "User Created");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Create User</h1>
        <AiFillCloseSquare className="text-2xl text-gray-600 cursor-pointer" onClick={onClose} />
      </div>
      <div className="mb-4">
        <label htmlFor="userName" className="block text-gray-700 text-sm font-semibold mb-2">UserName:</label>
        <input
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          id="userName"
          name="userName"
          type="text"
          placeholder="Enter username"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-gray-800 font-semibold mb-2">Select Pages:</h2>
        {pageNames.map((checkbox) => (
          <div key={checkbox.id} className="flex items-center mb-2">
            <input
              className="form-checkbox h-5 w-5 text-blue-600"
              type="checkbox"
              checked={checkboxes[checkbox.id] || false}
              onChange={() => handleCheckboxChange(checkbox.id)}
            />
            <label className="ml-2 text-gray-700">{checkbox.label}</label>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Please Wait..." : "Submit"}
        </button>
        {isError && <div className="text-red-500 text-sm ml-2">{error.message}</div>}
      </div>
    </form>
  );
};

export default Form;
