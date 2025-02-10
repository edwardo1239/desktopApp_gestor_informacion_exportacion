/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react"
import TablaHistorialDespachoDescarte from "./components/TablaHistorialDespachoDescarte";
import { despachoDescartesType } from "@renderer/types/despachoDescartesType";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";

export default function HistorialDespachoDescartes(): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<despachoDescartesType[]>();
    const [countPage, setCountPage] = useState<number>(1);

    useEffect(() => {
        obtenerData();
        window.api.reload(() => {
            obtenerData()
        });
        return () => {
            window.api.removeReload()
        }
    }, []);

    const obtenerData = async (): Promise<void> => {
        try {
            const request = {
                action: "get_historial_descarte",
                page: countPage
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setData(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    return (
        <div>
            <div className="navBar"></div>
            <h2>Historial despacho descarte</h2>
            <hr />

            <TablaHistorialDespachoDescarte data={data} />
            <div></div>
            <div className="paage-tabla-div-button">
                {countPage === 1 ? <div></div> :
                    <button onClick={(): void => setCountPage(countPage - 1)}>
                        <GrLinkPrevious />
                    </button>}
                <p>{countPage === 1 ? 1 : countPage}</p>
                {data && data?.length < 50 ? <div></div>
                    :
                    <button onClick={(): void => setCountPage(countPage + 1)}>
                        <GrLinkNext />
                    </button>
                }
            </div>
        </div>
    )
}
