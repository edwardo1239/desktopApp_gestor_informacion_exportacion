/* eslint-disable prettier/prettier */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CountrySelector from '../SelectCountryes';
import "@testing-library/jest-dom"

describe('CountrySelector component', () => {
    it('renderiza correctamente las opciones del dropdown', () => {
        render(<CountrySelector setCountry={vi.fn()} />);

        // Verificar que el <select> está en el documento
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();

        // Verificar que contiene la opción "Seleccione un país"
        const defaultOption = screen.getByRole('option', { name: '--Seleccione un país--' });
        expect(defaultOption).toBeInTheDocument();

        // Verificar que todas las opciones de `countries` están presentes
        const countries = [
            "Canada", "china", "colombia", "Republica dominicana", "Ecuador", "Japon", "Europa", "Estados unidos",
            "Puerto rico", "Aruba", "Reino unido", "chile", "Costa rica", "Guatemala", "Honduras", "panama",
            "Emiratos arabes", "Argentina", "Union Europea", "Corea", "Rusia"
        ];

        countries.forEach((country) => {
            const option = screen.getByRole('option', { name: country });
            expect(option).toBeInTheDocument();
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('actualiza el estado y llama a setCountry cuando se selecciona un país', () => {

        const mockSetCountry = vi.fn(); // Mock de la función setCountry
        render(<CountrySelector setCountry={mockSetCountry} />);

        const selectElement = screen.getByRole('combobox');

        // Simular un cambio en el dropdown (seleccionar "Canada")
        fireEvent.change(selectElement, { target: { value: 'Canada' } });

        // Verificar que el valor del <select> se actualiza
        expect(selectElement).toHaveValue('Canada');

        // Verificar que se llama a setCountry con "Canada"
        expect(mockSetCountry).toHaveBeenCalledTimes(1);
        expect(mockSetCountry).toHaveBeenCalledWith('Canada');
    });
    afterEach(() => {
        cleanup();
    });
    it('muestra la opción predeterminada al inicio', () => {

        render(<CountrySelector setCountry={vi.fn()} />);
        const selectElement = screen.getByRole('combobox');
        // Verificar que el valor inicial es el predeterminado ("")
        expect(selectElement).toHaveValue('');
    });
});
