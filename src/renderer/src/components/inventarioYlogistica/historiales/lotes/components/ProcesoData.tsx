/* eslint-disable prettier/prettier */

import { dataContext } from "@renderer/App"
import { useContext, useEffect, useState } from "react"
import FiltrosColumnas from "../utils/FiltrosColumnas"
import FiltrosFilas from "../utils/FiltrosFilas"
import { filtroColumnasType } from "../type/types"
import { filtrosColumnasObj, ordenarDataExcel } from "../functions/functions"
import GraficasBarras from "../utils/GraficasBarras"
import GraficaLineal from "../utils/GraficaLineal"
import GraficaCircular from "../utils/GraficaCircular"
import TableInfoLotes from "../table/TableInfoLotes"
import PromediosProceso from "../utils/PromediosProceso"
import { filtroInit, filtrotype } from "../functions/filtroProceso"
import { lotesType } from "@renderer/types/lotesType"
import useAppContext from "@renderer/hooks/useAppContext"
import { numeroContenedorType, requestLotes, requestProveedor } from "../functions/request"
import TotalesProceso from "../utils/TotalesProceso"
import { predioType } from "@renderer/components/inventarioYlogistica/inventarios/reproceso descarte/types/types"

export default function ProcesoData(): JSX.Element {
    const { messageModal } = useAppContext();
    const dataGlobal = useContext(dataContext);
    if (!dataGlobal) {
        throw new Error("Error informes context data global")
    }
    const [columnVisibility, setColumnVisibility] = useState<filtroColumnasType>(filtrosColumnasObj)
    const [filtro, setFiltro] = useState<filtrotype>(filtroInit)
    const [prediosData, setPrediosData] = useState<predioType[]>([])
    // const [ef1, setEf1] = useState<string>(dataGlobal.dataComponentes)
    const [tipoGraficas, setTipoGraficas] = useState<string>('')
    const [data, setData] = useState<lotesType[]>([])
    const [numeroContenedor, setNumeroContenedor] = useState<numeroContenedorType>()
    //vuelve a pedir los datos al servidor
    const [reload, setReload] = useState<boolean>(false);

    useEffect(()=>{
        obtenerProveedores()
    },[])
    useEffect(() => {
        const saved = localStorage.getItem("lotes_filtro_rows");
        const savedCol = localStorage.getItem("lotes_filtro_col");
        if (saved) {
            setFiltro(JSON.parse(saved))
        }
        if (savedCol) {
            // Migrar el objeto guardado para incluir el nuevo campo
            const parsedCol = JSON.parse(savedCol);
            const updatedCol = {
                ...filtrosColumnasObj, // Esto asegura que todos los campos estén presentes
                ...parsedCol, // Sobrescribe con los valores guardados
            };
            setColumnVisibility(updatedCol);

            // Guardar el objeto actualizado de vuelta en localStorage
            localStorage.setItem("lotes_filtro_col", JSON.stringify(updatedCol));
        } else {
            // Si no hay nada guardado, usar el objeto por defecto
            setColumnVisibility(filtrosColumnasObj);
            localStorage.setItem("lotes_filtro_col", JSON.stringify(filtrosColumnasObj));
        }
        window.api.reload(() => {
            setReload(!reload)
        });
        window.api.Descargar(() => {
            const dataOrdenada = ordenarDataExcel(data, columnVisibility, numeroContenedor)
            const dataR = JSON.stringify(dataOrdenada)
            window.api.crearDocumento(dataR)
        })
        return () => {
            window.api.removeReload()
        }
    }, [reload])

    const obtenerProveedores = async (): Promise<void> => {
        try {
            const response = await window.api.server2(requestProveedor);
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`)
            setPrediosData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`);
            }
        }
    }
    const obtenerData = async (): Promise<void> => {
        try {
            const request = requestLotes(filtro)
            const datosLotes = await window.api.server2(request);
            if (datosLotes.status !== 200)
                throw new Error(datosLotes.message)
            //se vana obtener los datos para traer los contenedores
            const contenedores: string[] = []
            datosLotes.data.lotes.forEach(element => {
                element.contenedores.forEach(contenedor => contenedores.push(contenedor))
            })
            const objCont = {}
            datosLotes.data.contenedores.map(element => {
                objCont[element._id] = element.numeroContenedor
            });
            setNumeroContenedor(objCont)
            setData(datosLotes.data.lotes)
        } catch (e: unknown) {
            if (e instanceof Error) {
                messageModal("error", `${e.message}`);
            }
        }
    }
    const handleChange = (e): void => {
        setColumnVisibility({
            ...columnVisibility,
            [e.target.value]: e.target.checked,
        });
    }
    const buscar = (): void => {
        localStorage.setItem("lotes_filtro_rows", JSON.stringify(filtro))
        localStorage.setItem("lotes_filtro_col", JSON.stringify(columnVisibility))
        obtenerData()
    }
    const handleChangeFiltro = (event): void => {
        const { name, value, checked } = event.target;
        if (name === 'todosLosDatos') {
            console.log(checked)
            setFiltro({
                ...filtro,
                [name]: checked,
            });
        } else {
            const uppercaseValue = name === 'enf' ? value.toUpperCase().trim() : value;
            setFiltro({
                ...filtro,
                [name]: String(uppercaseValue),
            });
        }

    };
    return (
        <div className="componentContainer">
            <div>
                <h2>Lotes proceso</h2>
            </div>
            <div className="filtroContainer">
                <div>
                    <FiltrosColumnas columnVisibility={columnVisibility} handleChange={handleChange} />
                </div>
                <div>
                    <FiltrosFilas
                        filtro={filtro}
                        prediosData={prediosData}
                        buscar={buscar}
                        handleChangeFiltro={handleChangeFiltro}
                    />
                    <div className="m-2">
                    </div>
                </div>

            </div>
            <div>
                <PromediosProceso data={data} columnVisibility={columnVisibility} />
            </div>

            <div className="lotes-select-tipo-grafica-div">
                <select className="defaultSelect" onChange={(e): void => setTipoGraficas(e.target.value)}>
                    <option value="">Tipo de gráficas</option>
                    <option value="barras">Grafica de barras</option>
                    <option value="lineal">Grafica lineal</option>
                    <option value="circular">Grafica circular</option>
                </select>
            </div>
            <div className="lotes-grafica-container">
                {tipoGraficas === 'barras' && <GraficasBarras data={data} />}
                {tipoGraficas === 'lineal' && <GraficaLineal data={data} />}
                {tipoGraficas === 'circular' && <GraficaCircular data={data} />}
            </div>
            <div>
                <TotalesProceso data={data} columnVisibility={columnVisibility} />
            </div>

            <div>
                <TableInfoLotes data={data} numeroContenedor={numeroContenedor} columnVisibility={columnVisibility} />
            </div>
        </div>
    )
}
