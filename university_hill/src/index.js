import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/joy/';
import { Paper } from '@mui/material/';

function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // set loading to true before fetching data
    fetch('https://webscraper-davwed0.vercel.app/api/data')
      .then(response => response.json())
      .then(data => {
        setRows(data);
        setLoading(false); // set loading to false after data is loaded
      })
      .catch(error => console.error(error));
  }, []);

  const columns = [
    { field: 'transactionTime', headerName: 'Transaction Time', type: 'Date', width: 'auto'},
    { field: 'propertyName', headerName: 'Property Name', width: 'auto'},
    { field: 'tower', headerName: 'Tower', width: 'auto'},
    { field: 'floor', headerName: 'Floor', width: 'auto'},
    { field: 'unit', headerName: 'Unit', width: 'auto'},
    { field: 'transactionAmount', headerName: 'Transaction Amount', width: 'auto'},
    { field: 'saleableArea', headerName: 'Saleable Area', width: 'auto'},
    { field: 'unitPrice', headerName: 'Unit Price / sq. ft', width: 'auto'},
  ];

  return (
    <Paper sx={{margin:'auto', overflow:'hidden', width:'90%'}}>
          {loading ? <LinearProgress variant="determinate" style={{ width: "100vh", marginRight: "4px" }}
 /> : <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          initialState={{
              pagination: {
              paginationModel: { page: 0, pageSize: 10 },
              },
          }}
          pageSizeOptions={[5, 10]}
          />}
    </Paper>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DataTable />);