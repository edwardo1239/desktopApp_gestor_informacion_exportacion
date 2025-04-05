/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom"
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import Proveedores from "../Proveedores";
import useAppContext from "@renderer/hooks/useAppContext";
import { mockDataProveedores } from "@renderer/mock/proveedores";


vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();

const mockData = mockDataProveedores

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