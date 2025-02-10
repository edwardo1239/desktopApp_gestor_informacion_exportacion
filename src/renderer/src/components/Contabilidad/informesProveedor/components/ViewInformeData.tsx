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
import { dataInformeInit, dataInformeType, obtenerPorcentage, totalLote } from '../functions/data';
import ViewInformeObservaciones from './ViewInformeObservaciones';
import ViewInformeFotos from './ViewInformeFotos';
import { totalPrecios } from '../functions/totalPrecios'
import ModificarPrecios from './ModificarPrecios';
import ResumenKilosFruta from './ResumenKilosFruta';
type propsType = {
    handleVolverTabla: () => void
    loteSeleccionado: lotesType | undefined
    captureComponent: () => void
    modificarPrecios: (e) => void
    casoFavorita: (lote: lotesType) => void

}
let isVisible = false
const contenedor_favorita = "659dbd9a347a42d899293411"

export default function ViewInformeData(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [contenedores, setContenedores] = useState<contenedoresType[]>([]);
    const [, setDataInforme] = useState<dataInformeType>(dataInformeInit)
    const [showResumen, setShowResumen] = useState<boolean>(false)
    // const [isVisible, setIsVisible] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (props.loteSeleccionado &&
            props.loteSeleccionado.contenedores &&
            props.loteSeleccionado.contenedores?.length > 0) {
            buscarContenedores()
        }
    }, [])

    useEffect(() => {
        if (props.loteSeleccionado === undefined) return
        if (!props.loteSeleccionado.exportacionDetallada) return
        if (props.loteSeleccionado.flag_is_favorita) {
            const cont = contenedores.filter(
                item => typeof item.infoContenedor.clienteInfo === 'object' && 
                    item.infoContenedor.clienteInfo._id === contenedor_favorita
            );
            let kilos = 0;
            cont.forEach(key => {
                if (props.loteSeleccionado === undefined) return

                const data = props.loteSeleccionado.exportacionDetallada.any[key._id]
                if(!data) return;

                Object.keys(data).forEach(item => {
                    if (item !== "_id") {
                        if (props.loteSeleccionado !== undefined) {
                            const kilosContenedor = data[item]
                            props.loteSeleccionado[`calidad${item}`] -= kilosContenedor;
                            kilos += kilosContenedor;
                        }
                    }
                })
            })
            if (props.loteSeleccionado !== undefined) {
                props.loteSeleccionado.descarteEncerado ?
                    props.loteSeleccionado.descarteEncerado.pareja += kilos : 0
            }
            props.loteSeleccionado.observaciones += "  - Contenedor la favorita"
            const lote = JSON.parse(JSON.stringify(props.loteSeleccionado));
            props.casoFavorita(lote)

        }
    }, [contenedores])

    const buscarContenedores = async (): Promise<void> => {
        try {
            const request = { action: "obtener_contenedores_lotes", data: props.loteSeleccionado?.contenedores }
            const response = await window.api.server2(request)
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            setContenedores(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`)
            }
        }
    }


    const ver_resumen_kilos = (): void => {
        setShowResumen(!showResumen)
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

                    {props.loteSeleccionado.aprobacionComercial &&
                        <button className="defaulButtonAgree" onClick={ver_resumen_kilos}>
                            Ver resumen kilos
                        </button>
                    }
                </div>
                <div className='informe-calidad-modificar-div'>
                    <button className="kebab-button" onClick={openContextMenu}>
                        <AiOutlineMore fontSize={24} />
                    </button>
                </div>
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
                modificarPrecios={props.modificarPrecios}
                loteSeleccionado={props.loteSeleccionado} />
        </div>
    )
}