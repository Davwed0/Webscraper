import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/joy/';

function DataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // set loading to true before fetching data
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(data => {
        setRows(data);
        setLoading(false); // set loading to false after data is loaded
      })
      .catch(error => console.error(error));
  }, []);

  const columns = [
    { field: 'transactionTime', headerName: 'Transaction Time', type: 'Date', width: 170},
    { field: 'propertyName', headerName: 'Property Name', width: 170},
    { field: 'tower', headerName: 'Tower', width: 120},
    { field: 'floor', headerName: 'Floor', width: 80},
    { field: 'unit', headerName: 'Unit', width: 80},
    { field: 'transactionAmount', headerName: 'Transaction Amount', width: 180},
    { field: 'saleableArea', headerName: 'Saleable Area', width: 140},
    { field: 'unitPrice', headerName: 'Unit Price / sq. ft', width: 160},
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
      }}
    >
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
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DataTable />);