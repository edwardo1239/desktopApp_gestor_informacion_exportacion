/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import FilstrosFecha from "./utils/FilstrosFecha"
import { registrosType } from "./type/type"
import TablaVolantecalidad from "./table/TablaVolantecalidad"
import { FaCircleArrowRight } from "react-icons/fa6";
import TableResumenVolanteCalidad from "./table/TableResumenVolanteCalidad"
import Graficas from "./components/Graficas"
import useAppContext from "@renderer/hooks/useAppContext"
import "./css/styles.css"

export default function VolanteCalidad(): JSX.Element {
    const { messageModal } = useAppContext()
    const [data, setData] = useState<registrosType[]>([])
    const [fechaInicio, setFechaInicio] = useState<string>()
    const [fechaFin, setFechaFin] = useState<string>()
    const [tipoFruta, setTipoFruta] = useState<string>('')
    const [showResume, setShowResume] = useState<boolean>(true)
    useEffect((): void => {
        obtenerDatos()
    }, [])
    const obtenerDatos = async (): Promise<void> => {
        try {
            const request = {
                action: 'obtener_volante_calidad',
                tipoFruta: tipoFruta,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            }
            const response = await window.api.server2(request);
            console.log(response)

            if (response.status !== 200) {
                throw new Error(response.message)
            }
            setData(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const buscar = ():void =>{
        obtenerDatos()
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <div>
                <h2>
                    Volante calidad
                </h2>
            </div>
            <div>
                <FilstrosFecha buscar={buscar} setFechaFin={setFechaFin} setFechaInicio={setFechaInicio} setTipoFruta={setTipoFruta} />
            </div>
            <div >
                <div className="volante-calidad-div-graficas">
                    <Graficas data={data} />
                </div>
            </div>
            <div className="volante-calidad-div-botones-cambio-tabla">
                {showResume ?
                    <button onClick={(): void => setShowResume(!showResume)} className="volante-calidad-boton-cambio-tabla">
                        <span>
                            Resumen
                        </span>
                        <span >
                            <FaCircleArrowRight />
                        </span>
                    </button>
                    :
                    <button
                        onClick={(): void => setShowResume(!showResume)} className="volante-calidad-boton-cambio-tabla">
                        <span >
                            Tabla
                        </span>
                        <span>
                            <FaCircleArrowRight />
                        </span>
                    </button>
                }
            </div>
            {showResume ?
                <div >
                    <TableResumenVolanteCalidad data={data} />
                </div> : <div>
                    <TablaVolantecalidad data={data} />
                </div>
            }

        </div>

    )
}
