import React, { Children, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push, remove } from "../../redux/features/opentabs";

import { CLOSE_ICON, DOUBLE_NEXT_ICON } from "../../icons";
import { useState } from "react";
import useOutsideClick from "../../CustomHooks/handleOutsideClick";
import PoRegister from "../poRegister";
import { FreeLookDyeing, MisDashboard, PurchaseDashboard } from "../../scenes";
import MisDashboardERP from "../MisDashboard copy";
import OrderManagement from "../OrderManagement";
// import OutlinedCard from "../Users/Users";
import { ColorContext } from "../global/context/ColorContext";
import Main_Dashboad from "../maindashboard";

import UserCreation from "../User & Role/Users.jsx";

import secureLocalStorage from "react-secure-storage";

import Sidebar from "../global/Sidebar.jsx";
import { User } from "lucide-react";
import RolePermission from "../User & Role/Roles.jsx";
import EmployeeDetail from "../maindashboard/DetailedDashboard/EmployDetail.js";
// import DetailedDashBoard from "../maindashboard/DetailedDashboard/index.js";
import DetailedAttribution from "../maindashboard/Attrition/index.js";
import DetailedHeadcount from "../maindashboard/Headcount/index.js";
import DetailedDashBoard from "../maindashboard/ESIdata/index.js";
import PFIndex from "../maindashboard/PFdata/index.js";
import SalaryIndex from "../maindashboard/salarydata/salaryIndex.js";
import TurnOverIndex from "../GarmentsDashboard/salarydata/TurnOverindex.jsx";
import HRDashboard from "../hrdashboard/index.js";
import FabricInward from "../FreelookDyeing/FabricInward/FabricInward.jsx";
import GarmentDashboard from "../GarmentsDashboard/index";
import OutwardOverview from "../FreelookDyeing/FabricOutward/OutwardOverview.jsx";
import PurchaseHome from "../GarmentsDashboard/Purchase/PurchaseHome.jsx";

