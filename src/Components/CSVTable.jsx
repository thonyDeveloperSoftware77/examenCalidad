/* eslint-disable react/prop-types */
// CSVTable.js
import React, { useState } from 'react';

const CSVTable = ({ data, headers, rowsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const goToPreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const goToNextPage = () => setCurrentPage((prevPage) =>
    Math.min(prevPage + 1, Math.ceil(data.length / rowsPerPage))
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={`${rowIndex}-${header}`}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          &lt; Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(data.length / rowsPerPage)}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
        >
          Siguiente &gt;
        </button>
      </div>
    </div>
  );
};

export default CSVTable;
