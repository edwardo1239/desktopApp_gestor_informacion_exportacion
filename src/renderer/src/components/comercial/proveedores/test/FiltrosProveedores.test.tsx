/* eslint-disable prettier/prettier */
import "@testing-library/jest-dom"
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

// 1. Declaras el mock aquí:
vi.mock("@renderer/hooks/useAppContext");2

// 2. Importas "useAppContext" normal y luego lo casteas
import useAppContext from "@renderer/hooks/useAppContext";
import { cleanup, fireEvent, render, RenderResult, screen } from "@testing-library/react";
import FiltrosProveedores from "../components/FiltrosProveedores";
import { filtroType } from "../Proveedores";

const messageModalMock = vi.fn();

const mockObtenerRegistros = vi.fn();
const mockNumeroRegistros = vi.fn();
const mockSetFiltro = vi.fn();

const defaultFiltro: filtroType = {
    SISPAP: true,
    PREDIO: "",
    "GGN.code": "",

};

function renderComponent(filtro = defaultFiltro): RenderResult {
    return render(
        <FiltrosProveedores
            obtenerRegistros={mockObtenerRegistros}
            numeroRegistros={mockNumeroRegistros}
            setFiltro={mockSetFiltro}
            filtro={filtro}
        />
    );
}

describe("FiltrosProveedores", () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock
        });
    });
    afterEach(() => {
        cleanup();
    });


    it("debe renderizar los elementos básicos", () => {
        renderComponent();

        expect(screen.getByTestId("comercial-proveedores-button-add-proveedor")).toBeInTheDocument();

        expect(screen.getByText("SISPAP:")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-input-SISPAP")).toBeInTheDocument();

        expect(screen.getByText("PREDIO:")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-input-predio")).toBeInTheDocument();

        expect(screen.getByText("GGN:")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-input-ggn")).toBeInTheDocument();

        expect(screen.getByTestId("comercial-proveedores-button-buscar")).toBeInTheDocument();

    });

    it('debe actualizar "SISPAP" a false cuando el select se cambia a inactivo', () => {
        renderComponent();
        const sispapSelect = screen.getByTestId("comercial-proveedores-input-SISPAP") as HTMLSelectElement;
        fireEvent.change(sispapSelect, { target: { value: "inactivo" } });

        expect(mockSetFiltro).toHaveBeenCalledWith(expect.any(Function));

    });

    it('debe actualizar el "PREDIO" en el filtro al escribir en el input correspondiente', () => {
        renderComponent();
        const predioInput = screen.getByTestId("comercial-proveedores-input-predio") as HTMLInputElement;
        fireEvent.change(predioInput, { target: { value: "Campo1" } });

        // Verificamos que setFiltro se llama con el nuevo valor de PREDIO
        expect(mockSetFiltro).toHaveBeenCalledWith({
            ...defaultFiltro,
            PREDIO: "Campo1",
        });
    });

    it('debe actualizar el "GGN.code" en el filtro al escribir en el input correspondiente', () => {
        renderComponent();
        const ggnInput = screen.getByTestId("comercial-proveedores-input-ggn") as HTMLInputElement;
        fireEvent.change(ggnInput, { target: { value: "12345" } });

        expect(mockSetFiltro).toHaveBeenCalledWith({
            ...defaultFiltro,
            "GGN.code": "12345",
        });
    });

    it('debe invocar "numeroRegistros" y "obtenerRegistros" al hacer clic en "Buscar"', async () => {
        renderComponent();
        const buscarButton = screen.getByTestId("comercial-proveedores-button-buscar");
        fireEvent.click(buscarButton);

        // Espera a que las promesas se ejecuten
        await vi.fn().mockResolvedValueOnce(mockNumeroRegistros);
        await vi.fn().mockResolvedValueOnce(mockObtenerRegistros);

        expect(mockNumeroRegistros).toHaveBeenCalledTimes(1);
        expect(mockObtenerRegistros).toHaveBeenCalledTimes(1);
    });

    it('debe llamar a "messageModal" en caso de que ocurra un error', async () => {
        // Forzamos que "numeroRegistros" lance un error
        mockNumeroRegistros.mockRejectedValueOnce(new Error("Ocurrió un error"));

        renderComponent();
        const buscarButton = screen.getByTestId("comercial-proveedores-button-buscar");
        fireEvent.click(buscarButton);

        // Esperamos a que se resuelva la promesa (el componente usa async/await)
        // Podemos usar findBy o un pequeño setTimeout
        await vi.fn().mockResolvedValueOnce(mockNumeroRegistros);
        await vi.fn().mockResolvedValueOnce(mockObtenerRegistros);

        expect(messageModalMock).toHaveBeenCalledWith("error", "Ocurrió un error");
    });

    it('debe intentar abrir el modal de "ingresar_proveedor_modal" al hacer clic en "Agregar Proveedor"', () => {

        const dialog = document.createElement("dialog");
        dialog.id = "ingresar_proveedor_modal";
        document.body.appendChild(dialog);

        dialog.showModal = vi.fn();

        document.body.appendChild(dialog);

        renderComponent();

        const addProveedorButton = screen.getByTestId("comercial-proveedores-button-add-proveedor");
        fireEvent.click(addProveedorButton);

        expect(dialog.showModal).toHaveBeenCalledTimes(1);

        // Limpieza
        document.body.removeChild(dialog);
    });

});
