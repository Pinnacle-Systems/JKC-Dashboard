import React, { useState, useMemo, useEffect } from 'react';
import { useGetArticleIdQuery } from '../../redux/service/poData';
import Scene from '../../components/loader/Loader';

const ArticleIdSelect = ({ selectedArticleId, setSelectedArticleId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading, isFetching } = useGetArticleIdQuery();

    const handleClick = (item) => {
        const isSelected = selectedArticleId.includes(item.articleId);

        if (isSelected) {
            setSelectedArticleId(prev => prev.filter(articleId => articleId !== item.articleId));
        } else {
            setSelectedArticleId(prev => [...prev, item.articleId]);
        }
    };

    const suppData = useMemo(() => (data?.data ? data.data : []), [data]);

    const filterData = suppData.filter(item => item.articleId.toLowerCase().includes(searchTerm.toLowerCase()));



    return (
        <div className="w-full h-full bg-white rounded-b-lg pb-1 flex flex-col items-center justify-center">
            {isLoading ? <Scene /> : (
                <div className='overflow-y-auto scrollbar h-full w-full'>
                    <div className=''>
                        <input type="text" className=' h-7 rounded flex items-center' placeholder='Item' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>


                    <div className='overflow-y-auto scrollbar h-full'>
                        {(filterData ? filterData : []).map((item, index) => (
                            <div
                                key={index}
                                className={`w-[14.75rem] truncate border rounded cursor-pointer content-font font-medium p-1 ${selectedArticleId.includes(item.articleId) ? 'select-clr hover:select-clr' : 'hover:bg-gray-200'}`}
                                onClick={() => handleClick(item)}
                                title={item.articleId}
                            >
                                {item.articleId}
                            </div>
                        ))}
                    </div>

                </div>)}
        </div>
    );
}

export default ArticleIdSelect;
