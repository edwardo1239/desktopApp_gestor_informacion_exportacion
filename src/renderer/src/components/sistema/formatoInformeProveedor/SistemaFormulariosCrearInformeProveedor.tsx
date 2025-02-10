/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"
import { proveedoresType } from "@renderer/types/proveedoresType";
import { useEffect, useState } from "react";
import InfoGeneral from "./components/InfoGeneral";
import InfoExportacion from "./components/InfoExportacion";
import ClasificacionDescarte from "./components/ClasificacionDescarte";
import InfoDescarte from "./components/InfoDescarte";
import PruebasPlataforma from "./components/PruebasPlataforma";
import ObservacionesCalidad from "./components/ObservacionesCalidad";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";
import './styles/styles.css'
import './styles/datosLote.css'
import Precios from "./components/Precios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InformeCalidad from "./components/InformeCalidad";

export type formType = {
    enf?: string
    tipoFruta?: string
    fecha_ingreso_patio?: string,
    predio?: string
    kilos?: string
    contenedores?: string
    calidad1?: string
    calidad15?: string
    calidad2?: string
    descarteGeneral?: string
    pareja?: string
    balin?: string
    extra?: string
    descompuesta?: string
    hojas?: string
    piel?: string
    frutaNacional?: string
    brix?: string
    acidez?: string
    ratio?: string
    zumo?: string
    observacion1?: string
    observacion2?: string
    observacion3?: string
    observacion4?: string
    precioCalidad1?: string
    precioCalidad15?: string
    precioCalidad2?: string
    precioDescarte?: string
    precioFrutaNacional?: string
    precioCombinado?: string
}

type calisificacionDescarteType = { [key: string]: string }

interface ImageData {
    url: string;
    name: string;
}

