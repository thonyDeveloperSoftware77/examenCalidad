// CSVUploader.test.js
import React from 'react';  // Agrega esta línea
import { render, screen, fireEvent } from '@testing-library/react';
import CSVUploader from './CSVUploader';

test('Muestra "Cargando datos..." mientras carga el CSV', () => {
  render(<CSVUploader />);
  const fileInput = screen.getByLabelText(/cargar y visualizar csv/i);
  const file = new File(['name,age\nJohn,30\nJane,25'], 'test.csv', {
    type: 'text/csv',
  });
  
  fireEvent.change(fileInput, { target: { files: [file] } });
  expect(screen.getByText(/cargando datos.../i)).toBeInTheDocument();
});
