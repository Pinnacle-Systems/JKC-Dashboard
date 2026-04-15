import React from 'react';
import NumericCard from '../../components/NumericCard';
import './HeaderStyles.css'; 
import staff from "../../assets/staff.png"
import TransitionAlerts from '../../components/AnimatedModel';
const Header = ({
    selectedBuyer,
    setSelectedBuyer,tempSelectedBuyer,setTempSelectedBuyer,
    refetch,
    misData,search,setSearch,payCat,setPayCat
}) => {
    console.log(selectedBuyer,"selectedBuyer")
    return (
        <>
       {/* <div className='absolute right-0 top-0' >
  <img
    src={staff}
    style={{ width: '20%', height: 'auto', borderRadius: '8px', zIndex: 10, position: 'relative' }}
  />
      </div> */}
    
        <NumericCard
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            tempSelectedBuyer = {tempSelectedBuyer}
            setTempSelectedBuyer = {setTempSelectedBuyer}
            refetch={refetch}
            misData={misData}
            setSearch = {setSearch}
            search =  {search}
            payCat = {payCat}
            setPayCat = {setPayCat}
        />
        </>
      
    );
};

export default Header;