export default function SistemaFormulariosCrearInformeProveedor(): JSX.Element {
    const { messageModal } = useAppContext();
    const [proveedores, setProveedores] = useState<proveedoresType[]>()
    const [itemsClasifiacionDescarte, setItemsClasificacionDescarte] = useState();
    const [observacionesCalidad, setObservacionescalidad] = useState()

    const [formState, setFormState] = useState<formType>()
    const [clasificacionDescarte, setClasificacionDescarte] = useState<calisificacionDescarteType>()
    const [images, setImages] = useState<ImageData[]>([])

    const [numeroFormato, setNumeroFormato] = useState<number>(1)
    const obtenerProveedores = async (): Promise<void> => {
        try {
            const request = {
                action: "getProveedores"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setProveedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerClasificacionDescarte = async (): Promise<void> => {
        try {
            const request = {
                action: "get_constantes_sistema_clasificacion_descarte"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setItemsClasificacionDescarte(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const obtenerObservacionesCalidad = async (): Promise<void> => {
        try {
            const request = {
                action: "get_constantes_sistema_observaciones_calidad"
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setObservacionescalidad(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    useEffect(() => {
        obtenerProveedores()
        obtenerClasificacionDescarte()
        obtenerObservacionesCalidad()
    }, [])
    const handleChange = (event): void => {
        const { name, value } = event.target;

        setFormState((prev) => {
            if (!prev) {
                return { [name]: value }
            } else {
                return { ...prev, [name]: value }
            }
        });
    };
    const handleChangeDescarte = (event): void => {
        const { name, value } = event;

        setClasificacionDescarte((prev) => {
            if (!prev) {
                return { [name]: value }
            } else {
                return { ...prev, [name]: value }
            }
        });
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(event.target.files || []);
        const imageUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setImages(imageUrls);
    }

    const captureComponent = async (e): Promise<void> => {
        e.preventDefault()
        const element = document.getElementById('viewInformeDataContainerBlanco');
        if (element) {

            const FIXED_WIDTH = 1150;


            // Esperar a que todos los elementos estén completamente renderizados
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Opciones mejoradas para html2canvas
            const canvas = await html2canvas(element, {
                scale: 1,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: '#ffffff',
                onclone: (document) => {
                    // Asegurarse de que las tablas tengan los estilos correctos
                    const clonedElement = document.getElementById('viewInformeDataContainerBlanco');
                    if (clonedElement) {
                        clonedElement.style.width = `${FIXED_WIDTH}px`;

                        // Copiar los estilos del elemento original
                        const originalStyles = window.getComputedStyle(element);
                        clonedElement.style.fontFamily = originalStyles.fontFamily;
                        clonedElement.style.fontSize = originalStyles.fontSize;
                        clonedElement.style.lineHeight = originalStyles.lineHeight;

                        const tables = clonedElement.getElementsByTagName('table');
                        for (const table of tables) {
                            table.style.borderCollapse = 'collapse';
                            table.style.backgroundColor = '#ffffff';

                            const cells = table.getElementsByTagName('td');
                            for (const cell of cells) {
                                cell.style.verticalAlign = 'middle';
                                cell.style.padding = '5px';
                                cell.style.backgroundColor = '#ffffff';
                            }
                        }
                    }
                },
                width: FIXED_WIDTH,
            });
            const dataURL = canvas.toDataURL('image/png');
            const alturaDoc = canvas.height

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [FIXED_WIDTH, alturaDoc]
            });
            pdf.addImage(dataURL, 'PNG', 0, 0, FIXED_WIDTH, alturaDoc); // Ajusta las dimensiones según sea necesario
            pdf.save(`${formState?.enf} ${formState?.tipoFruta} ${formState?.kilos} ${new Date(formState?.fecha_ingreso_patio ?? '').toLocaleDateString('es-CO', {
                year: 'numeric',
                month: "2-digit",
                day: "2-digit",
                timeZone: "America/Bogota"
            })}.pdf`);
        }
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Crear informe calidad proveedor</h2>
            <hr />
            <div className="sistema-formato-informeproveedores-form-container">

                {numeroFormato === 1 &&
                    <InfoGeneral
                        formState={formState}
                        proveedores={proveedores}
                        handleChange={handleChange} />
                }
                {numeroFormato === 2 &&
                    <InfoExportacion
                        formState={formState}
                        handleChange={handleChange} />
                }
                {numeroFormato === 3 &&
                    <ClasificacionDescarte
                        setClasificacionDescarte={setClasificacionDescarte}
                        handleChangeDescarte={handleChangeDescarte}
                        clasificacionDescarte={clasificacionDescarte}
                        itemsClasifiacionDescarte={itemsClasifiacionDescarte} />
                }
                {numeroFormato === 4 &&
                    <InfoDescarte
                        formState={formState}
                        handleChange={handleChange} />
                }
                {numeroFormato === 5 &&
                    <PruebasPlataforma formState={formState} handleChange={handleChange} />
                }
                {numeroFormato === 6 &&
                    <ObservacionesCalidad
                        formState={formState}
                        handleChange={handleChange}
                        observacionesCalidad={observacionesCalidad} />
                }
                {numeroFormato === 7 &&
                    <Precios
                        formState={formState}
                        handleChange={handleChange} />
                }
                {numeroFormato === 8 &&
                    <div className="info-general">
                        <label>
                            <p>Fotos</p>
                            <input onChange={handleFileChange} type="file" multiple accept="image/*" />
                        </label>
                        <div></div>
                    </div>
                }
                {(numeroFormato === 9 &&
                    formState &&
                    proveedores &&
                    clasificacionDescarte &&
                    itemsClasifiacionDescarte) ?

                    <>
                        <InformeCalidad
                            formState={formState}
                            proveedores={proveedores}
                            clasificacionDescarte={clasificacionDescarte}
                            itemsClasifiacionDescarte={itemsClasifiacionDescarte}
                            images={images} />
                        <button className="button-add" onClick={captureComponent}>Crear</button>

                    </>

                    :

                    <div>Faltan ingresar datos</div>
                }

            </div>
            <BotonesPasarPaginas
                setPage={setNumeroFormato}
                division={1}
                page={numeroFormato}
                numeroElementos={8} />
        </div>
    )
}