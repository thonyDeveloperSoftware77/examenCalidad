import React, { useState } from "react";
import Papa from "papaparse";
import CSVTable from "./CSVTable";

const CSVUploader = () => {
  const [dataMap, setDataMap] = useState(new Map()); // Estado para el diccionario
  const [filteredData, setFilteredData] = useState([]); // Estado para datos filtrados
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchId, setSearchId] = useState("");
  const [city, setCity] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validación del tipo de archivo
      if (file.type !== "text/csv") {
        alert("Por favor, selecciona un archivo .csv");
        return;
      }

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
            setFilteredData(Array.from(updatedMap.values())); // Actualiza datos filtrados
            return updatedMap;
          });
        },
        complete: () => setIsLoading(false),
        error: (error) => {
          alert(`Error al procesar el archivo: ${error.message}`);
          setIsLoading(false);
        },
      });
    }
  };

  // Calcular edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Búsqueda por ID en la tabla principal
  const searchById = () => {
    const result = dataMap.get(searchId) ? [dataMap.get(searchId)] : [];

    if (result.length === 0) {
      alert("El cliente con el ID especificado no existe.");
    }

    setFilteredData(result);
  };

  // Listado de clientes por ciudad con coincidencias parciales
  const listarPorCiudad = () => {
    if (!city || city.trim() === "") {
      alert("Por favor, ingresa una ciudad para realizar la búsqueda.");
      return;
    }

    const results = Array.from(dataMap.values()).filter((cliente) =>
      cliente.ciudad.toLowerCase().includes(city.toLowerCase())
    );

    if (results.length === 0) {
      alert("No se encontraron clientes en la ciudad especificada.");
    }

    setFilteredData(results);
  };

  // Listado de clientes por edad en orden ascendente usando la fecha de nacimiento
  const listarPorEdadAscendente = () => {
    // Verificación del formato de fecha
    const isDateFormatValid = Array.from(dataMap.values()).every((cliente) =>
      /^\d{4}-\d{2}-\d{2}$/.test(cliente.fecha_nacimiento)
    );

    if (!isDateFormatValid) {
      alert("Error: Todas las fechas deben cumplir con el formato AAAA-MM-DD.");
      return;
    }

    // Ordenamiento por edad ascendente
    const sortedData = Array.from(dataMap.values()).sort((a, b) => {
      return (
        calculateAge(b.fecha_nacimiento) - calculateAge(a.fecha_nacimiento)
      );
    });

    setFilteredData(sortedData);
  };

  // Reiniciar la tabla a su estado inicial
  const resetTable = () => {
    setFilteredData(Array.from(dataMap.values()));
    setCity("");
    setSearchId("");
  };

  return (
    <div>
      <h2>Cargar y Visualizar CSV</h2>
      <label htmlFor="csvUpload">Cargar y Visualizar CSV</label>
      <input
        id="csvUpload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <div>
          <div>
            <h3>Buscar por ID</h3>
            <input
              type="text"
              placeholder="Ingrese ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={searchById}>Buscar</button>
          </div>

          {/* Listar por Ciudad */}
          <div>
            <h3>Listar por Ciudad</h3>
            <input
              type="text"
              placeholder="Ingrese Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={listarPorCiudad}>Listar</button>
          </div>

          {/* Listar por Edad Ascendente en la tabla principal */}
          <div>
            <h3>Ordenar Clientes por Edad Ascendente</h3>
            <button onClick={listarPorEdadAscendente}>Ordenar por Edad</button>
          </div>

          {/* Botón para reiniciar la tabla */}
          <div>
            <button onClick={resetTable}>Reiniciar Tabla</button>
          </div>
          <CSVTable data={filteredData} headers={headers} rowsPerPage={25} />
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
