/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, vi, Mock, afterEach, it, expect } from "vitest";

import useAppContext from "@renderer/hooks/useAppContext";
import EficienciaOperativa from '../ShowIndicadores'
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();

const indicadoresMock = [
    {
        _id: "a1b2c3d4e5",
        kilos_procesador: 450,
        fecha_creacion: "2023-01-01",
        meta_kilos_procesados: 500,
        tipo_fruta: ["manzana", "pera"],
        total_horas_hombre: 25,
    },
    {
        _id: "f6g7h8i9j0",
        kilos_procesador: 320,
        fecha_creacion: "2023-01-01",
        meta_kilos_procesados: 400,
        tipo_fruta: ["naranja", "limón"],
        total_horas_hombre: 18,
    },
    {
        _id: "k1l2m3n4o5",
        kilos_procesador: 600,
        fecha_creacion: "2023-01-01",
        meta_kilos_procesados: 650,
        tipo_fruta: ["mango", "piña"],
        total_horas_hombre: 30,
    },
    {
        _id: "p6q7r8s9t0",
        kilos_procesador: 200,
        fecha_creacion: "2023-04-12",
        meta_kilos_procesados: 300,
        tipo_fruta: ["guayaba", "fresa"],
        total_horas_hombre: 16,
    },
    {
        _id: "u1v2w3x4y5",
        kilos_procesador: 750,
        fecha_creacion: "2023-05-20",
        meta_kilos_procesados: 800,
        tipo_fruta: ["manzana", "naranja", "pera"],
        total_horas_hombre: 40,
    },
];

describe("EficienciaOperativa", () => {
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

    it("Renderiza los elementos sin problema", async () => {

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_indicadores_operaciones_eficiencia_operativa_registros") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: indicadoresMock,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<EficienciaOperativa />);

        const columnHeaders = screen.getAllByRole("columnheader");
        expect(columnHeaders).toHaveLength(6);

        const boton_agrupacion = screen.getByDisplayValue("Día");
        expect(boton_agrupacion).toBeInTheDocument();


        await waitFor(() => {

            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(6);

            expect(screen.getByText("12/04/2023")).toBeInTheDocument();
            expect(screen.getByText(/mango piña/i)).toBeInTheDocument(); 

            expect(screen.getByText("Sumatoria Kilos procesados:")).toBeInTheDocument();
            expect(screen.getByText("2320.00")).toBeInTheDocument();

            expect(screen.getByText("Promedio kilos procesados")).toBeInTheDocument();
            expect(screen.getByText("464.00")).toBeInTheDocument();

            expect(screen.getByText("Total eficiencia operativa")).toBeInTheDocument();
            expect(screen.getByText("87.55%")).toBeInTheDocument();
        });



    })

    it("Usar el boton de agrupar", async () => {

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_indicadores_operaciones_eficiencia_operativa_registros") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: indicadoresMock,
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(<EficienciaOperativa />);
        
        const boton_agrupacion = screen.getByTestId("indicadores_operaciones_eficiencia_operativa_agrupado");
        expect(boton_agrupacion).toBeInTheDocument();


        await waitFor(() => {

            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(6);

        });

        fireEvent.change(boton_agrupacion, { target: { value: "mes" } })

        await waitFor(() => {

            const rows = screen.getAllByRole("row");
            expect(rows).toHaveLength(4);

        });
    })
})