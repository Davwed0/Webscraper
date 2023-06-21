import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/joy/';
import { Paper, Box } from '@mui/material/';

function TableCustom() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // set loading to true before fetching data
    fetch('https://webscraper-two.vercel.app/api/data')
      .then(response => response.json())
      .then(data => {
        setRows(data);
        setLoading(false); // set loading to false after data is loaded
      })
      .catch(error => console.error(error));
  }, []);

  const columns = [
    { field: 'transactionTime', headerName: 'Transaction Time', type: 'Date', minWidth: 150, flex: 0.5 },
    { field: 'propertyName', headerName: 'Property Name', minWidth: 170, flex: 0.7 },
    { field: 'tower', headerName: 'Tower', minWidth: 100, flex: 0.3 },
    { field: 'floor', headerName: 'Floor', minWidth: 80, flex: 0.2 },
    { field: 'unit', headerName: 'Unit', minWidth: 80, flex: 0.2 },
    { field: 'transactionAmount', headerName: 'Transaction Amount', minWidth: 160, flex: 0.4 },
    { field: 'saleableArea', headerName: 'Saleable Area', minWidth: 120, flex: 0.4 },
    { field: 'unitPrice', headerName: 'Unit Price / sq. ft', minWidth: 140, flex: 0.6 },
  ];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper sx={{ width: '75%', overflow: 'hidden' }}>
        {loading ? <LinearProgress variant="determinate" /> :
          <DataGrid sx={{ maxHeight: 590, width: '100%', alignSelf: "center" }}
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            autoHeight
            justifyContent="center"
            alignItems="center"
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />}
      </Paper>
    </Box>
  );
}

export default TableCustom;