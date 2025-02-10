/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, Mock, afterEach } from "vitest";
import FiltroEficienciaOperativa from "../components/FiltroEficienciaOperativa";
vi.mock("@renderer/hooks/useAppContext");

import useAppContext from "@renderer/hooks/useAppContext";


const messageModalMock = vi.fn();

const mockSetFiltro = vi.fn();
const mockObtenerRegistros = vi.fn();
const mockSetAgrupado = vi.fn()

describe("FiltroEficienciaOperativa", () => {

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock
        });


        window.api = {
            server2: vi.fn()
        } as any

    });
    afterEach(() => {
        cleanup();
    });


    it("Se renderiza los elementos sin problemas", async () => {
        render(
            <FiltroEficienciaOperativa
                setFiltro={mockSetFiltro}
                filtro={undefined}
                obtenerRegistros={mockObtenerRegistros}
                setAgrupado={mockSetAgrupado}
                agrupado="dia"
            />)

        expect(screen.getByDisplayValue("Día")).toBeInTheDocument();
        expect(screen.getByTestId("indicadores_operaciones_eficiencia_operativa_fecha_inicio")).toBeInTheDocument();
        expect(screen.getByTestId("indicadores_operaciones_eficiencia_operativa_fecha_fin")).toBeInTheDocument();
        expect(screen.getByTestId("indicadores_operaciones_eficiencia_operativa_tipo_fruta")).toBeInTheDocument();
        expect(screen.getByText("Buscar")).toBeInTheDocument();
    });

    it("probar el funcionamiento de los elementos", async () => {

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_constantes_sistema_tipo_frutas") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: ["Limon", "Naranja", "Mandarina"],
                });
            } else {
                // Mock para cualquier otra acción
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });
        render(
            <FiltroEficienciaOperativa
                setFiltro={mockSetFiltro}
                filtro={undefined}
                obtenerRegistros={mockObtenerRegistros}
                setAgrupado={mockSetAgrupado}
                agrupado="dia"
            />)

        const agrupacionSelect = screen.getByTestId("indicadores_operaciones_eficiencia_operativa_agrupado");
        fireEvent.change(agrupacionSelect, { target: { value: "mes" } });
        expect(mockSetAgrupado).toHaveBeenCalledWith("mes");

        const fechaInicioInput = screen.getByTestId("indicadores_operaciones_eficiencia_operativa_fecha_inicio");
        expect(fechaInicioInput).toBeInTheDocument();
        expect(fechaInicioInput).toHaveValue("");
        fireEvent.change(fechaInicioInput, { target: { value: "2020-01-01" } });
        expect(mockSetFiltro).toHaveBeenCalledWith(expect.objectContaining({ fechaInicio: "2020-01-01" }));
        await waitFor(() => {
            expect(mockSetFiltro).toHaveBeenCalledWith({ fechaInicio: "2020-01-01" });
        });

        const fechaFinInput = screen.getByTestId("indicadores_operaciones_eficiencia_operativa_fecha_fin");
        expect(fechaFinInput).toBeInTheDocument();
        expect(fechaFinInput).toHaveValue("");
        fireEvent.change(fechaFinInput, { target: { value: "2020-01-01" } });
        expect(mockSetFiltro).toHaveBeenCalledWith(expect.objectContaining({ fechaFin: "2020-01-01" }));
        await waitFor(() => {
            expect(mockSetFiltro).toHaveBeenCalledWith({ fechaFin: "2020-01-01" });
        });

        const tipoFrutaSelect = screen.getByTestId("indicadores_operaciones_eficiencia_operativa_tipo_fruta");

        expect(tipoFrutaSelect).toBeInTheDocument();
        expect(tipoFrutaSelect).toHaveValue([]); 

        // Esperar que las opciones se carguen
        await waitFor(() => {
            expect(screen.getByText("Limon")).toBeInTheDocument();
            expect(screen.getByText("Naranja")).toBeInTheDocument();
            expect(screen.getByText("Mandarina")).toBeInTheDocument();
        });

        fireEvent.change(tipoFrutaSelect, { target: { value: "Limon" } });
        expect(tipoFrutaSelect).toHaveValue(["Limon"]);

        fireEvent.change(tipoFrutaSelect, { target: { value: "Naranja" } });
        expect(tipoFrutaSelect).toHaveValue(["Limon", "Naranja"]);

        const botonBuscar = screen.getByText(/buscar/i);
        expect(botonBuscar).toBeInTheDocument();
        fireEvent.click(botonBuscar);
    })
})