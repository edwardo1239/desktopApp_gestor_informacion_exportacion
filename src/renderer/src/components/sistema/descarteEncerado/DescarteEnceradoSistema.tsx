/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType";
import { requestData } from "./services/request";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import FiltroDescarteEncerado from "./components/FiltroDescarteEncerado";
import TablaDescarteEncerado from "./components/TablaDescarteEncerado";
import ModalModificarDescarteEncerado from "./components/ModalModificarDescarteEncerado";

export default function DescarteEnceradoSistema(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<lotesType[]>()
    const [page, setPage] = useState<number>(1)
    const [filtro, setFiltro] = useState<object>({})
    const [showModal, setShowModal] = useState<boolean>(false)
    const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
    useEffect(() => {
        obtenerData()

    }, [page])

    const obtenerData = async (): Promise<void> => {
        try {
            const request = requestData(page, filtro)
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
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
            <h2>Descarte Encerado</h2>
            <FiltroDescarteEncerado setFiltro={setFiltro} filtrar={filtrar} filtro={filtro} />
            <TablaDescarteEncerado
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
        <ModalModificarDescarteEncerado
          showModal={showModal}  
          loteSeleccionado={loteSeleccionado}
          handleModificar={handleModificar}
        />}
        </div>
    )
}