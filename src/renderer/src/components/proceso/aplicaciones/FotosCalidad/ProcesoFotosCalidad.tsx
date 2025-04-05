/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext";
import { lotesType } from "@renderer/types/lotesType"
import { useEffect, useState } from "react"
import './css/styles.css'

export default function ProcesoFotosCalidad(): JSX.Element {
    const { messageModal } = useAppContext();
    const [predios, setPredios] = useState<lotesType[]>()
    const [predioSeleccionado, setPredioSeleccionado] = useState<lotesType>()
    const [images, setImages] = useState<FileList | undefined>()
    const [imagesUpload, setImagesUpload] = useState<string[]>([])
    const [fotoName, setFotoName] = useState<string[]>([])

    useEffect(() => {
        obtenerPredios();
    }, []);

    const obtenerPredios = async (): Promise<void> => {
        try {
            const request = { action: 'get_proceso_aplicaciones_fotoCalidad' }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setPredios(response.data)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const handleLotes = (e: string): void => {
        const lote = predios?.find(item => item._id === e)
        if (lote) {
            setPredioSeleccionado(lote)
        }
    }
    const handleImagesInput = (files): void => {
        setImages(files)
    }
    const handleGuardar = async (): Promise<void> => {
        try {
            if (!images) {
                throw new Error("No se han ingresado imagenes.")
            }

            for (let i = 0; i < images.length; i++) {

                const base64Image = await fileToBase64(images[i]);
                const name = predioSeleccionado?._id + "_" + images[i].name.split('.')[0]
                const request = {
                    action: "post_proceso_aplicaciones_fotoCalidad",
                    _id: predioSeleccionado?._id,
                    foto: base64Image, // Enviar el archivo como base64
                    fotoName: name, // Agregar el nombre del archivo
                }
                const response = await window.api.server2(request);
                if (response.status !== 200)
                    throw new Error(`Code ${response.status}: ${response.message}`)

                setImagesUpload((prev) => [...prev, base64Image])
                setFotoName((prev) => [...prev, name])
            }


        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (): void => resolve(reader.result as string);
            reader.onerror = (error): void => reject(error);
        });
    };
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Ingreso Fotos Calidad</h2>
            <hr />
            <div className='filtroContainer' >
                <select onChange={(e): void => handleLotes(e.target.value)} >
                    <option value="">Predios</option>
                    {predios && predios.map(item => (
                        <option value={item._id} key={item._id}>
                            {item.enf + " - " + item.predio.PREDIO}
                        </option>
                    ))}
                </select>
                <input type="file" onChange={(e): void => handleImagesInput(e.target.files)} accept="image/*" className="input-imagenes" multiple />
                <button style={{ marginLeft: "auto" }} onClick={handleGuardar}>Guardar</button>

            </div>
            <hr />
            <div className="fotos-calidad-div-show-inputs">
                <h3>Fotos guardadas:</h3>
                {imagesUpload.map((image, index) => (
                    <div key={index}>
                        <img  src={image} alt={`Imagen ${index}`} />
                        <p>{fotoName[index]}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
