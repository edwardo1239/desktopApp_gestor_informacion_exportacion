/* eslint-disable prettier/prettier */

import { precioProveedorType } from "@renderer/types/preciosTypes";

export const mockPrecioProveedores: precioProveedorType[] = [
    {
        _id: "a1b2c3",
        fecha: "2025-02-20",
        tipoFruta: "Manzana",
        "1": 100,
        "15": 150,
        "2": 120,
        frutaNacional: 80,
        descarte: 5,
        predios: ["Predio A", "Predio B"],
        week:50,
        year:2024,
        comentario:"Comentario 3"

    },
    {
        _id: "d4e5f6",
        fecha: "2025-02-21",
        tipoFruta: "Naranja",
        "1": 90,
        "15": 140,
        "2": 110,
        frutaNacional: 70,
        descarte: 3,
        predios: ["Predio C"],
        week:1,
        year:2025,
        comentario:"Comentario 2"


    },
    {
        _id: "g7h8i9",
        fecha: "2025-02-22",
        tipoFruta: "Pera",
        "1": 95,
        "15": 145,
        "2": 115,
        frutaNacional: 75,
        descarte: 4,
        predios: ["Predio A", "Predio D"],
        week:5,
        year:2025,
        comentario:"Comentario 1"

    }
];
