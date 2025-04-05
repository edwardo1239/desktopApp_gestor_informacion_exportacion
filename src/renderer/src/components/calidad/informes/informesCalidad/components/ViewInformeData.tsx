/* eslint-disable prettier/prettier */
import { AiOutlineMore } from "react-icons/ai";
import { lotesType } from '@renderer/types/lotesType'
import '../css/datosLote.css'
import { useEffect, useRef, useState } from 'react';
import useAppContext from '@renderer/hooks/useAppContext';
import { contenedoresType } from '@renderer/types/contenedoresType';
import ViewInformeDatosGenerales from './ViewInformeDatosGenerales';
import ViewInformeResultados from './ViewInformeResultados';
import ViewInformeDescarte from './ViewInformeDescarte';
import ViewInformeObservaciones from './ViewInformeObservaciones';
import ViewInformeFotos from './ViewInformeFotos';
import ModificarPrecios from './ModificarPrecios';
import ResumenKilosFruta from './ResumenKilosFruta';
import MostrarPrecios from "./MostrarPrecios";
import { dataInformeInit, dataInformeType, obtenerPorcentage, totalLote, totalPrecios } from "@renderer/functions/informesLotes";
type propsType = {
    handleVolverTabla: () => void
    loteSeleccionado: lotesType | undefined
    captureComponent: () => void
    obtenerDatosDelServidor: () => void
    no_pagar_balin: (lote: lotesType) => void
}

