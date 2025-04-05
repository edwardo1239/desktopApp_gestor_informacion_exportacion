/* eslint-disable prettier/prettier */
import "@testing-library/jest-dom"

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import ComponenetTipoFruta from "../components/ComponenetTipoFruta";
import { proveedoresType } from "@renderer/types/proveedoresType";

// 1. Declaras el mock aquí:
vi.mock("@renderer/hooks/useAppContext");

// 2. Importas "useAppContext" normal y luego lo casteas
import useAppContext from "@renderer/hooks/useAppContext";


describe("ComponentTipoFruta", () => {

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            user: { rol: 2 },
        });
    });
    afterEach(() => {
        cleanup();
    });

    it('renderiza un <select> con props.arreglo si NO hay porveedor o user.rol <= 2 y hay proveedor', () => {
        const props = {
            proveedor: undefined,       // no existe
            arreglo: ['Naranja', 'Limón'],
            valor: undefined,
            handleTipoFruta: vi.fn(),
            nombre: 'GGN.tipo_fruta'
        };



        render(<ComponenetTipoFruta {...props} />);

        // Buscamos el <select> por su 'name'
        const selectElement = screen.getByRole('listbox', { name: /GGN.tipo_fruta/i });
        expect(selectElement).toBeInTheDocument();

        expect(selectElement).not.toBeDisabled();

        // Verificamos que tenga la opción vacía por defecto
        // y que tenga Naranja, Limón
        const optionVacia = screen.getByRole('option', { name: '' });
        const optionNaranja = screen.getByRole('option', { name: 'Naranja' });
        const optionLimon = screen.getByRole('option', { name: 'Limón' });


        expect(optionVacia).toBeInTheDocument();
        expect(optionNaranja).toBeInTheDocument();
        expect(optionLimon).toBeInTheDocument();
    });

    it('renderiza <select> con props.valor si proveedor existe y user.rol > 2 (caso 1)', () => {

        (useAppContext as unknown as Mock).mockReturnValueOnce({
            user: { rol: 4 },
        });

        const fakeProveedor: proveedoresType = {
            _id: "1234567890",
            PREDIO: "Predio de pruebas unitarias",
            // ICA es un subdocumento
            ICA: {
                code: "ICA-TEST-123",
                tipo_fruta: ["Naranja", "Limon"],
                fechaVencimiento: ""
            },
            "CODIGO INTERNO": 99999,
            // GGN es otro subdocumento
            GGN: {
                code: "GGN-TEST-ABC",
                fechaVencimiento: "",
                paises: ["Colombia", "Brasil"],
                tipo_fruta: ["Naranja", "Limon"]
            },
            tipo_fruta: {
                "Naranja Valencia": {
                    arboles: 50,
                    hectareas: 10
                },
                "Limon Tahití": {
                    arboles: 100,
                    hectareas: 20
                }
            },
            PROVEEDORES: "Proveedor de prueba",
            DEPARTAMENTO: "CUNDINAMARCA",
            urlArchivos: [],
            activo: true,
            precio: {
                Limon: "asdasdasd",
                Naranja: "asdasdas",
                fecha: "new Date()"
            },
            SISPAP: false,
            telefono_predio: "3000000000",
            contacto_finca: "Juan Pérez",
            correo_informes: "informes@predio.com",
            telefono_propietario: "3000001111",
            propietario: "Propietario de prueba",
            razon_social: "Empresa ABC",
            nit_facturar: "900123456-7",
            precioFijo: false,
            departamento: "Quindio",
            municipio: "Armenia"


            // Campos varios para depurar/limpiar
            // ICA_temp: "Temporal",
            // "FECHA VENCIMIENTO GGN": "2025-12-31",
            // N: true,
            // L: false,
            // M: true,
            // alt: "Cualquier otra cosa"
        };
        const props = {
            proveedor: fakeProveedor,
            arreglo: ['Naranja', 'Limón'], // DEBERÍA ignorar 'arreglo' y usar 'valor'
            valor: ['Manzana', 'Pera'],
            handleTipoFruta: vi.fn(),
            nombre: 'ICA.tipo_fruta'
        };

        render(<ComponenetTipoFruta {...props} />);

        // user.rol=4 > 2 y hay proveedor => se usa props.valor
        // Buscamos <select> por "ICA.tipo_fruta"
        const selectElement = screen.getByRole('listbox', { name: /ICA.tipo_fruta/i });
        expect(selectElement).toBeDisabled(); // debe estar disabled por user.rol>2
        expect(selectElement).toHaveAttribute('multiple');

        // Debe mostrar Manzana, Pera
        const optionManzana = screen.getByRole('option', { name: 'Manzana' });
        const optionPera = screen.getByRole('option', { name: 'Pera' });
        expect(optionManzana).toBeInTheDocument();
        expect(optionPera).toBeInTheDocument();

        // NO debería mostrar 'Naranja', 'Limón'
        // (Si lo quisieras, harías un queryByText('Naranja') y verías que es null)
    });

    it('muestra "Cargando..." si props.valor está undefined y user.rol > 2 y hay proveedor', () => {
        (useAppContext as unknown as Mock).mockReturnValueOnce({
            user: { rol: 5 },
        });

        const fakeProveedor: proveedoresType = {
            _id: "1234567890",
            PREDIO: "Predio de pruebas unitarias",
            // ICA es un subdocumento
            ICA: {
                code: "ICA-TEST-123",
                tipo_fruta: ["Naranja", "Limon"],
                fechaVencimiento: ""
            },
            "CODIGO INTERNO": 99999,
            // GGN es otro subdocumento
            GGN: {
                code: "GGN-TEST-ABC",
                fechaVencimiento: "",
                paises: ["Colombia", "Brasil"],
                tipo_fruta: ["Naranja", "Limon"]
            },
            tipo_fruta: {
                "Naranja Valencia": {
                    arboles: 50,
                    hectareas: 10
                },
                "Limon Tahití": {
                    arboles: 100,
                    hectareas: 20
                }
            },
            PROVEEDORES: "Proveedor de prueba",
            DEPARTAMENTO: "CUNDINAMARCA",
            urlArchivos: [],
            activo: true,
            precio: {
                Limon: "fdsasdadasd",
                Naranja: "asdasdasdasd",
                fecha: "new Date()"
            },
            SISPAP: false,
            telefono_predio: "3000000000",
            contacto_finca: "Juan Pérez",
            correo_informes: "informes@predio.com",
            telefono_propietario: "3000001111",
            propietario: "Propietario de prueba",
            razon_social: "Empresa ABC",
            nit_facturar: "900123456-7",
            precioFijo: false,
            departamento: "Quindio",
            municipio: "Armenia"

            // Campos varios para depurar/limpiar
            // ICA_temp: "Temporal",
            // "FECHA VENCIMIENTO GGN": "2025-12-31",
            // N: true,
            // L: false,
            // M: true,
            // alt: "Cualquier otra cosa"
        };

        const props = {
            proveedor: fakeProveedor,
            arreglo: undefined,
            valor: undefined, // Valor no definido
            handleTipoFruta: vi.fn(),
            nombre: 'GGN.tipo_fruta'
        };

        render(<ComponenetTipoFruta {...props} />);

        // Buscamos el <select> y verificamos que está disabled
        const selectElement = screen.getByRole('listbox', { name: /GGN.tipo_fruta/i });
        expect(selectElement).toBeDisabled();

        // Debe haber una sola opción "Cargando..."
        const optionCargando = screen.getByRole('option', { name: 'Cargando...' });
        expect(optionCargando).toBeInTheDocument();
    });

    // it('maneja el evento de cambio correctamente', () => {
    //     (useAppContext as unknown as Mock).mockReturnValueOnce({
    //         user: { rol: 0 },
    //     });

    //     const handleChangeMock = vi.fn();
    //     const props = {
    //         proveedor: undefined,
    //         arreglo: ['Fresa', 'Uva'],
    //         valor: undefined,
    //         handleTipoFruta: handleChangeMock,
    //         nombre: 'frutasGGN'
    //     };

    //     render(<ComponenetTipoFruta {...props} />);

    //     const selectElement = screen.getByRole('listbox', { name: "frutasGGN" });
    //     expect(selectElement).not.toBeDisabled();


    //     fireEvent.change(selectElement, { target: { value: 'Uva' } });


    //     expect(handleChangeMock).toHaveBeenCalledTimes(1);

    //     console.log(selectElement)
    //     expect(selectElement.value).toBe('Uva'); 
    // });

})