/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { requestContenedores, requestData } from "./services/request";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import FiltrosExportacionLotes from "./components/FiltrosExportacionLotes";
import TablaExportacionLotes from "./components/TablaExportacionLotes";
import ModalModificarExportacionLotes from "./components/ModalModificarExportacionLotes";
import { numeroContenedorType } from "./services/form";
import "./css/styles.css"

export default function SistemaExportacionLotes(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<lotesType[]>()
    const [page, setPage] = useState<number>(1)
    const [filtro, setFiltro] = useState<object>({})
    const [showModal, setShowModal] = useState<boolean>(false)
    const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
    const [numeroContenedor, setNumeroContenedor] = useState<numeroContenedorType>()
    useEffect(() => {
        obtenerData()
    }, [page])

    const obtenerData = async (): Promise<void> => {
        try {
            const request = requestData(page, filtro)
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            const contenedores: string[] = []
            response.data.forEach(element => {
                element.contenedores.forEach(contenedor => contenedores.push(contenedor))
            })
            const contenedoresSet = new Set(contenedores)
            const cont = [...contenedoresSet]
            const requestC = requestContenedores(cont)
            const responseContenedores = await window.api.server2(requestC)
            const objCont = {}
            cont.forEach(element => {
                objCont[element] = responseContenedores.data.find(item => item._id === element).numeroContenedor
            });
            setNumeroContenedor(objCont)
            setData([...response.data])
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const filtrar = (): void => {
        obtenerData()
    }
    const handleModificar = (): void => {
        setShowModal(!showModal)
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Exportacion</h2>
            <FiltrosExportacionLotes setFiltro={setFiltro} filtrar={filtrar} filtro={filtro} />
            <TablaExportacionLotes
                numeroContenedor={numeroContenedor}
                setLoteSeleccionado={setLoteSeleccionado}
                handleModificar={handleModificar}
                data={data} />
            <div className="volante-calidad-button-page-div">
                <button
                    onClick={(): void => setPage(page - 1)}
                    disabled={page === 1}
                    className="volante-calidad-button-page">
                    {<IoIosArrowBack />}
                </button>
                {page}
                <button
                    onClick={(): void => setPage(page + 1)}
                    className="volante-calidad-button-page">
                    {<IoIosArrowForward />}
                </button>
            </div>
            {showModal && 
        <ModalModificarExportacionLotes
          showModal={showModal}  
          numeroContenedor={numeroContenedor}
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar}
        />}
        </div>
    )
}