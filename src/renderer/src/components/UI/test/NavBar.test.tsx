/* eslint-disable prettier/prettier */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, Mock, afterEach } from "vitest";
import NavBar from "../NavBar";
import useAppContext from "@renderer/hooks/useAppContext";

vi.mock("@renderer/hooks/useAppContext");
const messageModalMock = vi.fn();
const seleccionWindowMock = vi.fn();

// tests/setup.ts o en la parte superior del test
Object.defineProperty(window, 'api', {
    writable: true,
    value: {
        reporteFallo: vi.fn(), 
        sugerenciaMejora: vi.fn(), 
    },
});

describe("NavBar componenet", () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        // Asignas la implementación por defecto (rol=2) a useAppContext
        (useAppContext as unknown as Mock).mockReturnValue({
            messageModal: messageModalMock,
            seleccionWindow: seleccionWindowMock

        });



    });
    afterEach(() => {
        cleanup();
    });

    it("Se prueba que se rendericen los elementos", () => {
        render(<NavBar
            theme="Ligth"
            changeTheme={vi.fn()}
            showSideBar={true}
            setShowSideBar={vi.fn()}
        />)

        // Logo
        const logo = screen.getByTestId("UI-navbar-logo");
        expect(logo).toBeInTheDocument();

        // Botón de fallos
        const fallos = screen.getByTestId("UI-navbar-fallos");
        expect(fallos).toBeInTheDocument();

        // Botón de sugerencia
        const sugerencia = screen.getByTestId("UI-navbar-sugerencia");
        expect(sugerencia).toBeInTheDocument();

        // Botón de cuenta
        const cuenta = screen.getByTestId("UI-navbar-cuenta");
        expect(cuenta).toBeInTheDocument();

        // Botón de sidebar
        const sideBarToggle = screen.getByTestId("UI-navbar-sidebar");
        expect(sideBarToggle).toBeInTheDocument();

        // Botón de cambiar tema
        const tema = screen.getByTestId("UI-navbar-tema");
        expect(tema).toBeInTheDocument();

        // Botón de cerrar sesión
        const cerrarSesion = screen.getByTestId("UI-navbar-cerrar-sesión");
        expect(cerrarSesion).toBeInTheDocument();

    })

    it("Cuandos se da click en reporte de fallos", async () => {

        const mockReporteFallo = vi.spyOn(window.api, 'reporteFallo')
            .mockResolvedValueOnce(); // simulamos que resuelve sin error

        render(<NavBar
            theme="Ligth"
            changeTheme={vi.fn()}
            showSideBar={true}
            setShowSideBar={vi.fn()} />
        )

        const fallos = await screen.findByTestId("UI-navbar-fallos");
        fireEvent.click(fallos);

        expect(mockReporteFallo).toHaveBeenCalledTimes(1);

        // ----------------------------
        // PRUEBA DEL FLUJO DE ERROR:
        // ----------------------------
        // Simulamos que la próxima vez que se llame, lance un error
        mockReporteFallo.mockRejectedValueOnce(new Error("Error simulado"));

        fireEvent.click(fallos);

        // Se habrá llamado otra vez
        expect(mockReporteFallo).toHaveBeenCalledTimes(2);


        await waitFor(() => {
            // Verificamos que se haya llamado el modal con el mensaje de error
            expect(messageModalMock).toHaveBeenCalledWith(
                "error",
                "Error Error: Error simulado"
            );
        });


    })

    it("Cuandos se da click en sugerencia de mejora", async () => {

        const mockSugerenciaMejora = vi.spyOn(window.api, 'sugerenciaMejora')
            .mockResolvedValueOnce(); // simulamos que resuelve sin error

        render(<NavBar
            theme="Ligth"
            changeTheme={vi.fn()}
            showSideBar={true}
            setShowSideBar={vi.fn()} />
        )

        const fallos = await screen.findByTestId("UI-navbar-sugerencia");
        fireEvent.click(fallos);

        expect(mockSugerenciaMejora).toHaveBeenCalledTimes(1);

        // ----------------------------
        // PRUEBA DEL FLUJO DE ERROR:
        // ----------------------------
        // Simulamos que la próxima vez que se llame, lance un error
        mockSugerenciaMejora.mockRejectedValueOnce(new Error("Error simulado"));

        fireEvent.click(fallos);

        // Se habrá llamado otra vez
        expect(mockSugerenciaMejora).toHaveBeenCalledTimes(2);


        await waitFor(() => {
            // Verificamos que se haya llamado el modal con el mensaje de error
            expect(messageModalMock).toHaveBeenCalledWith(
                "error",
                "Error Error: Error simulado"
            );
        });


    })

});


