import React, { useState, useRef, useContext } from "react";
import BuyerWiseRevenueGen from "../BuyerWiseRev/BuyerWiseRevenue";
import { useGetMisDashboardOrdersInHandQuery } from "../../../redux/service/misDashboardService";
import BuyerMultiSelect from "../../../components/ModelMultiSelect1";
import { ColorContext } from "../../global/context/ColorContext";
import CardWrapper from "../../../components/CardWrapper";
const PieChart = ({setOpenpopup,openpopup,selected,setSelected}) => {
    const [showModel, setShowModel] = useState(false);
  
    const { data } = useGetMisDashboardOrdersInHandQuery({ params: { filterBuyer: selected } });
    const ordersInHandBuyerWise = data?.data || "";
    const { color } = useContext(ColorContext);
    const chartRef = useRef(null); // Step 1: Create chartRef

    console.log(ordersInHandBuyerWise,"ordersInHandBuyerWise");
    

    return (
        
        <CardWrapper heading="Age Distribution" onFilterClick={() => setShowModel(true)} chartRef={chartRef}> 
            {/* Step 2: Pass chartRef to CardWrapper */}
            <div
                id="chart"
                ref={chartRef} // Step 3: Attach ref to the chart div
                className="mt-2 mb-2 rounded-lg"
                 onClick={()=>setOpenpopup(true)}
                style={{
                    width: '100%', 
                    height: '360px',
                    backgroundColor: '#fff', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    borderRadius: "10px"
                }}
            >
                <BuyerWiseRevenueGen buyerRev={ordersInHandBuyerWise} color={color} />
            </div>
      
            {showModel && (
                <BuyerMultiSelect
                    selected={selected}
                    setSelected={setSelected}
                    color={color}
                    showModel={showModel}
                    setShowModel={setShowModel}
                />
            )}
         
        </CardWrapper>
    );
};

export default PieChart;