let isVisible = false
export default function ViewInformeData(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    const [, setDataInforme] = useState<dataInformeType>(dataInformeInit)
    const [showResumen,] = useState<boolean>(false)

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (props.loteSeleccionado &&
            props.loteSeleccionado.contenedores &&
            props.loteSeleccionado.contenedores?.length > 0) {
            buscarContenedores()
        }
    }, [])


    useEffect(() => { }, [isVisible])

    const buscarContenedores = async (): Promise<void> => {
        try {
            const request = { action: "get_calidad_informes_contenedoresLote", data: props.loteSeleccionado?.contenedores }
            const response = await window.api.server2(request)
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`)
            }
        }
    }
    const finalizar_informe_proveedor = async (): Promise<void> => {
        try {
            const request = {
                action: "put_calidad_informes_loteFinalizarInforme",
                precio: props.loteSeleccionado?.predio.precio[props.loteSeleccionado.tipoFruta],
                _id: props.loteSeleccionado?._id,
                contenedores: props.loteSeleccionado?.contenedores
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            messageModal("success", "Informe finalizado con exito")
            props.obtenerDatosDelServidor();

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    const openContextMenu = (e): void => {
        e.preventDefault();

        const menu = menuRef.current;

        if (menu && !isVisible) {

            // Posiciona el menú en las coordenadas del clic
            menu.style.top = `${e.clientY + 10}px`;
            menu.style.left = `${e.clientX - 250}px`;

            // Muestra el menú y aplica animación
            menu.classList.remove("close");
            menu.classList.add("open");


            document.addEventListener("click", handleClickOutside);
            setTimeout(() => {
                isVisible = true
            }, 100)


        }

    };
    const handleClickOutside = (): void => {
        const menu = menuRef.current;
        if (isVisible && menu) {
            // Oculta el menú y aplica la animación de cierre
            menu.classList.remove("open");
            menu.classList.add("close");

            document.removeEventListener("click", handleClickOutside);

            isVisible = false

        }
    };

    const handleClickNoPagarBalin = (): void => {
        if (!props.loteSeleccionado) return
        props.loteSeleccionado.flag_balin_free = !props.loteSeleccionado.flag_balin_free;
        const lote = JSON.parse(JSON.stringify(props.loteSeleccionado));
        props.no_pagar_balin(lote)
    }


    //si el lote es indefinido
    if (props.loteSeleccionado === undefined) {
        return (
            <div>
                <div>Opsss, no se encontro el predio seleccionado</div>
                <button className="defaulButtonAgree" onClick={props.handleVolverTabla}>Regresar</button>
            </div>
        )
    }
    return (
        <div>
            <div className='informe-calidad-modificar-cont'>
                <div className='informe-calidad-modificar-div'>
                    <button className="defaulButtonAgree" onClick={props.handleVolverTabla}>
                        Regresar
                    </button>
                    {/* <button className="defaulButtonAgree" onClick={openModificarPrecios}>
                        Editar precios
                    </button> */}
                    <button className="defaulButtonAgree" onClick={finalizar_informe_proveedor}>
                        Finalizar informe
                    </button>

                </div>
                <div className='informe-calidad-modificar-div'>
                    <button className="kebab-button" onClick={openContextMenu}>
                        <AiOutlineMore fontSize={24} />
                    </button>
                </div>
            </div>

            {/* modal menu contextual */}
            <div
                ref={menuRef}
                className="informe-calidad-modificar-menu-context"
            >
                {/* <button onClick={handleCLickCasoFavorita}>Caso favorita</button> */}
                <button onClick={handleClickNoPagarBalin} >Pagar balín</button>

            </div>

            {showResumen ?
                <ResumenKilosFruta
                    contenedores={contenedores}
                    lote={props.loteSeleccionado}
                />
                :
                <div className="container-informe-calidad-lote" id="viewInformeDataContainer">
                    <h2>Informe de calidad para el productor</h2>
                    <hr />
                    <ViewInformeDatosGenerales
                        setDataInforme={setDataInforme}
                        contenedores={contenedores}
                        loteSeleccionado={props.loteSeleccionado} />
                    <hr />
                    <div className='informe-calidad-lote-div'>
                        <h3>Resultados</h3>
                    </div>
                    <table className='table-main-informe-proveedor' >
                        <thead>
                            <tr>
                                <th>Clasificacion</th>
                                <th>Unidad/Kg</th>
                                <th>Porcentaje</th>
                                <th>Precio /Kg</th>
                                <th>PrecioTotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ViewInformeResultados loteSeleccionado={props.loteSeleccionado} />
                            <ViewInformeDescarte loteSeleccionado={props.loteSeleccionado} />
                            <tr>
                                <td>Directo Nacional</td>
                                <td>{props.loteSeleccionado.directoNacional?.toFixed(2)} Kg</td>
                                <td>{props.loteSeleccionado.kilos !== 0 ? ((props.loteSeleccionado.directoNacional * 100)
                                    / props.loteSeleccionado.kilos).toFixed(2) : '0'}%</td>
                                <MostrarPrecios
                                    loteSeleccionado={props.loteSeleccionado}
                                    tipoPrecio="frutaNacional"
                                    kilosFruta={(props.loteSeleccionado.directoNacional)} />
                            </tr>
                            <tr className='informe-calidad-total-fila fondo-impar'>
                                <td>Total</td>
                                <td>
                                    {totalLote(props.loteSeleccionado).toFixed(2)} Kg
                                </td>
                                <td>
                                    {obtenerPorcentage(
                                        totalLote(props.loteSeleccionado),
                                        (props.loteSeleccionado.kilos ?? 1)
                                    ).toFixed(2)}%
                                </td>
                                <td></td>
                                <td>
                                    {
                                        new Intl.NumberFormat('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(totalPrecios(props.loteSeleccionado))
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='informe-calidad-lote-div'>
                        <h3>Observaciones</h3>
                    </div>
                    <ViewInformeObservaciones loteSeleccionado={props.loteSeleccionado} />
                    <div className='informe-calidad-lote-div'>
                        <h3>Evidencias fotograficas</h3>
                    </div>
                    <div>
                        <ViewInformeFotos loteSeleccionado={props.loteSeleccionado} />
                    </div>

                </div>}

            <div className='informe-calidad-lote-div'>
                <button className='defaulButtonAgree' onClick={props.captureComponent}>Generar informe</button>
            </div>
            <ModificarPrecios
                loteSeleccionado={props.loteSeleccionado} />
        </div>
    )
}