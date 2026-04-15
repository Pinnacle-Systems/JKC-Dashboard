import React, { useState, useContext, useEffect } from "react";
import { ColorContext } from "../scenes/global/context/ColorContext";
import './ToggleSwitch.css';
import './Model.css';
import ModelMultiSelect from "./ModelMultiSelect";
import FilterOptions from "./FilterOptions";
import Movable from "./Movable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faMale, faFemale } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { FaSyncAlt } from "react-icons/fa";
import { useExecuteProcedureMutation } from "../redux/service/misDashboardService";
import DataDetailTable from "./DataDetailTable";
import SalaryDetail from "./SalaryDet";
import PfDetail from "./PfDet";
import EsiDetail from "./EsiDet";
import AttritionDet from "./AttDet";


const NumericCard = ({ misData, selectedBuyer,search,setSearch,
  setSelectedBuyer,tempSelectedBuyer,setTempSelectedBuyer,payCat,setPayCat

}) => {
  const totalTurnOver = misData?.data?.totalTurnOver || [];
  const totalTurnOver1 = misData?.data?.totalTurnOver1 || [];
  const profit = misData?.data?.profit || [];
  const profit1 = misData?.data?.profit1 || [];
  const [selectedState, setSelectedState] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(null) 
  const [showTable,setShowTable] = useState(false) 
    const [selectedGender, setSelectedGender] = useState("All");
    const [loading, setLoading] = useState(false);
  const newCustomers = misData?.data?.newCustomers || [];
  const topCustomers = misData?.data?.topCustomers || [];
  const loss = misData?.data?.loss || [];
  const loss01 = misData?.data?.loss01 || [];

  const loss1 = misData?.data?.loss1 || [];
  const loss11 = misData?.data?.loss11 || [];
  const [executeProcedure] = useExecuteProcedureMutation();

  const { color } = useContext(ColorContext);

  const filteredTotalTurnOver = totalTurnOver.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filteredTotalTurnOver1 = totalTurnOver1.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filterNewCus = newCustomers.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filteredTopCus = topCustomers.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );

  const filterLoss = loss.filter((item) => selectedBuyer.includes(item.comCode));
  const filterLoss01 = loss01.filter((item) => selectedBuyer.includes(item.comCode));
  const filterLoss1 = loss1.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const filterLoss11 = loss11.filter((item) =>
    selectedBuyer.includes(item.comCode)
  );
  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await executeProcedure().unwrap();
      alert(response.message);
    } catch (error) {
      alert("Error: " + (error.data?.error || "Failed to execute procedure"));
    } finally {
      setLoading(false);
    }
  };
  var currMonthName = moment().format('MMM YY');
  var prevMonthName = moment().subtract(1, "month").format('MMM YY');
  // console.log(currMonthName);
  // console.log(prevMonthName);
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
  
  const data = [
    {
      heading: `On Roll Insights - ${currMonthName}`,
      borderColor: "#1F588B",
      value: selectedState == "Labour" ? filteredTotalTurnOver1.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filteredTotalTurnOver.reduce((acc, item) => acc + item.currentValue, 0)
          : filteredTotalTurnOver.reduce((acc, item) => acc + item.currentValue, 0) + filteredTotalTurnOver1.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filteredTotalTurnOver1.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filteredTotalTurnOver.reduce((acc, item) => acc + item.prevValue, 0)
          : filteredTotalTurnOver1.reduce((acc, item) => acc + item.prevValue, 0) + filteredTotalTurnOver.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading:`Attrition Insights - ${prevMonthName}`,

      borderColor: "#62AAA3",
      value: selectedState == "Labour" ? profit1.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? profit.reduce((acc, item) => acc + item.currentValue, 0)
          : profit.reduce((acc, item) => acc + item.currentValue, 0) + profit1.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? profit1.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? profit.reduce((acc, item) => acc + item.prevValue, 0) :
          profit1.reduce((acc, item) => acc + item.prevValue, 0) + profit.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading:`Salary Insights - ${prevMonthName}`,
      borderColor: "#96A669",
      value: selectedState == "Labour" ? filteredTopCus.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterNewCus.reduce((acc, item) => acc + item.currentValue, 0) :
          filteredTopCus.reduce((acc, item) => acc + item.currentValue, 0) + filterNewCus.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filteredTopCus.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterNewCus.reduce((acc, item) => acc + item.prevValue, 0) :
          filteredTopCus.reduce((acc, item) => acc + item.prevValue, 0) + filterNewCus.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading:`PF Insights - ${prevMonthName}`,
      borderColor: "#F4A300",
      value: selectedState == "Labour" ? filterLoss.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterLoss01.reduce((acc, item) => acc + item.currentValue, 0) :
          filterLoss.reduce((acc, item) => acc + item.currentValue, 0) + filterLoss01.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filterLoss.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterLoss01.reduce((acc, item) => acc + item.prevValue, 0) :
          filterLoss.reduce((acc, item) => acc + item.prevValue, 0) + filterLoss01.reduce((acc, item) => acc + item.prevValue, 0),

    },
    {
      heading:`ESI Insights - ${prevMonthName}`,
      borderColor: "#F4A300",
      value: selectedState == "Labour" ? filterLoss1.reduce((acc, item) => acc + item.currentValue, 0)
        : selectedState == "Staff" ? filterLoss11.reduce((acc, item) => acc + item.currentValue, 0) :
          filterLoss1.reduce((acc, item) => acc + item.currentValue, 0) + filterLoss11.reduce((acc, item) => acc + item.currentValue, 0),
      previousValue: selectedState == "Labour" ? filterLoss1.reduce((acc, item) => acc + item.prevValue, 0)
        : selectedState == "Staff" ? filterLoss11.reduce((acc, item) => acc + item.prevValue, 0) :
          filterLoss1.reduce((acc, item) => acc + item.prevValue, 0) + filterLoss11.reduce((acc, item) => acc + item.prevValue, 0),

    },
  ];

  
  
  const [activeTabs, setActiveTabs] = useState(data.map(() => "total"));

  const toggleTab = (index, tab) => {
    const newTabs = [...activeTabs];
    newTabs[index] = tab;
    setActiveTabs(newTabs);
  };
  // console.log(showTable,"showTable")
 
  const calculatePercentage = (value, totalValue) => {
    if (totalValue === 0) return 0;
    return ((value / totalValue) * 100).toFixed(2);
  };

  const handleFilterClick = () => {
    setShowModel((prevState) => !prevState);
  };

  const onInfoShowText = selectedState == "All" ? "All Employees" : selectedState;
