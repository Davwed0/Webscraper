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
    fetch('https://webscraper-two.vercel.app/api/data')
      .then(response => response.json())
      .then(data => {
        setRows(data);
        setLoading(false); // set loading to false after data is loaded
      })
      .catch(error => console.error(error));
  }, []);

  const columns = [
    { field: 'transactionTime', headerName: 'Transaction Time', type: 'Date', minWidth: 150},
    { field: 'propertyName', headerName: 'Property Name', minWidth: 170},
    { field: 'tower', headerName: 'Tower', minWidth: 100},
    { field: 'floor', headerName: 'Floor', minWidth: 80},
    { field: 'unit', headerName: 'Unit', minWidth: 80},
    { field: 'transactionAmount', headerName: 'Transaction Amount', minWidth: 160},
    { field: 'saleableArea', headerName: 'Saleable Area', minWidth: 120},
    { field: 'unitPrice', headerName: 'Unit Price / sq. ft', minWidth: 140},
  ];

  return (
    <Paper sx={{width: '80%', overflow: 'hidden', margin: "auto auto", alignContent: 'center'}}>
          {loading ? <LinearProgress variant="determinate" style={{ width: "100%" }}
 /> : <DataGrid sx={{maxHeight: 590}}
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