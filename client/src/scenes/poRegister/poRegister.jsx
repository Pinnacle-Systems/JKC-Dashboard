import React from "react"; // Don't forget to import React
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useGetPoDataQuery } from '../../redux/service/poData';
import { useMemo } from 'react';
import Scenes from "../../components/loader/Loader";


const columns = [
  {
    field: 'id', headerAlign: 'center', headerName: 'S.no', maxWidth: 70, sortable: false, colGroup: "id", fontWeight: 700, renderHeader: params => (
      <div className='text-[15px] font-medium '>
        S.no
      </div>
    )
  },
  {

    field: 'supplier', headerAlign: 'center', headerName: 'Supplier', sortable: false, minWidth: 300, flex: 1, colGroup: "id", renderHeader: params => (
      <div className='text-[15px] font-medium '>
        Supplier
      </div>
    )
  },

  {
    field: 'q1', type: "number", headerAlign: 'center', headerName: 'Q1', sortable: false, flex: 1, align: 'right', colGroup: "id", valueFormatter: ({ value }) => {
      const formattedValue = parseFloat(value ? value : '').toFixed(2);
      return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, renderHeader: params => (
      <div className='text-[15px] font-medium '>
        Q1
      </div>
    )
  },
  {
    field: 'q2', type: "number", headerAlign: 'center', headerName: 'Q2', sortable: false, flex: 1, align: 'right', color: 'black', valueFormatter: ({ value }) => {
      const formattedValue = parseFloat(value ? value : '').toFixed(2);
      return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, renderHeader: params => (
      <div className='text-[15px] font-medium '>
        Q2
      </div>
    )
  },
  {
    field: 'q3', type: "number", headerAlign: 'center', headerName: 'Q3', sortable: false, flex: 1, align: 'right', valueFormatter: ({ value }) => {
      const formattedValue = parseFloat(value ? value : '').toFixed(2);
      return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, renderHeader: params => (
      <div className='text-[15px] font-medium '>
        Q3
      </div>
    )
  },
  {
    field: 'q4', type: "number", headerAlign: 'center', headerName: 'Q4', sortable: false, flex: 1, align: 'right',
    valueFormatter: ({ value }) => {
      const formattedValue = parseFloat(value ? value : '').toFixed(2);
      return isNaN(formattedValue) ? '' : formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }, renderHeader: params => (
      <div className='text-[15px] font-medium '>
        Q4
      </div>
    )
  },
  {
    field: 'price', type: "number", headerAlign: 'center', headerName: 'Total Value', sortable: false, flex: 1, align: 'right',
    valueFormatter: ({ value }) => {
      const formattedValue = parseFloat(value ? value : '').toFixed(2);
      return formattedValue
    }, renderHeader: params => (
      <div className='text-[14px] font-medium'>
        Total Value
      </div>
    )
  },
];
const columnGroupingModel = [
  {
    groupId: 'Quarterly Details',
    children: [{ field: 'q1' }, { field: 'q2' }, { field: 'q3' }, { field: 'q4' }],
    headerAlign: 'center',

  },
];
function DataTable({ data, totals }) {
  const rowsWithIds = data.map((row, index) => ({ id: index + 1, ...row }));

  const getRowClassName = (params) =>
    `${params.row.id % 2 === 0 ? 'even' : 'odd'} ${gridClasses.row}`;


  const renderTotalCell = (column) => {
    const totalValue = totals[column.field];
    const cellStyle = { width: '100px', textAlign: 'right' };
    if (totalValue !== undefined) {
      const formattedTotal = totalValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return (
        <div key={column.field} className='text-[14px] font-semibold' style={cellStyle}>
          {formattedTotal}
        </div>
      );
    } else {
      return null;
    }
  };


  return (
    <DataGrid
      autoHeight={false}
      className=' custom-data-grid '
      experimentalFeatures={{ columnGrouping: true }}
      columnGroupingModel={columnGroupingModel}
      rows={rowsWithIds}
      columns={columns}
      columnHeaderHeight={"34"}
      showCellVerticalBorder={'2'}
      showColumnVerticalBorder={'10'}
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      disableColumnMenu
      disableRowSelectionOnClick

      getRowClassName={getRowClassName}
      paginationMode="server"

      sx={{
        '& .MuiDataGrid-columnHeader': {
          backgroundColor: '#adb612',
          textAlign: 'center',
          fontSize: '17px',
          fontWeight: '500',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          borderStyle: 'solid',
          color: 'white',

        },

        fontSize: '12px',
        color: '#212121',
        borderWidth: 1,
        borderStyle: 'solid',
        '& .even': {
          backgroundColor: 'white',

        },
        '& .odd': {
          backgroundColor: '#ebe9e9',

        },

        '& .MuiDataGrid-titleContainer': {
          fontSize: '1rem', // Adjust the font size here
        },
        '& .MuiDataGrid-cell': {
          fontSize: '12.25px',
          fontWeight: '',
          color: 'black'

        },
        '& MuiDataGrid-iconButtonContainer ': {
          color: 'red'
        },
        '& .my-super-theme--naming-group': {
          color: 'red'
        },
      }}
      components={{
        Footer: () => (
          <div className='MuiDataGrid-footer items-center w-full bg-white border-solid border-2 border-gray-300 flex justify-between'>
            <h1 className='font-bold text-[16px] total-head py-1'>Total</h1>
            <table className="total-width">
              <thead className='text-white '>
                <tr className=" ">
                  {/* {columns.map(column => (
                    <th key={column.field} className='font-medium text-[14px] hidden'>
                      {column.headerName}
                    </th>
                  ))} */}
                </tr>
              </thead>
              <tbody className='  '>
                <tr className="w-[80%] ">
                  {columns.map(column => (
                    <td key={column.field} className=''>
                      {column.renderFooter ? column.renderFooter(column) : renderTotalCell(column)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ),
      }}
      editMode="row"
      columnWidth={100}
      rowHeight={28}
      hideFooterPagination
      hideFooterSelectedRowCount
    />
  );
}




export default function PoRegister({ year, month, date, selectedSupplier, selectedArticleId }) {
  console.log(date, 'date');
  const { data, isLoading, isFetching } = useGetPoDataQuery({ finYearData: JSON.stringify(year || ''), filterMonth: JSON.stringify(month || ''), filterSupplier: JSON.stringify(selectedSupplier || ''), filterArticleId: JSON.stringify(selectedArticleId || ''), filterDate: JSON.stringify(date || '') });
  const poData = useMemo(() => (data?.data ? data.data : []), [data]);
  const totals = {
    q1: poData.reduce((sum, row) => sum + (row.q1 || 0), 0),
    q2: poData.reduce((sum, row) => sum + (row.q2 || 0), 0),
    q3: poData.reduce((sum, row) => sum + (row.q3 || 0), 0),
    q4: poData.reduce((sum, row) => sum + (row.q4 || 0), 0),
    price: poData.reduce((sum, row) => sum + (row.price || 0), 0),
  };

  return (
    <>
      <div className='text-center bg-gray-200 w-full h-full scrollbar overflow-auto'>
        <div className='h-[100%] overflow-auto flex items-center justify-center'>

          {isLoading ? <Scenes /> : <DataTable data={poData} totals={totals} />}

        </div>

      </div>

    </>


  );
}

