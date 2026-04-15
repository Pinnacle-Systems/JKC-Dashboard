import React, { useMemo, useState } from 'react'
import { useGetSupplierQuery } from '../../redux/service/poData';
import Scenes from '../../components/loader/Loader';

const MultiSelect = ({ selectedSupplier, setSelectedSupplier }) => {
    const { data, isLoading } = useGetSupplierQuery();
    const [searchItem, setSearchItem] = useState('');


    const suppData = useMemo(() => (data?.data ? data.data : []), [data]);
    const filterData = suppData.filter(item => item.supplier.toLowerCase().includes(searchItem.toLowerCase()));

    const handleClick = (item) => {
        const isSelected = selectedSupplier.includes(item.supplier);

        if (isSelected) {
            setSelectedSupplier(prev => prev.filter(supplier => supplier !== item.supplier));
        } else {
            setSelectedSupplier(prev => [...prev, item.supplier]);
        }
    };
    return (
        <div className="w-full h-full bg-white rounded-b-lg pb-4   flex flex-col items-center justify-center">
            {isLoading ? <Scenes /> : (<div className='overflow-y-auto scrollbar h-full w-full'>
                <div className=''>
                    <input type="text" className='w-full h-7    rounded' placeholder='Supplier' value={searchItem} onChange={(e) => setSearchItem(e.target.value)} />
                </div>
                <div className='overflow-y-auto scrollbar h-full '>
                    {(filterData ? filterData : []).map((item, index) => (
                        <div
                            key={index}
                            className={`w-[14.75rem] truncate border rounded cursor-pointer content-font font-medium   p-1 ${selectedSupplier.includes(item.supplier) ? 'select-clr hover:select-clr' : 'hover:bg-gray-200'}`}
                            onClick={() => handleClick(item)}
                            title={item.supplier}
                        >
                            {item.supplier}
                        </div>
                    ))}
                </div></div>)}
        </div>



    );
};

export default MultiSelect;
