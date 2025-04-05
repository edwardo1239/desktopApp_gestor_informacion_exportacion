/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";
import useAppContext from "@renderer/hooks/useAppContext";
import { frutaType, proveedoresType } from "@renderer/types/proveedoresType";
import ComponenetTipoFruta from "./ComponenetTipoFruta";

export type formStateType = {
    "CODIGO INTERNO"?: string
    PREDIO?: string
    SISPAP?: boolean
    activo?: boolean
    "ICA.code"?: string
    "ICA.tipo_fruta"?: string[]
    "ICA.fechaVencimiento"?: string
    "GGN.code"?: string
    "GGN.fechaVencimiento"?: string
    "GGN.tipo_fruta"?: string[]
    "GGN.paises"?: string[]
    nit_facturar?: string
    razon_social?: string
    propietario?: string
    telefono_propietario?: string
    correo_informes?: string
    contacto_finca?: string
    telefono_predio?: string
    departamento?: string,
    municipio?: string,
}



type propsType = {
    proveedor: proveedoresType | undefined
    setProveedor: (e) => void
    handleObtenerData: () => void
}

export default function ModalProveedores(props: propsType): JSX.Element {
    const { messageModal, user, setLoading } = useAppContext();
    const [tipoFrutas, setTipoFrutas] = useState<string[]>()
    const [paisesExp, setPaisesExp] = useState<string[]>()

    const [fruta, setFruta] = useState<frutaType>({})
    const [frutaState, setFrutaState] = useState<string>('')
    const [hectareasState, setHectareasState] = useState<string>('')
    const [arbolesState, setArbolesState] = useState<string>('')
    const [formState, setFormState] = useState<formStateType>()

    useEffect(() => {
        const fecthData = async (): Promise<void> => {
            try {
                setLoading(true)
                await obtenerTipoFruta()
                await obtenerPaisesExpGGN()
            } catch (err) {
                if (err instanceof Error) {
                    messageModal("error", err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        fecthData()

    }, [])

    //carga los datos del proveedor si se esta modificando
    useEffect(() => {
        if (props.proveedor !== undefined) {
            const newForm: formStateType = {}

            newForm["CODIGO INTERNO"] = String(props.proveedor["CODIGO INTERNO"]) ?? '';
            newForm.PREDIO = props.proveedor.PREDIO ?? '';
            newForm["ICA.code"] = props.proveedor.ICA.code ?? '';
            newForm["ICA.tipo_fruta"] = props.proveedor.ICA.tipo_fruta ?? '';
            newForm["ICA.fechaVencimiento"] = props.proveedor.ICA.fechaVencimiento ?? '';
            newForm.nit_facturar = props.proveedor.nit_facturar ?? '';
            newForm.razon_social = props.proveedor.razon_social ?? '';
            newForm.propietario = props.proveedor.propietario ?? '';
            newForm.telefono_propietario = props.proveedor.telefono_propietario ?? '';
            newForm.correo_informes = props.proveedor.correo_informes ?? '';
            newForm.contacto_finca = props.proveedor.contacto_finca ?? '';
            newForm.telefono_predio = props.proveedor.telefono_predio ?? '';
            newForm.activo = props.proveedor.activo ?? false;
            newForm.SISPAP = props.proveedor.SISPAP ?? false;
            newForm.departamento = props.proveedor.departamento ?? '';
            newForm.municipio = props.proveedor.municipio ?? '';
            
            if (props.proveedor.GGN && props.proveedor.GGN.code) {
                newForm["GGN.code"] = props.proveedor.GGN.code;
                newForm["GGN.fechaVencimiento"] = props.proveedor.GGN.fechaVencimiento ?? '';
                newForm["GGN.tipo_fruta"] = props.proveedor.GGN.tipo_fruta ?? '';
                newForm["GGN.paises"] = props.proveedor.GGN.paises ?? '';
            }
            setFormState(newForm)

            setFruta(props.proveedor.tipo_fruta)
        }
    }, [props.proveedor])

    const obtenerTipoFruta = async (): Promise<void> => {
        const request = {
            action: "get_constantes_sistema_tipo_frutas"
        }
        const response = await window.api.server2(request);
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setTipoFrutas(response.data)
    }
    const obtenerPaisesExpGGN = async (): Promise<void> => {
        const request = {
            action: "get_constantes_sistema_paises_GGN"
        }
        const response = await window.api.server2(request);
        if (response.status !== 200) {
            throw new Error(`Code ${response.status}: ${response.message}`)
        }
        setPaisesExp(response.data)
    }


    const closeModal = (): void => {
        if (props.proveedor !== undefined) {
            props.setProveedor(undefined)
            setFormState(undefined)
            setFruta({})
        }
        const dialogSetting = document.getElementById("ingresar_proveedor_modal") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }
    const reiniciar = (): void => {
        setFormState(undefined)
        setFruta({})
        setFrutaState('')
        setHectareasState('')
        setArbolesState('')
    }
    const handleTipoFruta = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        if (!formState?.[e.target.name]) {
            handleChange(e.target.name, [e.target.value])
        } else {
            if (formState[e.target.name].includes(e.target.value)) {
                const newFilter = formState[e.target.name].filter(item => item !== e.target.value)
                console.log(newFilter)
                handleChange(e.target.name, newFilter)
            } else {
                handleChange(e.target.name, [...formState[e.target.name], e.target.value])
            }
        }
    }
    const handleAddFruta = (): void => {
        let copy
        if (!(fruta === undefined)) {
            copy = JSON.parse(JSON.stringify(fruta));
            copy[frutaState] = {
                Arboles: Number(arbolesState),
                Hectareas: Number(hectareasState)
            }
            setFruta(copy)

        } else {
            setFruta({})
        }
        setFrutaState('')
        setHectareasState('')
        setArbolesState('')

    }
    const handleCancelar = (e): void => {
        const copy = JSON.parse(JSON.stringify(fruta));
        delete copy[e]
        setFruta(copy)

    }
    const handleChange = (name, data): void => {
        setFormState({
            ...formState,
            [name]: data,
        });
    };

    const handleGuardar = async (): Promise<void> => {
        try {
            setLoading(true)
            const data = {
                ...formState,
                tipo_fruta: fruta,
            }
            let request;

            if (props.proveedor) {
                request = {

                    action: "put_comercial_proveedores_modify_proveedor",
                    _id: props.proveedor._id,
                    data: data
                }
            } else {
                request = {
                    action: "post_comercial_proveedores_add_proveedor",
                    data: data
                }
            }

            const response = await window.api.server2(request);
            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`)
            }
            messageModal("success", "Proveedor agregado con exito")
            reiniciar()
            props.handleObtenerData()
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            setLoading(false)
            closeModal()
        }
    }
    if (!user) {
        return (
            <div>Inicie sesion!</div>
        )
    }
    return (
        <dialog id="ingresar_proveedor_modal" className="dialog-modal">
            <div className="dialog-header">
                <h3>Ingresar Proveedor</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>
            <div className="dialog-body">
                <div className="form-field">
                    <label>Código del predio</label>
                    <input
                        data-testid="comercial-proveedores-codigo-predio-input"
                        name="CODIGO INTERNO"
                        value={formState?.["CODIGO INTERNO"] ?? ''}
                        type="text"
                        placeholder="Ingresa el código del predio"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}
                    />
                </div>
                <div className="form-field">
                    <label>Predio</label>
                    <input
                        data-testid="comercial-proveedores-predio-predio-input"
                        name="PREDIO"
                        value={formState?.PREDIO ?? ''}
                        type="text"
                        placeholder="Ingresa el nombre del predio"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}
                    />
                </div>
                {user?.rol < 2 &&
                    <>
                        <div className="form-field">
                            <label>SISPAP</label>
                            <input
                                data-testid="comercial-proveedores-predio-sispap-input"
                                name="SISPAP"
                                checked={formState?.SISPAP}
                                type="checkbox"
                                onChange={(e): void => handleChange(e.target.name, e.target.checked)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label>Activo</label>
                            <input
                                data-testid="comercial-proveedores-predio-activo-input"
                                name="activo"
                                checked={formState?.activo}
                                type="checkbox"
                                onChange={(e): void => handleChange(e.target.name, e.target.checked)}
                                disabled={user?.rol > 2}
                            />
                        </div></>
                }
                <div className="form-field">
                    <label>ICA</label>
                    <input
                        data-testid="comercial-proveedores-predio-ica-input"
                        name="ICA.code"
                        value={formState?.["ICA.code"] ?? ''}
                        type="text"
                        placeholder="Ingresa el ICA del predio"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}
                    />
                </div>
                <div className="form-field">
                    <label>Fecha de vencimiento ICA</label>
                    <input
                        data-testid="comercial-proveedores-predio-fecha-ica-input"
                        name="ICA.fechaVencimiento"
                        value={
                            formState?.["ICA.fechaVencimiento"]
                                ? formState["ICA.fechaVencimiento"].substring(0, 10)
                                : ''
                        }
                        type="date"
                        placeholder="Ingresa la fecha de vencimiento del ICA"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}

                    />
                </div>
                <div className="form-field">
                    <label>Tipo de fruta ICA</label>
                    <ComponenetTipoFruta
                        nombre="ICA.tipo_fruta"
                        proveedor={props.proveedor}
                        arreglo={tipoFrutas}
                        valor={formState?.["ICA.tipo_fruta"]}
                        handleTipoFruta={handleTipoFruta} />
                </div>
                <div className="form-field">
                    <label>GGN</label>
                    <input
                        data-testid="comercial-proveedores-predio-ggn-input"
                        name="GGN.code"
                        value={formState?.["GGN.code"] ?? ''}
                        type="text"
                        placeholder="Ingresa el código GGN"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}
                    />
                </div>

                <div className="form-field">
                    <label >Fecha de vencimiento GGN</label>
                    <input
                        name="GGN.fechaVencimiento"
                        data-testid="comercial-proveedores-predio-fecha-ggn-input"
                        value={
                            formState?.["GGN.fechaVencimiento"]
                                ? formState["GGN.fechaVencimiento"].substring(0, 10)
                                : ''
                        }
                        type="date"
                        placeholder="Ingresa la fecha de vencimiento del GGN"
                        onChange={(e): void => handleChange(e.target.name, e.target.value)}
                        disabled={user?.rol > 2}

                    />
                </div>
                <div className="form-field">
                    <label >Tipo de fruta GGN</label>
                    <ComponenetTipoFruta
                        nombre={"GGN.tipo_fruta"}
                        proveedor={props.proveedor}
                        arreglo={tipoFrutas}
                        valor={formState?.["GGN.tipo_fruta"]}
                        handleTipoFruta={handleTipoFruta} />
                </div>
                <div className="form-field">
                    <label >Paises GGN</label>
                    <ComponenetTipoFruta
                        nombre={"GGN.paises"}
                        proveedor={props.proveedor}
                        arreglo={paisesExp}
                        valor={formState?.["GGN.paises"]}
                        handleTipoFruta={handleTipoFruta} />
                </div>
                {user?.rol < 3 &&
                    <>
                        <div className="form-field">
                            <label >NIT</label>
                            <input
                                data-testid="comercial-proveedores-predio-nit-input"
                                name="nit_facturar"
                                value={formState?.nit_facturar ?? ''}
                                type="text"
                                placeholder="Ingresa el NIT del predio"
                                disabled={user?.rol > 2}
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label >Razón social</label>
                            <input
                                data-testid="comercial-proveedores-predio-razon-input"
                                name="razon_social"
                                value={formState?.razon_social ?? ''}
                                type="text"
                                placeholder="Ingresa la razon social"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Propietario</label>
                            <input
                                data-testid="comercial-proveedores-predio-propietario-input"
                                name="propietario"
                                value={formState?.propietario ?? ''}
                                type="text"
                                placeholder="Ingresa el propietario"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Telefono propietario</label>
                            <input
                                data-testid="comercial-proveedores-predio-telefonop-input"
                                name="telefono_propietario"
                                value={formState?.telefono_propietario ?? ''}
                                type="text"
                                placeholder="Ingresa el numero del propietario"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Correo</label>
                            <input
                                data-testid="comercial-proveedores-predio-correo-input"
                                name="correo_informes"
                                value={formState?.correo_informes ?? ''}
                                type="email"
                                placeholder="Ingresa el correo al que se envía los informes"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Contacto finca</label>
                            <input
                                data-testid="comercial-proveedores-predio-contacto-input"
                                name="contacto_finca"
                                value={formState?.contacto_finca ?? ''}
                                type="text"
                                placeholder="Ingresa el contacto de la finca"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Telefono predio</label>
                            <input
                                data-testid="comercial-proveedores-predio-telefono-input"
                                name="telefono_predio"
                                value={formState?.telefono_predio ?? ''}
                                type="text"
                                placeholder="Ingresa el telefono del predio"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>
                        <div className="form-field">
                            <label >Municipio</label>
                            <input
                                data-testid="comercial-proveedores-predio-telefono-input"
                                name="municipio"
                                value={formState?.municipio ?? ''}
                                type="text"
                                placeholder="Ingresa el municipio"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>

                        <div className="form-field">
                            <label >Departamento</label>
                            <input
                                data-testid="comercial-proveedores-predio-telefono-input"
                                name="departamento"
                                value={formState?.departamento ?? ''}
                                type="text"
                                placeholder="Ingresa el departamento"
                                onChange={(e): void => handleChange(e.target.name, e.target.value)}
                                disabled={user?.rol > 2}
                            />
                        </div>

                        <div className="items-container">
                            {fruta && Object.keys(fruta).map((fruit, index) => (
                                <div className="item" key={index}>
                                    <div className="item-header">{fruit}</div>
                                    <div className="item-body">
                                        <h4 data-testid={`comercial-proveedores-predio-fruta_arboles-${index}`}>
                                            Hectareas: {fruta[fruit] && fruta[fruit].Hectareas}
                                        </h4>
                                        <h4 data-testid={`comercial-proveedores-predio-fruta-hecatareas-${index}`}>
                                            Arboles: {fruta[fruit] && fruta[fruit].Arboles}
                                        </h4>

                                    </div>
                                    <div className="item-footer">
                                        <button
                                            data-testid={`comercial-proveedores-predio-cancelar-${index}`}
                                            className="cancel"
                                            onClick={(): void => handleCancelar(fruit)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {user?.rol < 2 &&
                                <div className="item" data-testid="comercial-proveedores-predio-fruta-input">
                                    <div className="item-header">Fruta {fruta && Object.keys(fruta).length + 1}</div>
                                    <div className="item-body">
                                        <select
                                            data-testid="comercial-proveedores-predio-fruta-seleccion-tipo"
                                            value={frutaState}
                                            onChange={(e): void => setFrutaState(e.target.value)}

                                        >
                                            <option value="">Seleccione fruta</option>

                                            {tipoFrutas ? tipoFrutas.map(item => (
                                                <option value={item} key={item}>{item}</option>
                                            ))
                                                :
                                                <option value="">Cargando...</option>
                                            }
                                        </select>

                                        <input
                                            value={hectareasState}
                                            type="text"
                                            placeholder="Hectareas"
                                            onChange={(e): void => setHectareasState(e.target.value)}
                                        />
                                        <input
                                            value={arbolesState}
                                            type="text"
                                            placeholder="Arboles"
                                            onChange={(e): void => setArbolesState(e.target.value)}
                                        />
                                    </div>
                                    <div className="item-footer">
                                        <button onClick={handleAddFruta}>Aceptar</button>
                                    </div>
                                </div>}

                        </div>
                    </>
                }
                <div className="dialog-footer">
                    <button className="default-button-agree" onClick={handleGuardar}>Guardar</button>
                    <button className="default-button-error" onClick={closeModal}>Cerrar</button>
                </div>
            </div>

        </dialog>
    )
}