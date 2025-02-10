/* eslint-disable prettier/prettier */

// HelloWorld.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HelloWorld from "./HelloWorld";
import "@testing-library/jest-dom";

describe("HelloWorld component", () => {
    it("renderiza el texto ¡Hola Mundo!", () => {
        render(<HelloWorld />);
        const helloElement = screen.getByTestId('hello');
        expect(helloElement).toBeInTheDocument();
        expect(helloElement).toHaveTextContent('¡Hola Mundo!');
    });
});