// console.log(typeof(selectedIndex),"selectIndex")

  return (
    <div className="flex w-full">
          {showTable && selectedIndex=== 0 &&(
  <DataDetailTable
    selectedIndex={selectedIndex}
    selectedBuyer={selectedBuyer}
    closeTable={() => setShowTable(false)}
    setSearch={setSearch}
    selectedState={selectedState}
    setSelectedState={setSelectedState}
    search={search}
    selectedGender={selectedGender} 
    setSelectedGender={setSelectedGender} 
    color= {color}
    payCat = {payCat}
  />
)}
{showTable  && selectedIndex=== 2 && (
   <SalaryDetail
   selectedBuyer={selectedBuyer}
   selectedIndex={selectedIndex}
   closeTable={() => setShowTable(false)}
   setSearch={setSearch}
   selectedState={selectedState}
   setSelectedState={setSelectedState}
   search={search}
   selectedGender={selectedGender} 
   setSelectedGender={setSelectedGender} 
   color= {color}
 />
)}
{showTable  && selectedIndex=== 1 && (
   <AttritionDet
   selectedBuyer={selectedBuyer}
   selectedIndex={selectedIndex}
   closeTable={() => setShowTable(false)}
   setSearch={setSearch}
   selectedState={selectedState}
   setSelectedState={setSelectedState}
   search={search}
   selectedGender={selectedGender} 
   setSelectedGender={setSelectedGender} 
   color= {color}
 />
)}
{showTable  && selectedIndex=== 3 && (
   <PfDetail
   selectedBuyer={selectedBuyer}
   selectedIndex={selectedIndex}
   closeTable={() => setShowTable(false)}
   setSearch={setSearch}
   selectedState={selectedState}
   setSelectedState={setSelectedState}
   search={search}
   selectedGender={selectedGender} 
   setSelectedGender={setSelectedGender} 
   color= {color}
 />
)}
{showTable  && selectedIndex=== 4 && (
   <EsiDetail
   selectedBuyer={selectedBuyer}
   selectedIndex={selectedIndex}
   closeTable={() => setShowTable(false)}
   setSearch={setSearch}
   selectedState={selectedState}
   setSelectedState={setSelectedState}
   search={search}
   selectedGender={selectedGender} 
   setSelectedGender={setSelectedGender} 
   color= {color}
 />
)}
     {showModel && (
        <Movable divId="cardMovable">
          <ModelMultiSelect
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            tempSelectedBuyer = {tempSelectedBuyer}
            setTempSelectedBuyer = {setTempSelectedBuyer}
            color={color}
            showModel={showModel}
            setShowModel={setShowModel}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            payCat = {payCat}
            setPayCat  = {setPayCat}
          />
        </Movable>
      )}
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2 bg-gray-200">
<button
    className="absolute right-0 top-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 shadow-[3px_3px_0px_#888] hover:brightness-105 active:shadow-none active:translate-y-1 active:scale-95 transition-all duration-200 group"
    onClick={handleClick}
  >
    {/* <FaSyncAlt className="text-base drop-shadow-sm" /> */}
    <span className="text-xs font-semibold hidden group-hover:inline-block">
      Refreshsss
    </span>
   
  </button>

  {loading && (
  <div className="absolute top-0 right-24 flex items-center gap-2 bg-white shadow-md px-3 py-2 rounded-lg border border-gray-200">
    <div className="animate-spin">
      <FaSyncAlt className="text-lg" style={{color: color}} />
    </div>
    <span className="text-sm font-semibold text-gray-700">Loading...</span>
  </div>
)}



  {data.map((val, i) => {

    console.log(data,"selectedGenderIndex")
    const totalValueIndex0 = data[0].value + data[0].previousValue;
    const totalValue = val.value + val.previousValue;
    const malePercentage = calculatePercentage(val.previousValue, i === 1 ? totalValueIndex0 : totalValue);
    const femalePercentage = calculatePercentage(val.value, i === 1 ? totalValueIndex0 : totalValue);
    
    //  console.log(totalValueIndex0,"totalValueIndex0")
    let attritionPercentage = null;
    if (i === 1) {
      if (totalValueIndex0 && totalValueIndex0 !== 0) {
        attritionPercentage = (totalValue * 100) / parseFloat(totalValueIndex0);

        attritionPercentage = attritionPercentage.toFixed(2);         
      } else {
        // console.log('Error: totalValueIndex0 is invalid');
        attritionPercentage = "0"; 
      }
    }
    
  // console.log(attritionPercentage,"attritionPercentage")
    return (
      <div
        key={i} 
        className="group relative rounded-lg shadow-md bg-gradient-to-tr from-white to-gray-100 transform hover:scale-105 hover:shadow-lg transition-all duration-300 h-[138px] p-3"
      >
        <div className="text-center">
          <div className="flex justify-between items-center">
            <h4 className="text-[16px] font-semibold text-gray-800 truncate">
              {val.heading}
            </h4>
            <span
              className="text-gray-600 text-2xl transition-transform duration-300"
              style={{ color: color ? `${color}` : "#4B5563" }}
            >
              <FilterOptions
                isGroupHover
                onFilterClick={handleFilterClick}
                onInfoShowText={onInfoShowText}
              />
            </span>
          </div>
          <div className="flex justify-between items-center">
            {/* Value Display */}
            <p
  className="text-lg font-bold mb-1 mt-4 flex-1 text-left cursor-pointer hover:text-blue-600 transition"
  onClick={() => {
    setSelectedIndex(i);
    setShowTable(true);
  }}
>
{activeTabs[i] === "total"
    ? i >= 2 && i <= 4
      ? `₹ ${totalValue.toLocaleString('en-IN')}`
      : totalValue.toLocaleString('en-IN')
    : activeTabs[i] === "previousValue"
    ? i >= 2 && i <= 4
      ? `₹ ${val.previousValue.toLocaleString('en-IN')}`
      : val.previousValue.toLocaleString('en-IN')
    : i >= 2 && i <= 4
    ? `₹ ${val.value.toLocaleString('en-IN')}`
    : val.value.toLocaleString('en-IN')}
</p>



            <p className="text-lg font-bold mt-4 flex-1 text-right">
              {activeTabs[i] === "total"
                ? i === 1
                  ? `${attritionPercentage}%`
                  : "100%"
                : activeTabs[i] === "previousValue"
                ? `${malePercentage}%`
                : `${femalePercentage}%`}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-between mt-3">
          <button
           onClick={() => {
            toggleTab(i, "total");setSelectedGender("All");
          }}
          
            className={`w-1/3 px-1 py-1 rounded-l-full text-xs font-medium shadow-md transition ${
              activeTabs[i] === "total"
                ? "text-white"
                : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
            }`}
            style={
              activeTabs[i] === "total"
                ? { backgroundColor: color || "#CA8A04" }
                : {}
            }
          >
            Total
          </button>
          <button
            onClick={() => {toggleTab(i, "previousValue"); setSelectedGender('Male')}}
            className={`w-1/3 px-1 py-1 text-xs font-medium shadow-md transition ${
              activeTabs[i] === "previousValue"
                ? "bg-[#CA8A04] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
            }`}
            style={ 
              activeTabs[i] === "previousValue"
                ? { backgroundColor: color || "#CA8A04" }
                : {}
            }
          >
            Male
          </button>
          <button
            onClick={() => {toggleTab(i, "value"); setSelectedGender("Female")}}
            className={`w-1/3 px-1 py-1 rounded-r-full text-xs font-medium shadow-md transition ${
              activeTabs[i] === "value"
                ? "bg-[#CA8A04] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-[#232E3F] hover:text-white"
            }`}
            style={
              activeTabs[i] === "value"
                ? { backgroundColor: color || "#CA8A04" }
                : {}
            }
          >
            Female
          </button>
        </div>
      </div>
    );
  })}
</div>
    </div>
  );
};

export default NumericCard;




