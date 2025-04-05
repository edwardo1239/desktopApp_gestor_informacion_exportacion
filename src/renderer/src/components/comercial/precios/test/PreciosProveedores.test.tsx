/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAppContext from "@renderer/hooks/useAppContext";
import "@testing-library/jest-dom"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest"
import PreciosProveedores from "../PreciosProveedores";
import { mockDataProveedores } from "@renderer/mock/proveedores";
import { obtener_tipo_fruta } from "@renderer/functions/SystemRequest";
import { mockTipoFruta } from "@renderer/mock/tipoFruta";

vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();

vi.mock("@renderer/functions/SystemRequest", () => ({
    obtener_tipo_fruta: vi.fn()
}))

describe("Precios porveedores", async () => {

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();

        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock
        })

        window.api = {
            server2: vi.fn()
        } as any

        (obtener_tipo_fruta as unknown as Mock).mockReturnValue(mockTipoFruta);

    });

    afterEach(() => {
        cleanup();
    });


    it("Se renderizan los elementos correctamente", async () => {

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_comercial_precios_proveedores_registros") {
                return Promise.resolve({
                    status: 200,
                    data: mockDataProveedores
                });
            } else {
                return Promise.reject(new Error("Accion no soportada en el mock"))
            }
        })


        render(<PreciosProveedores />)

        // Verifica que los labels se rendericen:
        expect(screen.getByText("Precio Calidad 1")).toBeInTheDocument();
        expect(screen.getByText("Precio Calidad 1.5")).toBeInTheDocument();
        expect(screen.getByText("Precio Calidad Industrial")).toBeInTheDocument();
        expect(screen.getByText("Fruta Nacional")).toBeInTheDocument();

        // Verifica que los inputs asociados se rendericen usando el label:
        expect(screen.getByLabelText("Precio Calidad 1")).toBeInTheDocument();
        expect(screen.getByLabelText("Precio Calidad 1.5")).toBeInTheDocument();
        expect(screen.getByLabelText("Precio Calidad Industrial")).toBeInTheDocument();
        expect(screen.getByLabelText("Fruta Nacional")).toBeInTheDocument();

        expect(screen.getByText("Guardar")).toBeInTheDocument();


        const proveedorElement = await screen.findByText("62153 - Finca El Paraíso");
        expect(proveedorElement).toBeInTheDocument();

        const proveedorElementTipoFruta = await screen.findByText("Limon - Naranja");
        expect(proveedorElementTipoFruta).toBeInTheDocument();

        const proveedorElement2 = await screen.findByText("98765 - Hacienda La Gloria");
        expect(proveedorElement2).toBeInTheDocument();

        const proveedorElementTipoFruta2 = await screen.findByText("Mandarina - Mango");
        expect(proveedorElementTipoFruta2).toBeInTheDocument();

        // Selecciona los elementos por su data-testid
        const select1 = await screen.findByTestId("conercial-precios-proveedores-select-tipo-fruta");
        const select2 = await screen.findByTestId("conercial-precios-proveedores-select-tipo-fruta2");

        // Verifica que los selects estén en el documento
        expect(select1).toBeInTheDocument();
        expect(select2).toBeInTheDocument();

        // Dentro de cada select, busca las opciones
        const optionsSelect1 = within(select1).getAllByRole("option");
        const optionsSelect2 = within(select2).getAllByRole("option");

        // Extrae el texto de cada opción para facilitar la verificación
        const optionTextsSelect1 = optionsSelect1.map(option => option.textContent);
        const optionTextsSelect2 = optionsSelect2.map(option => option.textContent);

        // Comprueba que contengan "Limon" y "Naranja" (puedes usar arrayContaining si no te importa el orden ni elementos adicionales)
        expect(optionTextsSelect1).toEqual(expect.arrayContaining(["Limon", "Naranja", "Mandarina"]));
        expect(optionTextsSelect2).toEqual(expect.arrayContaining(["Limon", "Naranja", "Mandarina"]));

        //mirar los checkboxes
        const botonSeleccionar = await screen.findByText("Seleccionar todo");
        expect(botonSeleccionar).toBeInTheDocument();

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(2);

        checkboxes.forEach((checkbox) => {
            expect(checkbox).not.toBeChecked();
        });

        fireEvent.click(botonSeleccionar)

        checkboxes.forEach((checkbox) => {
            expect(checkbox).toBeChecked();
        });

        // cambiar el filtro de tipo de fruta
        fireEvent.change(select1, { target: { value: "Limon" } });

        const proveedorElementAfter = await screen.findByText("62153 - Finca El Paraíso");
        expect(proveedorElementAfter).toBeInTheDocument();

        const proveedorElement2After = screen.queryByText("98765 - Hacienda La Gloria");
        expect(proveedorElement2After).not.toBeInTheDocument();

        fireEvent.click(botonSeleccionar)

        const checkboxes2 = await screen.findAllByRole("checkbox");
        expect(checkboxes2).toHaveLength(1);

        checkboxes2.forEach((checkbox) => {
            expect(checkbox).toBeChecked();
        });

    })



})