const ActiveTabList = () => {
  const { color } = useContext(ColorContext);
  const openTabs = useSelector((state) => state.openTabs);
  useEffect(() => {
    const container = document.querySelector(".active-tab-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [openTabs.tabs]);
  const dispatch = useDispatch();
  const [showHidden, setShowHidden] = useState(false);
  const ref = useOutsideClick(() => {
    setShowHidden(false);
  });

  const tabs = {
    Dashboard: <MisDashboard />,
    ERP: <MisDashboardERP />,
    "Employees Detail": <PoRegister />,
    "Order Status": <OrderManagement />,
    // "User": <OutlinedCard />,
    User: {
      label: "User Management",
      Children: {
        User: <UserCreation />,
        Roles: <RolePermission />,
      },
    },
    "MIS Dashboard": <Main_Dashboad />,
    ESIDetail: (tabData) => (
      <DetailedDashBoard
        companyName={tabData?.companyName}
        Year={tabData?.Year}
        autoFocusBuyer={tabData?.autoFocusBuyer}
        selectedmonth={tabData?.selectedmonth}
      />
    ),
    PFDetails: (tabData) => (
      <PFIndex
        companyName={tabData?.companyName}
        Year={tabData?.Year}
        autoFocusBuyer={tabData?.autoFocusBuyer}
        selectedmonth={tabData?.selectedmonth}
      />
    ),
    Headcount: (tabData) => (
      <DetailedHeadcount companyName={tabData?.companyName} />
    ),
    Attrition: (tabData) => (
      <DetailedAttribution
        companyName={tabData?.companyName}
        Year={tabData?.Year}
        autoFocusBuyer={tabData?.autoFocusBuyer}
        selectedmonth={tabData?.selectedmonth}
      />
    ),
    SalaryDetail: (tabData) => (
      <SalaryIndex
        companyName={tabData?.companyName}
        Year={tabData?.Year}
        selectedmonth={tabData?.selectedmonth}
        autoFocusBuyer={tabData?.autoFocusBuyer}
      />
    ),
    "HR DashBoard": <HRDashboard />,
    "Dyeing Dashboard": <FreeLookDyeing />,
    FabricInward: (tabData) => (
      <FabricInward
        finYear={tabData?.finYear}
        year={tabData?.year}
        selectCategory={tabData?.selectCategory}
      />
    ),
    FabricOutward: (tabData) => (
      <OutwardOverview
        year={tabData?.year}
        finYear={tabData?.finYear}
        selectCategory={tabData?.selectCategory}
      />
    ),
    "Garments Dashboard": <GarmentDashboard />,
    TurnOver: (tabData) => (
      <TurnOverIndex
        companyName={tabData?.companyName}
        finYear={tabData?.finYear}
        selectedYear={tabData?.selectedYear}
        filterBuyer={tabData?.filterBuyer}
        user={tabData?.user}
        selectMonths={tabData?.selectMonths}
        filterBuyerList={tabData?.filterBuyerList}
        finYr={tabData?.finYr}
        autoFocusBuyer={tabData?.autoFocusBuyer}
      />
    ),
    Purchase: (tabData) => (
      <PurchaseHome
        companyName={tabData?.companyName}
        finYear={tabData?.finYear}
        selectedYear={tabData?.selectedYear}
        filterBuyer={tabData?.filterBuyer}
        user={tabData?.user}
        selectMonths={tabData?.selectMonths}
        filterBuyerList={tabData?.filterBuyerList}
        finYr={tabData?.finYr} poType={tabData?.poType}
        autoFocusBuyer={tabData?.autoFocusBuyer}
      />
    ),
    "Purchase Dashboard": (tabData) => (
      <PurchaseDashboard year={tabData?.year} />
    ),
  };

  const innerWidth = window.innerWidth;
  const itemsToShow = innerWidth / 130;
  const currentShowingTabs = openTabs.tabs.slice(0, parseInt(itemsToShow));
  const hiddenTabs = openTabs.tabs.slice(parseInt(itemsToShow));

  const findTabComponent = (tabs, tabName, tabData) => {
    for (const key in tabs) {
      const item = tabs[key];

      if (key === tabName && React.isValidElement(item)) {
        return item;
      }
      if (key === tabName && typeof item === "function") {
        return item(tabData);
      }

      // If the tab has children, search inside them
      if (item.Children) {
        const childResult = findTabComponent(item.Children, tabName, tabData);
        if (childResult) return childResult;
      }
    }
    return null;
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* <div className="flex justify-between "> */}
      <div
        className="flex justify-between sticky top-0 z-50 "
        style={{ backgroundColor: "#E5E7EB" }}
      >
        <div className="flex gap-2  ml-3 p-1">
          {currentShowingTabs.map((tab, index) => (
            <div
              key={index}
              className={`p-1 rounded subheading-font text-xs flex justify-center gap-1`}
              style={
                tab.active
                  ? { backgroundColor: color, color: "white" }
                  : { backgroundColor: "white", color: color }
              }
            >
              <button
                onClick={() => {
                  dispatch(push({ id: tab.id }));
                }}
                className=""
              >
                {tab.name}
              </button>
              <button
                className="px-1 rounded-xs transition"
                onClick={() => {
                  dispatch(remove({ id: tab.id }));
                }}
              >
                {CLOSE_ICON}
              </button>
            </div>
          ))}
        </div>
        <div>
          {hiddenTabs.length !== 0 && (
            <button onClick={() => setShowHidden(true)}>
              {DOUBLE_NEXT_ICON}
            </button>
          )}
        </div>
        {showHidden && (
          <ul ref={ref} className="absolute right-0 top-5 bg-gray-200 z-50 p-1">
            {hiddenTabs.map((tab) => (
              <li
                key={tab.id}
                className={`flex justify-between hover:bg-blue-200  ${
                  tab.active ? "bg-red-300" : "bg-gray-300"
                } `}
              >
                <button
                  className=" text-gray-500"
                  onClick={() => {
                    dispatch(push({ id: tab.id }));
                  }}
                >
                  {tab.name}
                </button>
                <button
                  className="hover:bg-red-400 px-1 rounded-xs transition"
                  onClick={() => {
                    dispatch(remove({ id: tab.id }));
                  }}
                >
                  {CLOSE_ICON}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* <Sidebar /> */}
      {openTabs.tabs.map((tab, index) => (
        <div
          key={index}
          className={`${tab.active ? "block" : "hidden"} w-full`}
        >
          {findTabComponent(tabs, tab.name, tab.data) || (
            <div className="text-center text-gray-400 p-10">
              Page not found for: {tab.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActiveTabList;
