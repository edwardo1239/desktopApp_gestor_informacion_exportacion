/* eslint-disable prettier/prettier */

import { proveedoresType } from "../types/proveedoresType";



export const mockDataProveedores: proveedoresType[] = [
    {
        _id: "454sdad87w8q4e5w",
        PREDIO: "Finca El Paraíso",
        ICA: {
            code: "ICA12345",
            tipo_fruta: ["Limon", "Naranja"],
            fechaVencimiento: new Date().toISOString(),
        },
        "CODIGO INTERNO": 62153,
        GGN: {
            code: "GGN98765",
            fechaVencimiento: new Date().toISOString(),
            paises: ["Colombia", "Ecuador"],
            tipo_fruta: ["Limon", "Naranja"],
        },
        tipo_fruta: {
            Limon: { arboles: 100, hectareas: 5 },
            Naranja: { arboles: 200, hectareas: 10 },
        },
        PROVEEDORES: "AgroExport",
        DEPARTAMENTO: "Antioquia",
        activo: true,
        precio: {
            Limon:"14564546sdfs",
            Naranja: "sadasd4as4d8asd",
            fecha: new Date().toISOString(),
        },
        SISPAP: false,
        telefono_predio: "+57 3123456789",
        contacto_finca: "Juan Pérez",
        correo_informes: "contacto@finca.com",
        telefono_propietario: "+57 9876543210",
        propietario: "María López",
        razon_social: "Frutas del Campo S.A.",
        nit_facturar: "900123456-7",
        precioFijo: false,
                departamento: "Quindio",
        municipio:"Armenia"
    },
    {
        _id: "123abc456def",
        PREDIO: "Hacienda La Gloria",
        ICA: {
            code: "ICA67890",
            tipo_fruta: ["Mandarina", "Mango"],
            fechaVencimiento: new Date().toISOString(),
        },
        "CODIGO INTERNO": 98765,
        GGN: {
            code: "GGN54321",
            fechaVencimiento: new Date().toISOString(),
            paises: ["Perú", "Brasil"],
            tipo_fruta: ["Mandarina", "Mango"],
        },
        tipo_fruta: {
            Mandarina: { arboles: 150, hectareas: 6 },
            Mango: { arboles: 250, hectareas: 12 },
        },
        PROVEEDORES: "FruviExport",
        DEPARTAMENTO: "Cundinamarca",
        activo: false,
        precio: {
            Limon: "as2d13a21sd3",
            Naranja: "asda55455a4s",
            fecha: new Date().toISOString(),
        },
        SISPAP: true,
        telefono_predio: "+57 9876543210",
        contacto_finca: "Carlos García",
        correo_informes: "contacto@haciendalagloria.com",
        telefono_propietario: "+57 1234567890",
        propietario: "Ricardo Pérez",
        razon_social: "Exportadora Gloria S.A.",
        nit_facturar: "800123456-8",
        precioFijo: false,
        departamento: "Quindio",
        municipio:"Armenia"

    },
];