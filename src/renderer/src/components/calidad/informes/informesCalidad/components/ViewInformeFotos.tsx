/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext"
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import '../css/informesFotos.css'
type propsType = {
    loteSeleccionado: lotesType
}
export default function ViewInformeFotos(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [defecto, setDefecto] = useState<string[]>([])
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    if (props.loteSeleccionado.calidad?.fotosCalidad === undefined) {
        return (
            <div>No hay imagenes</div>
        )
    }
    useEffect(() => {
        loadImages()
        return () => {
            setImages([])
        }
    }, [])
    const loadImages = async (): Promise<void> => {
        try {
            setLoading(true)
            const urlsObj = { ...props.loteSeleccionado.calidad?.fotosCalidad };
            delete urlsObj.fechaIngreso

            const keys = Object.keys(urlsObj)
            for (let i = 0; i < keys.length; i++) {
                const response = await window.api.server2({
                    action: "obtener_imagen_lote_calidad", data: urlsObj[keys[i]]
                })
                if (response.status !== 200) {
                    throw new Error("Error cargando la imagen")
                }
                const base64Image = response.data; // Suponiendo que response.data es una sola cadena base64
                const imageUrl = `data:image/jpeg;base64,${base64Image}`;

                setImages((prevImages) => [...prevImages, imageUrl]);  // Actualiza el estado con la nueva imagen
                setDefecto((prevDefecto) => [...prevDefecto, keys[i]]);
            }
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`)
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="informe-calidad-lote-fotos-div">
            {loading && <p>Cargando imágenes...</p>}
            {images.map((src, index) => (
                <div key={index}>
                    <img src={src} alt={`${defecto[index]}`} width={250} height={250} />
                    <p>{defecto[index]}</p>
                </div>
            ))}
        </div>
    )
}
