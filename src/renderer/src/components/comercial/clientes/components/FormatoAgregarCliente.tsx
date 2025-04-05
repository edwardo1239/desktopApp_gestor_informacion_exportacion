/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import { clienteType } from "@renderer/types/clientesType";
import { clienteDefault } from "../functions/functions";
import useAppContext from "@renderer/hooks/useAppContext";
import CountrySelector from "@renderer/components/UI/SelectCountryes";

type propsType = {
    modificar: boolean
    handleChange: () => void
    cliente: clienteType | undefined
    obtenerClientes: () => void
}

export default function FormatoAgregarCliente(props: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext()
    const [pais, setPais] = useState<string>()
    const [formState, setFormState] = useState<clienteType>(clienteDefault);
    useEffect(() => {
        data_cliente()
    }, [props.modificar])
    const data_cliente = (): void => {
        if (props.modificar && props.cliente !== undefined) {
            const formData = { ...formState };
            formData.CODIGO = Number(props.cliente?.CODIGO)
            formData.CLIENTE = String(props.cliente?.CLIENTE)
            formData.CORREO = String(props.cliente?.CORREO)
            formData.DIRECCIÓN = String(props.cliente?.DIRECCIÓN)
            formData.PAIS_DESTINO = props.cliente?.PAIS_DESTINO
            formData.TELEFONO = String(props.cliente?.TELEFONO)
            formData.ID = String(props.cliente?.ID)
            setFormState(formData)
        } else {
            const formData = { ...formState };
            formData.CODIGO = 0
            formData.CLIENTE = ""
            formData.CORREO = ""
            formData.DIRECCIÓN = ""
            formData.PAIS_DESTINO = []
            formData.TELEFONO = ""
            formData.ID = ""
            setFormState(formData)
        }

    }
    const handleChange = (event): void => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };
    const handleGuardar = async (e): Promise<void> => {
        e.preventDefault()

        try {
            const request = {
                action: 'post_comercial_clientes',
                data: formState
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Cliente guardado con exito")
            props.handleChange()
            props.obtenerClientes()
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        }
    }
    const handleModificar = async (e): Promise<void> => {
        e.preventDefault()
        try {
            setLoading(true)
            const request = {
                action: 'put_comercial_clientes',
                data: formState,
                _id: props.cliente?._id
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(response.message)
            messageModal("success", "Cliente modificado con exito")
            props.handleChange()
            props.obtenerClientes()
        } catch (e) {
            if (e instanceof Error)
                messageModal("error", e.message)
        } finally {
            setLoading(false)
        }
    }
    const eliminarPais = (e: string): void => {
        const newData = formState.PAIS_DESTINO.filter(item => item !== e)
        setFormState({
            ...formState,
            PAIS_DESTINO:newData
        })
    }
    const addPais = (): void => {
        if (pais !== undefined) {
            const paisesSet = new Set(formState.PAIS_DESTINO)
            const paisesArr = [...paisesSet, pais]
            setFormState({
                ...formState,
                PAIS_DESTINO: paisesArr
            })
        }
    }
    return (
        <div className='componentContainer'>
            <h2>{props.modificar ? "Modificar Cliente" : "Agregar Cliente"}</h2>
            <form className='form-container'>
                <div>
                    <label>Codigo</label>
                    <input type="text" onChange={handleChange} name="CODIGO" value={formState.CODIGO} required />
                </div>
                <div>
                    <label>Cliente</label>
                    <input type="text" onChange={handleChange} name="CLIENTE" value={formState.CLIENTE} required />
                </div>
                <div>
                    <label>Correo</label>
                    <input type="email" onChange={handleChange} name="CORREO" value={formState.CORREO} required />
                </div>
                <div>
                    <label>Dirección</label>
                    <input type="text" onChange={handleChange} name="DIRECCIÓN" value={formState.DIRECCIÓN} required />
                </div>
                <div>
                    <label>Paises</label>
                    <CountrySelector setCountry={setPais} />
                    <button type="button" onClick={addPais}>+</button>
                    <div className="paises-div-crear-proveedor">
                        {typeof formState.PAIS_DESTINO === "object" ? formState.PAIS_DESTINO.map(pais => (
                            <button 
                                title={pais}
                                onClick={(): void => eliminarPais(pais)} 
                                type="button" key={pais}>
                                {pais}
                            </button>
                        )) : formState.PAIS_DESTINO}</div>
                </div>
                <div>
                    <label>Telefono</label>
                    <input type="text" onChange={handleChange} name="TELEFONO" value={formState.TELEFONO} required />
                </div>
                <div>
                    <label>ID</label>
                    <input type="text" onChange={handleChange} name="ID" value={formState.ID} required />
                </div>
                <div className='defaultSelect-button-div'>
                    {props.modificar ?
                        <button className="defaulButtonAgree" onClick={handleModificar}>Modificar</button>
                        :
                        <button className="defaulButtonAgree" onClick={handleGuardar}>Guardar</button>
                    }
                </div>
            </form>
        </div>
    )
}
