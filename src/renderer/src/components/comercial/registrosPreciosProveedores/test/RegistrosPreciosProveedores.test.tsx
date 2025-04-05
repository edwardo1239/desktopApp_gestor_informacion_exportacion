/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { obtener_proveedores, obtener_tipo_fruta } from "@renderer/functions/SystemRequest";
import useAppContext from "@renderer/hooks/useAppContext";
import { mockPrecioProveedores } from "@renderer/mock/precios";
import { mockDataProveedores } from "@renderer/mock/proveedores";
import { mockTipoFruta } from "@renderer/mock/tipoFruta";
import "@testing-library/jest-dom"
import { cleanup, render, screen } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import RegistrosPreciosProveedores from "../RegistrosPreciosProveedores";

vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();

vi.mock("@renderer/functions/SystemRequest", () => ({
    obtener_tipo_fruta: vi.fn(),
    obtener_proveedores: vi.fn()

}))


describe("Registro precios proveedores", async () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();

        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock
        })

        window.api = {
            server2: vi.fn()
        } as any
    });

    (obtener_tipo_fruta as unknown as Mock).mockReturnValue(mockTipoFruta);

    (obtener_proveedores as unknown as Mock).mockReturnValue(mockDataProveedores);


    afterAll(() => {
        cleanup();
    })

    it("Se renderizan los elementos correctamente", async () => {
        const headers = [
            "Fecha Ingreso",
            "Año",
            "Semana",
            "Exportación 1",
            "Exportación 1.5",
            "Exportación Industrial",
            "Descarte",
            "Fruta Nacional",
            "Tipo de fruta"
        ];

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_precios_registros_precios_proveedores") {
                return Promise.resolve({
                    status: 200,
                    data: {
                        registros: mockPrecioProveedores,
                        numeroRegistros: 3
                    }
                });
            } else {
                return Promise.reject(new Error("Accion no soportada en el mock"))
            }
        })

        render(<RegistrosPreciosProveedores />)

        expect(screen.getByText("Registros Precios")).toBeInTheDocument();

        expect(screen.getByText("Fecha Inicio:")).toBeInTheDocument();
        expect(screen.getByText("Fecha Fin:")).toBeInTheDocument();
        expect(screen.getByText("Tipo fruta:")).toBeInTheDocument();
        expect(screen.getByText("Predio:")).toBeInTheDocument();
        expect(screen.getByText(/buscar/i)).toBeInTheDocument();



        for (const header of headers) {
            const headerElements = await screen.findAllByText(new RegExp(`^${header}$`, "i"));
            expect(headerElements.length).toBeGreaterThan(0);
        }

        expect(await screen.findByText("Fecha Ingreso")).toBeInTheDocument();
        expect(await screen.findByText("Exportación 1.5")).toBeInTheDocument();

        expect(await screen.findByText("Manzana")).toBeInTheDocument();
        expect(await screen.findByText("Pera")).toBeInTheDocument();


        expect(await screen.findByText("2024")).toBeInTheDocument();
        expect(await screen.findByText("50")).toBeInTheDocument();
        expect(await screen.findByText("5")).toBeInTheDocument();

    });
})

