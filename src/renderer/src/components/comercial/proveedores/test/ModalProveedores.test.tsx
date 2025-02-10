/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom"
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@renderer/hooks/useAppContext");

import useAppContext from "@renderer/hooks/useAppContext";
import ModalProveedores from "../components/ModalProveedores";
import ComponenetTipoFruta from "../components/ComponenetTipoFruta";
import { proveedoresType } from "@renderer/types/proveedoresType";
const messageModalMock = vi.fn();


vi.mock("../components/ComponenetTipoFruta.tsx", () => ({
    __esModule: true,
    default: vi.fn(), // Aquí indicamos que `default` es un mock.
}));

const mockData: proveedoresType = {
    _id: "454sdad87w8q4e5w",
    PREDIO: "Finca El Paraíso",
    ICA: {
        code: "ICA12345",
        tipo_fruta: ["Limon", "Naranja"],
        fechaVencimiento: new Date().toISOString()
    },
    "CODIGO INTERNO": 62153,
    GGN: {
        code: "GGN98765",
        fechaVencimiento: new Date().toISOString(),
        paises: ["Colombia", "Ecuador"],
        tipo_fruta: ["Limon", "Naranja"]
    },
    tipo_fruta: {

        Limon: { arboles: 100, hectareas: 5 },
        Naranja: { arboles: 200, hectareas: 10 }

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
            combinado: 10000
        },
        Naranja: {
            "1": 3000,
            "15": 45000,
            "2": 7000,
            descarte: 3000,
            zumex: 8000
        },
        fecha: new Date().toISOString()
    },
    SISPAP: false,
    telefono_predio: "+57 3123456789",
    contacto_finca: "Juan Pérez",
    correo_informes: "contacto@finca.com",
    telefono_propietario: "+57 9876543210",
    propietario: "María López",
    razon_social: "Frutas del Campo S.A.",
    nit_facturar: "900123456-7"
};

