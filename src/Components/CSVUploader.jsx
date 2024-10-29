import React, { useState } from 'react';
import Papa from 'papaparse';
import CSVTable from './CSVTable';

const CSVUploader = () => {
  const [dataMap, setDataMap] = useState(new Map()); // Estado para el diccionario
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setDataMap(new Map()); 
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        chunk: (result) => {
          const csvData = result.data;
          if (headers.length === 0) {
            setHeaders(Object.keys(csvData[0]));
          }

          setDataMap((prevDataMap) => {
            const updatedMap = new Map(prevDataMap);
            csvData.forEach((record) => {
              if (record.id) {
                updatedMap.set(record.id, record); 
              }
            });
            return updatedMap;
          });
        },
        complete: () => setIsLoading(false),
      });
    }
  };

  // Función de búsqueda por `id` usando el diccionario
  const searchById = (id) => {
    return dataMap.get(id) || null;
  };

  return (
    <div>
      <h2>Cargar y Visualizar CSV</h2>
      <label htmlFor="csvUpload">Cargar y Visualizar CSV</label>
      <input id="csvUpload" type="file" accept=".csv" onChange={handleFileUpload} />
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <CSVTable data={Array.from(dataMap.values())} headers={headers} rowsPerPage={25} />
      )}
    </div>
  );
};

export default CSVUploader;
