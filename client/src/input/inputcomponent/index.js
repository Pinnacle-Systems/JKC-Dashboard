import { forwardRef, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import RequiredLabel from "../inputindex";
export const ReusableTable = ({
  columns,
  data,
  itemsPerPage = 14,
  onView,
  onEdit,
  onDelete,
  emptyStateMessage = "No data available",
  rowActions = true,
  width,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math?.ceil(data?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(data, "commonTable")

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const Pagination = () => {
    // if (totalPages <= 1) return null;

    return (
      <div className=" w-full flex flex-col sm:flex-row justify-between items-center p-2 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, data?.length)} of {data?.length} entries
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            <FaChevronLeft className="inline" />
          </button>

          {Array?.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md ${currentPage === pageNum
                  ? "bg-indigo-800 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-3 py-1">...</span>
          )}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages
                ? "bg-indigo-800 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            <FaChevronRight className="inline" />
          </button>
        </div>
      </div>
    );
  };
  const inputRef = useRef(null);
  const [activeSearchCol, setActiveSearchCol] = useState([]);

  // useEffect(() => {
  //   if (
  //     activeSearchCol !== null &&
  //     inputRef?.current[activeSearchCol] &&
  //     inputRef?.current[activeSearchCol] !== null
  //   ) {
  //     inputRef?.current[activeSearchCol]?.focus();
  //   }
  // }, [activeSearchCol]);

  return (
    <>
      <div className="flex flex-col w-full h-[78Vh] overflow-auto">
        <div className="h-[100vh] rounded-lg bg-[#F1F1F0] shadow-sm">
          <div className="h-[68vh]">
            <table className="">
              <thead className="bg-gray-200 text-gray-800 ">
                <tr>
                  {columns?.map((column, index) => (
                    <th
                      key={index}
                      className={`${column.className ? column.className : ""
                        } py-2 px-1.5 font-medium text-[13px] ${column.header !== "" ? "border border-white/50" : ""
                        } text-start`}
                    >
                      <span>{column.header}</span>
                    </th>
                  ))}
                  <td className="border border-white/50 font-medium text-[13px]"></td>
                </tr>
              </thead>
              <tbody>
                {currentItems?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns?.length + (rowActions ? 1 : 0)}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      {emptyStateMessage}
                    </td>
                  </tr>
                ) : (
                  currentItems?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors border-b   border-gray-200 text-[12px] ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }`}
                    >
                      {columns?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={` ${column.className ? column.className : ""
                            } ${column.header !== ""
                              ? "border-r border-white/50"
                              : ""
                            } h-7 text-start`}
                        >
                          {column.accessor(item, index)}
                        </td>
                      ))}
                      {rowActions && (
                        <td className=" w-[30px] border-gray-200 gap-1 px-2   h-8 justify-end">
                          <div className="flex">
                            {onView && (
                              <button
                                className="text-blue-600  flex items-center   px-1  bg-blue-50 rounded"
                                onClick={() => onView(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                            {onEdit && (
                              <button
                                className="text-green-600 gap-1 px-1   bg-green-50 rounded"
                                onClick={() => onEdit(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            )}
                            {onDelete && (
                              <button
                                className=" text-red-800 flex items-center gap-1 px-1  bg-red-50 rounded"
                                onClick={() => onDelete(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {/* <span className="text-xs">delete</span> */}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="h-[10vh]">
            <Pagination />
          </div>
        </div>
      </div>
    </>
  );
};

export const handleOnChange = (event, setValue) => {
  const inputValue = event.target.value;
  const inputSelectionStart = event.target.selectionStart;
  const inputSelectionEnd = event.target.selectionEnd;

  const upperCaseValue = inputValue.toUpperCase();

  const valueBeforeCursor = upperCaseValue.slice(0, inputSelectionStart);
  const valueAfterCursor = upperCaseValue.slice(inputSelectionEnd);

  setValue(
    valueBeforeCursor +
    inputValue.slice(inputSelectionStart, inputSelectionEnd) +
    valueAfterCursor
  );

  // Set the cursor position to the end of the input value
  setTimeout(() => {
    event.target.setSelectionRange(
      valueBeforeCursor.length +
      inputValue.slice(inputSelectionStart, inputSelectionEnd).length,
      valueBeforeCursor.length +
      inputValue.slice(inputSelectionStart, inputSelectionEnd).length
    );
  });
};

export function ReusableInput({
  setValue,
  label,
  type,
  value,
  className = "",
  placeholder,
  readOnly,
  disabled,
}) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) =>
          type === "number"
            ? setValue(e.target.value)
            : handleOnChange(e, setValue)
        }
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
          focus:border-indigo-300 focus:outline-none transition-all duration-200
          hover:border-slate-400 ${readOnly || disabled ? "bg-slate-100" : ""
          } ${className}`}
      />
    </div>
  );
}

export const DropdownInput = forwardRef(
  (
    {
      name,
      beforeChange = () => { },
      onBlur = null,
      options,
      value,
      setValue,
      defaultValue,
      className = "",
      readOnly = false,
      required = false,
      disabled = false,
      clear = false,
      tabIndex = null,
      autoFocus = false,
      width = "full",
      country,
      openOnFocus = false, // new prop
    },
    ref
  ) => {
    const handleOnChange = (e) => {
      setValue(e.target.value);
    };

    const isDisabled = readOnly || disabled;

    useEffect(() => {
      if (ref?.current && openOnFocus) {
        ref.current.focus();
      }
    }, [openOnFocus]);

    return (
      <div className={`mb-2 ${width}`}>
        {name && (
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {required ? <RequiredLabel name={name} /> : name}
          </label>
        )}
        <select
          ref={ref}
          onBlur={onBlur}
          autoFocus={autoFocus}
          tabIndex={tabIndex ?? undefined}
          defaultValue={defaultValue}
          required={required}
          className={`w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm
          ${className}`}
          value={value}
          onChange={(e) => {
            beforeChange();
            handleOnChange(e);
          }}
          onFocus={(e) => {
            if (openOnFocus) {
              e.target.click();
            }
          }}
          disabled={isDisabled}
        >
          <option value="" hidden={!clear} className="text-gray-800">
            Select
          </option>
          {options?.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="text-xs py-1 text-gray-800"
            >
              {option.show}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export const DropdownWithSearch = forwardRef(
  (
    {
      className,
      options,
      value,
      setValue,
      readOnly,
      disabled,
      required = false,
      labelField,
      label,
      nextRef = null,
      classNameForOptions, // 👈 next input ref
      autoFocus,
      
    },
    ref
  ) => {
    // 👈 next input ref
    // console.log(classNameForOptions, "classNameForOptions")

    // const [currentIndex, setCurrentIndex] = useState("");
    const isFirstRender = useRef(true);

    // useEffect(() => {
    //   if (ref?.current && isFirstRender.current) {
    //     ref.current.focus();
    //     isFirstRender.current = false;
    //   }
    // }, []);
    useEffect(() => {
      if (ref?.current && autoFocus) {
        ref.current.focus();
      }
    }, [autoFocus]);




    // useEffect(() => {
    //   if (!isFirstRender.current && ref?.current === document.activeElement) {
    //     ref.current.blur();
    //   }
    // }, [value]);
    // useEffect(() => setCurrentIndex(Date.now()), []);

    // useEffect(() => {
    //   const dropDownElement = document.getElementById(
    //     `dropdown${currentIndex}`
    //   );
    //   if (!dropDownElement) return;

    //   const handleKeyDown = (ev) => {
    //     if (ev.key === "Enter" || ev.key === "Tab") {
    //       if (nextRef?.current) {
    //         nextRef.current.focus();
    //         ev.preventDefault();
    //       }
    //     }
    //   };

    //   dropDownElement.addEventListener("keydown", handleKeyDown);

    //   return () => {
    //     dropDownElement.removeEventListener("keydown", handleKeyDown);
    //   };
    // }, [currentIndex, nextRef]);
    useEffect(() => {
      if (!ref?.current) return;

      const handleKeyDown = (ev) => {
        if ((ev.key === "Enter" || ev.key === "Tab") && nextRef?.current) {
          nextRef.current.focus();
          ev.preventDefault();
        }
      };

      ref.current.addEventListener("keydown", handleKeyDown);

      return () => {
        ref.current?.removeEventListener("keydown", handleKeyDown);
      };
    }, [nextRef, ref]);
    return (
      <div className={` `}>
        {label && (
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {required ? <RequiredLabel name={label} /> : `${label}`}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
     focus:outline-none border-blue-600 transition-all duration-200
     ${readOnly || disabled ? "bg-slate-100" : ""} 
    ${className}`}
          disabled={disabled}
          readOnly={readOnly}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Select</option>
          {(options || [])?.map((option) => (
            <option key={option.id} value={option.id}>
              <span></span> {option[labelField]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
export const DropdownWithSearch3 = forwardRef(
  (
    {
      className,
      options,
      value,
      setValue,
      readOnly,
      disabled,
      required = false,
      labelField,
      label,
      nextRef = null,
      classNameForOptions, // 👈 next input ref
    },
    ref
  ) => {
    // 👈 next input ref
    // console.log(classNameForOptions, "classNameForOptions")

    const [currentIndex, setCurrentIndex] = useState("");
    useEffect(() => setCurrentIndex(Date.now()), []);

    useEffect(() => {
      const dropDownElement = document.getElementById(
        `dropdown${currentIndex}`
      );
      if (!dropDownElement) return;

      const handleKeyDown = (ev) => {
        if (ev.key === "Enter" || ev.key === "Tab") {
          if (nextRef?.current) {
            nextRef.current.focus();
            ev.preventDefault();
          }
        }
      };

      dropDownElement.addEventListener("keydown", handleKeyDown);

      return () => {
        dropDownElement.removeEventListener("keydown", handleKeyDown);
      };
    }, [currentIndex, nextRef]);

    return (
      <div id={`dropdown${currentIndex}`} className={` mb-2`}>
        {label && (
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {required ? <RequiredLabel name={label} /> : `${label}`}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-5 py-5 text-xs border border-slate-300 rounded-md 
    focus:border-indigo-300 focus:outline-none transition-all duration-200
    hover:border-slate-400 ${readOnly || disabled ? "bg-slate-100" : ""} 
    ${className}`}
          disabled={disabled}
          readOnly={readOnly}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Select</option>
          {(options || [])?.map((option) => (
            <option key={option.id} value={option.id}>
              <span></span> {option[labelField]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
export const DropdownWithSearch2 = forwardRef(
  (
    {
      className,
      options,
      value,
      setValue,
      readOnly,
      disabled,
      required = false,
      labelField,
      label,
      nextRef = null,
      classNameForOptions, // 👈 next input ref
    },
    ref
  ) => {
    // 👈 next input ref
    // console.log(classNameForOptions, "classNameForOptions")

    const [currentIndex, setCurrentIndex] = useState("");
    useEffect(() => setCurrentIndex(Date.now()), []);

    useEffect(() => {
      const dropDownElement = document.getElementById(
        `dropdown${currentIndex}`
      );
      if (!dropDownElement) return;

      const handleKeyDown = (ev) => {
        if (ev.key === "Enter" || ev.key === "Tab") {
          if (nextRef?.current) {
            nextRef.current.focus();
            ev.preventDefault();
          }
        }
      };

      dropDownElement.addEventListener("keydown", handleKeyDown);

      return () => {
        dropDownElement.removeEventListener("keydown", handleKeyDown);
      };
    }, [currentIndex, nextRef]);

    return (
      <div id={`dropdown${currentIndex}`} className={` mb-2`}>
        {label && (
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {required ? <RequiredLabel name={label} /> : `${label}`}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
    focus:border-indigo-300 focus:outline-none transition-all duration-200
    hover:border-slate-400 ${readOnly || disabled ? "bg-slate-100" : ""} 
    ${className}`}
          disabled={disabled}
          readOnly={readOnly}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Select</option>
          {(options || [])?.map((option) => (
            <option key={option.companyName} value={option.companyName}>
              <span></span> {option[labelField]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
export const DropdownWithSearch1 = forwardRef(
  (
    {
      className,
      options,
      value,
      setValue,
      readOnly,
      disabled,
      required = false,
      labelField,
      label,
      nextRef = null,
      classNameForOptions, // 👈 next input ref
    },
    ref
  ) => {
    // 👈 next input ref
    // console.log(classNameForOptions, "classNameForOptions")

    const [currentIndex, setCurrentIndex] = useState("");
    useEffect(() => setCurrentIndex(Date.now()), []);

    useEffect(() => {
      const dropDownElement = document.getElementById(
        `dropdown${currentIndex}`
      );
      if (!dropDownElement) return;

      const handleKeyDown = (ev) => {
        if (ev.key === "Enter" || ev.key === "Tab") {
          if (nextRef?.current) {
            nextRef.current.focus();
            ev.preventDefault();
          }
        }
      };

      dropDownElement.addEventListener("keydown", handleKeyDown);

      return () => {
        dropDownElement.removeEventListener("keydown", handleKeyDown);
      };
    }, [currentIndex, nextRef]);

    return (
      <div id={`dropdown${currentIndex}`} className={` mb-2`}>
        {label && (
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {required ? <RequiredLabel name={label} /> : `${label}`}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-2 py-1 text-xs border border-slate-300 rounded-md 
    focus:border-indigo-300 focus:outline-none transition-all duration-200
    hover:border-slate-400 ${readOnly || disabled ? "bg-slate-100" : ""} 
    ${className}`}
          disabled={disabled}
          readOnly={readOnly}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">Select</option>
          {(options || [])?.map((option) => (
            <option key={option.EMPID} value={option.EMPID}>
              <span></span> {option[labelField]}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

export const MultiSelectDropdown = ({
  name,
  selected,
  label,
  setSelected,
  options,
  readOnly = false,
  tabIndex = null,
  className = "",
  required,
}) => {
  // console.log(selected, "selected");

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "15px",
      height: "15px",
      fontSize: "12px",
      borderRadius: "0.5rem", // rounded-lg
      outline: "none",
      transition: "all 150ms", // transition-all duration-150
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm
      padding: "0.25rem", // p-1
      borderColor: state.isFocused ? "" : "#cbd5e1", // focus:border-blue-500
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : undefined, // focus:ring-1 focus:ring-blue-500
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "15px",
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "15px",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "14px",
      padding: "8px 12px",
    }),
  };

  return (
    <div
      className={`block text-xs font-bold text-gray-600 mb-1   ${className}`}
    >
      <span className="mb-2">
        {required ? <RequiredLabel name={label ? label : name} /> : name}
      </span>
      {/* {console.log(options, "options")} */}
      <MultiSelect
        options={options}
        value={selected}
        onChange={readOnly ? () => { } : setSelected}
        labelledBy="Select"
        hasSelectAll={false}
        // styles={{
        //   container: (base) => ({
        //     ...base,
        //     fontSize: "12px",
        //     minHeight: "100px", // container height
        //     width: "70px",       // container width
        //   }),
        //   control: (base) => ({
        //     ...base,
        //     padding: "2px",
        //     borderRadius: "10px",
        //     boxShadow: "none",
        //     border: "1px solid #ccc",
        //     minHeight: "100px", // control height
        //     width: "70px",       // control width
        //   }),
        //   option: (base, state) => ({
        //     ...base,
        //     fontSize: "12px",
        //     backgroundColor: state.isSelected ? "#e0e7ff" : "#fff",
        //     padding: "4px 8px",
        //   }),
        //   chips: (base) => ({
        //     ...base,
        //     fontSize: "12px",
        //     padding: "2px 4px",
        //   }),
        //   searchBox: (base) => ({
        //     ...base,
        //     fontSize: "12px",
        //     padding: "2px",
        //   }),
        // }}
        styles={customSelectStyles}
      />
    </div>
  );
};
