/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { formInit } from "../services/form";
import { proveedoresType } from "@renderer/types/proveedoresType";
import useAppContext from "@renderer/hooks/useAppContext";
import { request_guardar_cambios, request_predios } from "../services/request";
import { recordLotesType } from "@renderer/types/recorLotesType";

type propsType = {
    handleModificar: () => void
    loteSeleccionado: recordLotesType | undefined
    obtenerData: () => void
}

export default function ModalModificarLote(props: propsType): JSX.Element {
    const { messageModal } = useAppContext()
    const [formState, setFormState] = useState(formInit);
    const [prediosDatos, setPrediosData] = useState<proveedoresType[]>([])
    const [tiposFruta, setTiposFruta] = useState<string[]>([])
    useEffect(() => {
        obtenerTipoFruta()
        obtenerProveedores()
    }, [])
    useEffect(() => {
        if (props.loteSeleccionado !== undefined) {
            const formData = { ...formState }
            formData.enf = String(props.loteSeleccionado.documento.enf)
            formData.predio = String(props.loteSeleccionado.documento.predio?._id)
            formData.observaciones = String(props.loteSeleccionado.documento.observaciones)
            formData.placa = String(props.loteSeleccionado.documento.placa)
            formData.tipoFruta = String(props.loteSeleccionado.documento.tipoFruta)
            formData.fecha_estimada_llegada = String(props.loteSeleccionado.documento.fecha_estimada_llegada)
            formData.canastillas = String(props.loteSeleccionado.documento.canastillas)
            formData.kilos = String(props.loteSeleccionado.documento.kilos)
            setFormState(formData)
        }
    }, [props.loteSeleccionado])
    const obtenerProveedores = async (): Promise<void> => {
        try {
            const response = await window.api.server2(request_predios)
            if (response.status !== 200)
                throw new Error(response.message)
            setPrediosData(response.data)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const handleChange = (event): void => {
        const { name, value } = event.target;

        const uppercaseValue = name === 'placa' ? value.toUpperCase() : value;

        setFormState({
            ...formState,
            [name]: uppercaseValue,
        });
    };
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            const request = request_guardar_cambios(props.loteSeleccionado, formState)
            const response = await window.api.server2(request)

            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Datos modificados con exito")
            props.obtenerData()
            closeModal()
            setFormState(formInit)
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }

    }
    const closeModal = (): void => {
        const dialogSetting = document.getElementById("inventarios_ingresoFruta_modificar_historial_dialog") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    const obtenerTipoFruta = async (): Promise<void> => {
        try {
            const response = await window.api.obtenerFruta()
            setTiposFruta(response)
        } catch (err) {
            if (err instanceof Error)
                messageModal("error", `Error obteniendo la fruta ${err.message} `)
        }
    }

    return (
        <dialog id="inventarios_ingresoFruta_modificar_historial_dialog" className="dialog-modal">
            <div className="dialog-header">
                <h3>Modificar ingreso</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>

            <div className="dialog-body">
                <div className="form-field">
                    <label>EF1</label>
                    <input type="text" onChange={handleChange} name="enf" value={formState.enf} required />
                </div>
                <div className="form-field">
                    <label>Predios</label>
                    <select
                        className='defaultSelect'
                        onChange={handleChange}
                        required
                        value={formState.predio}
                        name='predio'>
                        <option value="">Predios</option>
                        {prediosDatos.map((item, index) => (
                            <option key={item.PREDIO && item.PREDIO + index} value={item._id}>{item.PREDIO}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label>Canastillas</label>
                    <input type="text" onChange={handleChange} name="kilos" value={formState.kilos} required />
                </div>
                <div className="form-field">
                    <label>Canastillas</label>
                    <input type="text" onChange={handleChange} name="canastillas" value={formState.canastillas} required />
                </div>
                <div className="form-field">
                    <label>Kilos</label>
                    <input type="text" onChange={handleChange} name="kilos" value={formState.kilos} required />
                </div>
                <div className="form-field">
                    <label>Tipo fruta</label>
                    <select
                        className='defaultSelect'
                        onChange={handleChange}
                        required
                        value={formState.tipoFruta}
                        name='tipoFruta'>
                        <option value=""></option>
                        {
                            tiposFruta.map(item => (
                                <option value={item} key={item}>{item}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="form-field">
                    <label>Observaciones</label>
                    <input type="text" onChange={handleChange} name="observaciones" value={formState.observaciones} required />
                </div>
                <div className="form-field">
                    <label>Placa</label>
                    <input type="text" onChange={handleChange} name="placa" value={formState.placa} required />
                </div>
                <div className="form-field">
                    <label>Fecha ingreso</label>
                    <input
                        type="date"
                        onChange={handleChange}
                        name="fecha_estimada_llegada"
                        value={formState.fecha_estimada_llegada.substring(0, 10)} required />
                </div>
            </div>
            <div className="dialog-footer">
                    <button className="default-button-agree" onClick={handleGuardar}>Guardar</button>
                    <button className="default-button-error" onClick={closeModal}>Cerrar</button>
                </div>


        </dialog>
    )
}