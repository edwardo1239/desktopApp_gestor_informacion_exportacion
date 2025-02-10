/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom"
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import Proveedores from "../Proveedores";
import useAppContext from "@renderer/hooks/useAppContext";
import { proveedoresType } from "@renderer/types/proveedoresType";


vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();

const mockData: proveedoresType[] = [
    {
        _id: "454sdad87w8q4e5w",
        PREDIO: "Finca El Paraíso",
        ICA: {
            code: "ICA12345",
            tipo_fruta: ["Limon", "Naranja"],
            fechaVencimiento: new Date().toISOString(),
        },
        "CODIGO INTERNO": 62153,
        GGN: {
            code: "GGN98765",
            fechaVencimiento: new Date().toISOString(),
            paises: ["Colombia", "Ecuador"],
            tipo_fruta: ["Limon", "Naranja"],
        },
        tipo_fruta: {
            Limon: { arboles: 100, hectareas: 5 },
            Naranja: { arboles: 200, hectareas: 10 },
        },
        PROVEEDORES: "AgroExport",
        DEPARTAMENTO: "Antioquia",
        activo: true,
        precio: {
            Limon: {
                "1": 5000,
                "15": 75000,
                "2": 10000,
                frutaNacional: 20000,
                descarte: 5000,
                combinado: 10000,
            },
            Naranja: {
                "1": 3000,
                "15": 45000,
                "2": 7000,
                descarte: 3000,
                zumex: 8000,
            },
            fecha: new Date().toISOString(),
        },
        SISPAP: false,
        telefono_predio: "+57 3123456789",
        contacto_finca: "Juan Pérez",
        correo_informes: "contacto@finca.com",
        telefono_propietario: "+57 9876543210",
        propietario: "María López",
        razon_social: "Frutas del Campo S.A.",
        nit_facturar: "900123456-7",
    },
    {
        _id: "123abc456def",
        PREDIO: "Hacienda La Gloria",
        ICA: {
            code: "ICA67890",
            tipo_fruta: ["Mandarina", "Mango"],
            fechaVencimiento: new Date().toISOString(),
        },
        "CODIGO INTERNO": 98765,
        GGN: {
            code: "GGN54321",
            fechaVencimiento: new Date().toISOString(),
            paises: ["Perú", "Brasil"],
            tipo_fruta: ["Mandarina", "Mango"],
        },
        tipo_fruta: {
            Mandarina: { arboles: 150, hectareas: 6 },
            Mango: { arboles: 250, hectareas: 12 },
        },
        PROVEEDORES: "FruviExport",
        DEPARTAMENTO: "Cundinamarca",
        activo: false,
        precio: {
            Limon: {
                "1": 4000,
                "15": 60000,
                "2": 9000,
                frutaNacional: 15000,
                descarte: 4000,
                combinado: 8000,
            },
            Naranja: {
                "1": 7000,
                "15": 105000,
                "2": 14000,
                descarte: 5000,
                zumex: 10000,
            },
            fecha: new Date().toISOString(),
        },
        SISPAP: true,
        telefono_predio: "+57 9876543210",
        contacto_finca: "Carlos García",
        correo_informes: "contacto@haciendalagloria.com",
        telefono_propietario: "+57 1234567890",
        propietario: "Ricardo Pérez",
        razon_social: "Exportadora Gloria S.A.",
        nit_facturar: "800123456-8",
    },
];

describe("Proveedores", async () => {

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 0 }
        });


        window.api = {
            server2: vi.fn()
        } as any


    });
    afterEach(() => {
        cleanup();
    });
    it("renderiza el componenete sin problemas con rol < 2", async () => {
        document.body.innerHTML = `<dialog id="ingresar_proveedor_modal"></dialog>`;
        const dialogElement = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        dialogElement.showModal = vi.fn(); // Mockear `close()`

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_proveedores_elementos") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: mockData,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<Proveedores />)

        const columnHeaders = screen.getAllByRole("columnheader");
        expect(columnHeaders).toHaveLength(7);

        await waitFor(() => {

            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(3);

            expect(screen.getByText("Finca El Paraíso")).toBeInTheDocument();
            expect(screen.getByText("GGN98765")).toBeInTheDocument();
            expect(screen.getByText(62153)).toBeInTheDocument();
        });

    });

    it("renderiza el componenete sin problemas con rol > 2", async () => {

        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 4 }
        });
        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_proveedores_elementos") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: mockData,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<Proveedores />)

        const columnHeaders = screen.getAllByRole("columnheader");
        expect(columnHeaders).toHaveLength(6);

        await waitFor(() => {

            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(3);

            expect(screen.getByText("Finca El Paraíso")).toBeInTheDocument();
            expect(screen.getByText("GGN98765")).toBeInTheDocument();
            expect(screen.getByText(62153)).toBeInTheDocument();
        });

    })

    it("Se oprime el boton para agregar un nuevo proveedor con rol < 2", async () => {
        render(<Proveedores />)

        const boton_agregar = screen.getByText(/Agregar Proveedor/i);
        fireEvent.click(boton_agregar);

        expect(screen.getByTestId("comercial-proveedores-codigo-predio-input")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-predio-ica-input")).toBeInTheDocument();
    });

    it("Se oprime el boton para agregar un nuevo proveedor con rol > 2", async () => {
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 4 }
        });
        render(<Proveedores />)

        const boton_agregar = screen.getByText(/Agregar Proveedor/i);
        fireEvent.click(boton_agregar);

        const predio_codigo = screen.getByTestId("comercial-proveedores-codigo-predio-input");
        expect(predio_codigo).toBeInTheDocument();
        expect(predio_codigo).toBeDisabled();
        const predio_ica = screen.getByTestId("comercial-proveedores-predio-ica-input");
        expect(predio_ica).toBeInTheDocument();
        expect(predio_ica).toBeDisabled();

    });

    it("Se oprime el boton para ver la info del proveedor rol < 2", async () => {

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_proveedores_elementos") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: mockData,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<Proveedores />)

        await waitFor(() => {

            const boton_info = screen.getByTestId("comercial-proveedores-button-ver-info-0");
            fireEvent.click(boton_info);

            const predio_codigo = screen.getByTestId("comercial-proveedores-codigo-predio-input");
            expect(predio_codigo).toBeInTheDocument();
            expect(predio_codigo).toHaveValue(String(mockData[0]["CODIGO INTERNO"]));
            const predio_ica = screen.getByTestId("comercial-proveedores-predio-ica-input");
            expect(predio_ica).toBeInTheDocument();
            expect(predio_ica).toHaveValue(mockData[0].ICA.code);


        });
    })

    it("Se oprime el boton para ver la info del proveedor rol > 2", async () => {

        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 4 }
        });

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_proveedores_elementos") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: mockData,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<Proveedores />)

        await waitFor(() => {

            const boton_info = screen.getByTestId("comercial-proveedores-button-ver-info-0");
            fireEvent.click(boton_info);

            const predio_codigo = screen.getByTestId("comercial-proveedores-codigo-predio-input");
            expect(predio_codigo).toBeInTheDocument();
            expect(predio_codigo).toHaveValue(String(mockData[0]["CODIGO INTERNO"]));
            expect(predio_codigo).toBeDisabled();

            const predio_ica = screen.getByTestId("comercial-proveedores-predio-ica-input");
            expect(predio_ica).toBeInTheDocument();
            expect(predio_ica).toHaveValue(mockData[0].ICA.code);
            expect(predio_ica).toBeDisabled();


        });
    })
});