describe("ModalProveedores", () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 0 }
        });

        const mockComponenetTipoFruta = ComponenetTipoFruta as unknown as Mock;
        mockComponenetTipoFruta.mockImplementation(({ nombre }) => (
            <div data-testid={`mock-${nombre}`}>Mock {nombre}</div>
        ));

        window.api = {
            server2: vi.fn()
        } as any


    });
    afterEach(() => {
        cleanup();
    });

    it("debe renderizar correctamente los mocks de ComponenetTipoFruta", () => {
        render(
            <ModalProveedores
                proveedor={undefined}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        // Verificamos que los mocks de ComponenetTipoFruta están presentes
        expect(screen.getByTestId("mock-ICA.tipo_fruta")).toBeInTheDocument();
        expect(screen.getByTestId("mock-GGN.tipo_fruta")).toBeInTheDocument();
        expect(screen.getByTestId("mock-GGN.paises")).toBeInTheDocument();
    });

    it("debe renderizar correctamente los datos cuando rol < 2", () => {
        render(
            <ModalProveedores
                proveedor={undefined}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        const probarFormularioElemento = (id): void => {
            const item = screen.getByTestId(id)
            expect(item).toBeInTheDocument();
            expect(item).not.toBeDisabled();
            fireEvent.change(item, { target: { value: `CODIGO ${id}` } });
            expect(item).toHaveValue(`CODIGO ${id}`);
        }

        const ids = [
            "comercial-proveedores-codigo-predio-input",
            "comercial-proveedores-predio-predio-input",
            "comercial-proveedores-predio-ica-input",
            "comercial-proveedores-predio-ggn-input",
            "comercial-proveedores-predio-nit-input",
            "comercial-proveedores-predio-razon-input",
            "comercial-proveedores-predio-propietario-input",
            "comercial-proveedores-predio-telefonop-input",
            "comercial-proveedores-predio-correo-input",
            "comercial-proveedores-predio-contacto-input",
            "comercial-proveedores-predio-telefono-input"
        ]

        ids.forEach(item => {
            probarFormularioElemento(item)
        });

        const item_fecha_ica = screen.getByTestId("comercial-proveedores-predio-fecha-ica-input")
        expect(item_fecha_ica).toBeInTheDocument();
        expect(item_fecha_ica).not.toBeDisabled();
        fireEvent.change(item_fecha_ica, { target: { value: `2020-01-01` } });
        expect(item_fecha_ica).toHaveValue(`2020-01-01`);

        const item_fecha_ggn = screen.getByTestId("comercial-proveedores-predio-fecha-ggn-input")
        expect(item_fecha_ggn).toBeInTheDocument();
        expect(item_fecha_ggn).not.toBeDisabled();
        fireEvent.change(item_fecha_ggn, { target: { value: `2020-01-01` } });
        expect(item_fecha_ggn).toHaveValue(`2020-01-01`);

        const predio_sispap = screen.getByTestId("comercial-proveedores-predio-sispap-input")
        expect(predio_sispap).toBeInTheDocument();
        expect(predio_sispap).not.toBeDisabled();
        fireEvent.click(predio_sispap);
        expect(predio_sispap).toBeChecked();

        const predio_activo = screen.getByTestId("comercial-proveedores-predio-activo-input")
        expect(predio_activo).toBeInTheDocument();
        expect(predio_activo).not.toBeDisabled();
        fireEvent.click(predio_activo);
        expect(predio_activo).toBeChecked();

        const predio_fruta = screen.getByTestId("comercial-proveedores-predio-fruta-input")
        expect(predio_fruta).toBeInTheDocument();

        const boton_guardar = screen.getByText(/guardar/i)
        expect(boton_guardar).toBeInTheDocument();

        const boton_cerrar = screen.getByText(/cerrar/i)
        expect(boton_cerrar).toBeInTheDocument();

        const boton_x = screen.getByText(/×/i)
        expect(boton_x).toBeInTheDocument();

    });

    it("Se pureba los objetos que se renderizan con el rol mayor a 2", async () => {
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            user: { rol: 3 }
        });

        const probarFormularioElementoRol = (id): void => {
            const item = screen.getByTestId(id)
            expect(item).toBeInTheDocument();
            expect(item).toBeDisabled();
        }

        render(
            <ModalProveedores
                proveedor={undefined}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        const ids = [
            "comercial-proveedores-codigo-predio-input",
            "comercial-proveedores-predio-predio-input",
            "comercial-proveedores-predio-ica-input",
            "comercial-proveedores-predio-ggn-input",
        ]

        ids.forEach(item => {
            probarFormularioElementoRol(item)
        });

        const item_fecha_ica = screen.getByTestId("comercial-proveedores-predio-fecha-ica-input")
        expect(item_fecha_ica).toBeInTheDocument();
        expect(item_fecha_ica).toBeDisabled();

        const item_fecha_ggn = screen.getByTestId("comercial-proveedores-predio-fecha-ggn-input")
        expect(item_fecha_ggn).toBeInTheDocument();
        expect(item_fecha_ggn).toBeDisabled();

        const boton_guardar = screen.getByText(/guardar/i)
        expect(boton_guardar).toBeInTheDocument();

        const boton_cerrar = screen.getByText(/cerrar/i)
        expect(boton_cerrar).toBeInTheDocument();

        const boton_x = screen.getByText(/×/i)
        expect(boton_x).toBeInTheDocument();


    });

    it("cuando se abre el modal con un proveedor, para modificar o ver sus datos", () => {


        render(
            <ModalProveedores
                proveedor={mockData}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        expect(screen.getByTestId("comercial-proveedores-codigo-predio-input"))
            .toHaveValue(String(mockData["CODIGO INTERNO"]));
        expect(screen.getByTestId("comercial-proveedores-predio-predio-input"))
            .toHaveValue(String(mockData.PREDIO));
        expect(screen.getByTestId("comercial-proveedores-predio-ica-input"))
            .toHaveValue(String(mockData.ICA.code));
        expect(screen.getByTestId("comercial-proveedores-predio-ggn-input"))
            .toHaveValue(String(mockData.GGN.code));
        expect(screen.getByTestId("comercial-proveedores-predio-nit-input"))
            .toHaveValue(String(mockData.nit_facturar));
        expect(screen.getByTestId("comercial-proveedores-predio-razon-input"))
            .toHaveValue(String(mockData.razon_social));
        expect(screen.getByTestId("comercial-proveedores-predio-propietario-input"))
            .toHaveValue(String(mockData.propietario));
        expect(screen.getByTestId("comercial-proveedores-predio-telefonop-input"))
            .toHaveValue(String(mockData.telefono_propietario));
        expect(screen.getByTestId("comercial-proveedores-predio-correo-input"))
            .toHaveValue(String(mockData.correo_informes));
        expect(screen.getByTestId("comercial-proveedores-predio-contacto-input"))
            .toHaveValue(String(mockData.contacto_finca));
        expect(screen.getByTestId("comercial-proveedores-predio-telefono-input"))
            .toHaveValue(String(mockData.telefono_predio));

        const item_fecha_ica = screen.getByTestId("comercial-proveedores-predio-fecha-ica-input")
        expect(item_fecha_ica).toHaveValue(mockData.ICA.fechaVencimiento.substring(0, 10));

        const item_fecha_ggn = screen.getByTestId("comercial-proveedores-predio-fecha-ggn-input")
        expect(item_fecha_ggn).toHaveValue(mockData.GGN.fechaVencimiento.substring(0, 10));

        const item_sispap = screen.getByTestId("comercial-proveedores-predio-sispap-input")
        expect(item_sispap).not.toBeChecked();

        const item_activo = screen.getByTestId("comercial-proveedores-predio-activo-input")
        expect(item_activo).toBeChecked();

    });

    const llenarFormulario = async (): Promise<void> => {
        const inputs = [
            { id: "comercial-proveedores-codigo-predio-input", value: mockData["CODIGO INTERNO"] },
            { id: "comercial-proveedores-predio-predio-input", value: mockData.PREDIO },
            { id: "comercial-proveedores-predio-ica-input", value: mockData.ICA.code },
            { id: "comercial-proveedores-predio-ggn-input", value: mockData.GGN.code },
            { id: "comercial-proveedores-predio-nit-input", value: mockData.nit_facturar },
            { id: "comercial-proveedores-predio-razon-input", value: mockData.razon_social },
            { id: "comercial-proveedores-predio-propietario-input", value: mockData.propietario },
            { id: "comercial-proveedores-predio-telefonop-input", value: mockData.telefono_propietario },
            { id: "comercial-proveedores-predio-correo-input", value: mockData.correo_informes },
            { id: "comercial-proveedores-predio-contacto-input", value: mockData.contacto_finca },
            { id: "comercial-proveedores-predio-telefono-input", value: mockData.telefono_predio },
        ];

        inputs.forEach(async ({ id, value }) => {
            const input = await screen.findByTestId(id);
            fireEvent.change(input, { target: { value } });
            expect(input).toHaveValue(String(value));
        });

        const predio_sispap = await screen.findByTestId("comercial-proveedores-predio-sispap-input")
        fireEvent.click(predio_sispap);
        expect(predio_sispap).toBeChecked();

        const item_fecha_ica = await screen.findByTestId("comercial-proveedores-predio-fecha-ica-input")
        fireEvent.change(item_fecha_ica, { target: { value: mockData.ICA.fechaVencimiento.substring(0, 10) } });
        expect(item_fecha_ica).toHaveValue(mockData.ICA.fechaVencimiento.substring(0, 10));

        const item_fecha_ggn = await screen.findByTestId("comercial-proveedores-predio-fecha-ggn-input")
        fireEvent.change(item_fecha_ggn, { target: { value: mockData.GGN.fechaVencimiento.substring(0, 10) } });
        expect(item_fecha_ggn).toHaveValue(mockData.GGN.fechaVencimiento.substring(0, 10));


        // Comprobar que inicialmente el select tiene el texto "Seleccione fruta"
        const select = await screen.findByTestId("comercial-proveedores-predio-fruta-seleccion-tipo");
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue(""); // Valor inicial

        // Esperar que las opciones se carguen
        await waitFor(() => {
            expect(screen.getByText("Limon")).toBeInTheDocument();
            expect(screen.getByText("Naranja")).toBeInTheDocument();
            expect(screen.getByText("Mandarina")).toBeInTheDocument();
        });

        //se agrega una fruta
        fireEvent.change(select, { target: { value: "Limon" } });
        expect(select).toHaveValue("Limon");

        const hectareasLimon = screen.getByPlaceholderText("Hectareas");
        fireEvent.change(hectareasLimon, { target: { value: mockData.tipo_fruta.Limon.hectareas } });
        expect(hectareasLimon).toHaveValue(String(mockData.tipo_fruta.Limon.hectareas));

        const arbolesLimon = screen.getByPlaceholderText("Arboles");
        fireEvent.change(arbolesLimon, { target: { value: mockData.tipo_fruta.Limon.arboles } });
        expect(arbolesLimon).toHaveValue(String(mockData.tipo_fruta.Limon.arboles));

        const botonAceptarLimon = screen.getByText(/aceptar/i);
        expect(botonAceptarLimon).toBeInTheDocument();
        fireEvent.click(botonAceptarLimon);

        expect(screen.getByTestId("comercial-proveedores-predio-fruta_arboles-0")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-predio-fruta-hecatareas-0")).toBeInTheDocument();

        fireEvent.change(select, { target: { value: "Naranja" } });
        expect(select).toHaveValue("Naranja");

        const hectareasNaranja = screen.getByPlaceholderText("Hectareas");
        fireEvent.change(hectareasNaranja, { target: { value: mockData.tipo_fruta.Naranja.hectareas } });
        expect(hectareasNaranja).toHaveValue(String(mockData.tipo_fruta.Naranja.hectareas));

        const arbolesNaranja = screen.getByPlaceholderText("Arboles");
        fireEvent.change(arbolesNaranja, { target: { value: mockData.tipo_fruta.Naranja.arboles } });
        expect(arbolesNaranja).toHaveValue(String(mockData.tipo_fruta.Naranja.arboles));

        const botonAceptarNaranja = screen.getByText(/aceptar/i);
        expect(botonAceptarNaranja).toBeInTheDocument();
        fireEvent.click(botonAceptarNaranja);

        expect(screen.getByTestId("comercial-proveedores-predio-fruta_arboles-1")).toBeInTheDocument();
        expect(screen.getByTestId("comercial-proveedores-predio-fruta-hecatareas-1")).toBeInTheDocument();

    }

    it("Agregar proveedor", async () => {
        document.body.innerHTML = `<dialog id="ingresar_proveedor_modal"></dialog>`;
        const dialogElement = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        dialogElement.close = vi.fn(); // Mockear `close()`

        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_constantes_sistema_tipo_frutas") {
                // Mock para la acción de obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: ["Limon", "Naranja", "Mandarina"],
                });
            } else if (request.action === "post_comercial_proveedores_add_proveedor") {
                // Mock para la acción de guardar el proveedor
                return Promise.resolve({
                    status: 200,
                    message: "Proveedor agregado con éxito",
                });
            } else {
                // Mock para cualquier otra acción
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });

        render(
            <ModalProveedores
                proveedor={undefined}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />

        );

        await llenarFormulario()

        const boton_guardar = screen.getByText(/guardar/i)
        fireEvent.click(boton_guardar);

        await vi.fn().mockResolvedValueOnce(window.api.server2({ action: 'post_comercial_proveedores_add_proveedor' }));

        expect(messageModalMock).toHaveBeenCalledWith("success", "Proveedor agregado con exito");

        // Validar que se cierra el diálogo
        expect(dialogElement.close).toHaveBeenCalled();
    })

    it("Agregar proveedor - error al guardar", async () => {
        document.body.innerHTML = `<dialog id="ingresar_proveedor_modal"></dialog>`;
        const dialogElement = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        dialogElement.close = vi.fn(); // Mockear `close()`

        // Mock para simular error en la API
        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_constantes_sistema_tipo_frutas") {
                // Mock para obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: ["Limon", "Naranja", "Mandarina"],
                });
            } else if (request.action === "post_comercial_proveedores_add_proveedor") {
                // Mock para simular error al guardar proveedor
                return Promise.resolve({
                    status: 400,
                    message: "Error al guardar el proveedor",
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });


        render(
            <ModalProveedores
                proveedor={undefined}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        await llenarFormulario();

        const botonGuardar = screen.getByText(/guardar/i);
        fireEvent.click(botonGuardar);

        await vi.fn().mockResolvedValueOnce(window.api.server2({ action: 'post_comercial_proveedores_add_proveedor' }));

        expect(messageModalMock).toHaveBeenCalledWith("error", "Code 400: Error al guardar el proveedor");

        // Validar que se cierra el diálogo
        expect(dialogElement.close).toHaveBeenCalled();
    });

    it("Modificar proveedor", async () => {
        document.body.innerHTML = `<dialog id="ingresar_proveedor_modal"></dialog>`;
        const dialogElement = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        dialogElement.close = vi.fn(); // Mockear `close()`

        // Mock para simular error en la API
        vi.spyOn(window.api, "server2").mockImplementation((request) => {
            if (request.action === "get_constantes_sistema_tipo_frutas") {
                // Mock para obtener frutas
                return Promise.resolve({
                    status: 200,
                    data: ["Limon", "Naranja", "Mandarina"],
                });
            } else if (request.action === "put_comercial_proveedores_modify_proveedor") {
                // Mock para simular error al guardar proveedor
                return Promise.resolve({
                    status: 200,
                    message: "Proveedor agregado con éxito",
                });
            } else {
                return Promise.reject(new Error("Acción no soportada en el mock"));
            }
        });


        render(
            <ModalProveedores
                proveedor={mockData}
                setProveedor={vi.fn()}
                handleObtenerData={vi.fn()}
            />
        );

        expect(screen.queryByTestId("comercial-proveedores-predio-fruta_arboles-2")).not.toBeInTheDocument();

        const boton_cancelar = screen.getByTestId("comercial-proveedores-predio-cancelar-1")
        expect(boton_cancelar).toBeInTheDocument();
        fireEvent.click(boton_cancelar);

        expect(screen.queryByTestId("comercial-proveedores-predio-fruta_arboles-1")).not.toBeInTheDocument();

        const input_predio = await screen.findByTestId("comercial-proveedores-predio-predio-input");
        expect(input_predio).toHaveValue(String(mockData.PREDIO));

        fireEvent.change(input_predio, { target: { value: "Finca El Paraíso modificado"} });
        expect(input_predio).toHaveValue("Finca El Paraíso modificado");

        const boton_guardar = screen.getByText(/guardar/i)
        fireEvent.click(boton_guardar);

        await vi.fn().mockResolvedValueOnce(window.api.server2({ action: 'put_comercial_proveedores_modify_proveedor' }));

        expect(messageModalMock).toHaveBeenCalledWith("success", "Proveedor agregado con exito");

        // Validar que se cierra el diálogo
        expect(dialogElement.close).toHaveBeenCalled();
    })

})