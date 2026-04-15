import React, { useState, useRef } from 'react';
import { CiMenuKebab } from 'react-icons/ci';
import { IoMdDownload } from 'react-icons/io';
import html2canvas from 'html2canvas'; // Import for capturing screenshots
import { useGetTopItemsQuery } from '../../../redux/service/poData';
import SortedBarChart from './SortedBarChart';
import CardWrapper from '../../../components/CardWrapper';
import BuyerMultiSelect from '../../../components/ModelMultiSelect1';
import BgDetail from '../../../components/BgDet';

const BloodGrp = ({ option }) => {
    const [selected, setSelected] = useState();
    const [showModal, setShowModal] = useState(false);
    const [openpopup,setOpenpopup] = useState(false)
    const { data: topItem } = useGetTopItemsQuery({ filterBuyer: selected });
    const topItems = topItem?.data || [];

    // Toggle the dropdown
 console.log(topItems,"topItems");
 
    const chartRef = useRef(null); // Step 1: Create chartRef
 
    // Capture and download the chart as an image
   

    return (
        <CardWrapper heading={"Blood Group Distribution"} onFilterClick={() => setShowModal(true)} chartRef = {chartRef}>
            <div
                id="chartBloodGroup"
                ref = {chartRef}
                className="relative mt-2 rounded-lg p-2"
                style={{
                    width: '100%', 
                    height: '360px',
                    backgroundColor: '#fff', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    borderRadius: "10px"
                }}
            >
                {selected &&
                <div onClick={()=>setOpenpopup(true)}> <SortedBarChart topItems={topItems} />
                </div>}
                {openpopup && (<BgDetail selectedBuyer={selected} setOpenpopup ={setOpenpopup} openpopup={openpopup}  />)}
                
            
            </div>

            {showModal &&
                <BuyerMultiSelect
                    selected={selected}
                    setSelected={setSelected}
                    showModel={showModal}
                    setShowModel={setShowModal}
                />
            }
        </CardWrapper>
    );
};

export default BloodGrp;
