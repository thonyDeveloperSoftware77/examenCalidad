// CSVUploader.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CSVUploader from './CSVUploader';

describe('CSVUploader Component', () => {
  beforeEach(() => {
    render(<CSVUploader />);
  });

  test('Renderiza los elementos básicos', () => {
    expect(screen.getAllByText(/Cargar y Visualizar CSV/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargar y Visualizar CSV/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ingrese ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ingrese Ciudad/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Buscar/i)[1]).toBeInTheDocument();
    expect(screen.getAllByText(/Listar/i)[1]).toBeInTheDocument();
    expect(screen.getByText(/Ordenar por Edad/i)).toBeInTheDocument();
    expect(screen.getByText(/Reiniciar Tabla/i)).toBeInTheDocument();
  });

  test('Muestra "Cargando datos..." mientras carga el CSV', async () => {
    const fileInput = screen.getByLabelText(/Cargar y Visualizar CSV/i);
    const file = new File(['id,ciudad,fecha_nacimiento\n1,Richland,1996-05-27'], 'test.csv', {
      type: 'text/csv',
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Esperamos que aparezca el mensaje de carga
    expect(screen.getByText(/Cargando datos.../i)).toBeInTheDocument();

    // Esperamos que el mensaje desaparezca después de la carga
    await waitFor(() => expect(screen.queryByText(/Cargando datos.../i)).not.toBeInTheDocument());
  });

  test('Búsqueda por ID funciona correctamente', async () => {
    const fileInput = screen.getByLabelText(/Cargar y Visualizar CSV/i);
    const file = new File(['id,ciudad,fecha_nacimiento\n1,Richland,1996-05-27'], 'test.csv', {
      type: 'text/csv',
    });

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.queryByText(/Cargando datos.../i)).not.toBeInTheDocument());

    // Realiza la búsqueda por ID
    fireEvent.change(screen.getByPlaceholderText(/Ingrese ID/i), { target: { value: '1' } });
    fireEvent.click(screen.getAllByText(/Buscar/i)[1]);  // Selecciona el botón "Buscar" correspondiente

    expect(screen.getByText(/Richland/i)).toBeInTheDocument();
  });

  test('Filtro por ciudad funciona correctamente', async () => {
    const fileInput = screen.getByLabelText(/Cargar y Visualizar CSV/i);
    const file = new File(
      ['id,ciudad,fecha_nacimiento\n1,Richland,1996-05-27\n2,Cuenca,1998-07-15'], 
      'test.csv', 
      { type: 'text/csv' }
    );

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.queryByText(/Cargando datos.../i)).not.toBeInTheDocument());

    // Filtra por ciudad
    fireEvent.change(screen.getByPlaceholderText(/Ingrese Ciudad/i), { target: { value: 'Cuenca' } });
    fireEvent.click(screen.getAllByText(/Listar/i)[1]);  // Selecciona el botón "Listar" correcto

    expect(screen.getByText(/Cuenca/i)).toBeInTheDocument();
    expect(screen.queryByText(/Richland/i)).not.toBeInTheDocument();
  });

  test('Ordenamiento por edad ascendente funciona correctamente', async () => {
    const fileInput = screen.getByLabelText(/Cargar y Visualizar CSV/i);
    const file = new File(
      [
        'id,ciudad,fecha_nacimiento\n1,Cuenca,1996-05-27\n2,Richland,1998-07-15\n3,Quito,1992-04-12',
      ],
      'test.csv',
      { type: 'text/csv' }
    );

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.queryByText(/Cargando datos.../i)).not.toBeInTheDocument());

    fireEvent.click(screen.getByText(/Ordenar por Edad/i));

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Quito'); // el más viejo (1992)
    expect(rows[2]).toHaveTextContent('Cuenca'); // el siguiente (1996)
    expect(rows[3]).toHaveTextContent('Richland'); // el más joven (1998)
  });

  test('Reiniciar tabla muestra todos los datos', async () => {
    const fileInput = screen.getByLabelText(/Cargar y Visualizar CSV/i);
    const file = new File(
      ['id,ciudad,fecha_nacimiento\n1,Cuenca,1996-05-27\n2,Richland,1998-07-15\n3,Quito,1992-04-12'],
      'test.csv',
      { type: 'text/csv' }
    );

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.queryByText(/Cargando datos.../i)).not.toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/Ingrese Ciudad/i), { target: { value: 'Cuenca' } });
    fireEvent.click(screen.getAllByText(/Listar/i)[1]);
    expect(screen.getByText(/Cuenca/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Reiniciar Tabla/i));
    expect(screen.getByText(/Cuenca/i)).toBeInTheDocument();
    expect(screen.getByText(/Richland/i)).toBeInTheDocument();
    expect(screen.getByText(/Quito/i)).toBeInTheDocument();
  });
});
