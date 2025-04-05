/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType"
import { useEffect, useState } from "react";
import { IoSaveSharp } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import useAppContext from "@renderer/hooks/useAppContext";
import { IoMdCloseCircle } from "react-icons/io";
import { formatearFecha } from "@renderer/functions/fechas";
import { MdEditDocument } from "react-icons/md";
import { clienteType } from "@renderer/types/clientesType";

type propsType = {
    contenedor: contenedoresType | undefined
    closeModal: () => void
    clientes: clienteType[] | undefined
}
const ids = ["66b6707777549ed0672a9029", "66db296f3d43194ad7a7f2b2", "66e06dff4440112c276a5bbb"]

export default function ModalInfoContenedor(props: propsType): JSX.Element {
    const { messageModal, seleccionWindow } = useAppContext();
    const [modificando, setModificando] = useState<boolean>(false);
    const [modificandoObservaciones, setModificandoObservaciones] = useState<boolean>(false)
    const [modificandoCLiente, setModificandoCliente] = useState<boolean>(false)
    const [tipoFruta, setTipoFruta] = useState<string>('')
    const [tipoCaja, setTipoCaja] = useState<string>('')
    const [calibres, setCalibres] = useState<string>('')
    const [calidad, setCalidad] = useState<string>('')
    const [observaciones, setObservaciones] = useState<string>('')
    const [numeroContenedor, setNumeroContenedor] = useState<string>('')
    const [cliente, setCliente] = useState<string>('')

    useEffect(() => {
        if (props.contenedor !== undefined) {
            setTipoFruta(props.contenedor?.infoContenedor.tipoFruta);
            setObservaciones(props.contenedor.infoContenedor.observaciones);
            setNumeroContenedor(String(props.contenedor.numeroContenedor));
            setTipoCaja(props.contenedor?.infoContenedor.tipoCaja.reduce((acu, item) => acu += item + " , ", ''));
            setCalibres(props.contenedor?.infoContenedor.calibres.reduce((acu, item) => acu += item + " , ", ''));
            setCalidad(props.contenedor?.infoContenedor.calidad.reduce((acu, item) => acu += item + " , ", ''));

            if (typeof props.contenedor.infoContenedor.clienteInfo === 'object' ) 
                setCliente(props.contenedor.infoContenedor.clienteInfo._id)



        }
    }, [props.contenedor])
    const modificar = (): void => {
        setModificando(!modificando)
    }
    const modificarObservaciones = (): void => {
        setModificandoObservaciones(!modificandoObservaciones)
    }
    const modificarCliente = (): void => {
        setModificandoCliente(!modificandoCLiente)
    }

    const guardarCambiosInfoProceso = async (): Promise<void> => {
        try {
            //se crean los arreglos
            const stringTipoCaja = tipoCaja.replace(/\s+/g, "");
            const stringCalidad = calidad.replace(/\s+/g, "");
            const stringCalibres = calibres.replace(/\s+/g, "");
            const arrTipoCaja = stringTipoCaja.split(",")
            const arrCalidad = stringCalidad.split(",")
            const arrCalibres = stringCalibres.split(",")

            if (arrTipoCaja[arrTipoCaja.length - 1] === '') {
                arrTipoCaja.pop()
            }
            if (arrCalidad[arrCalidad.length - 1] === '') {
                arrCalidad.pop()
            }
            if (arrCalibres[arrCalibres.length - 1] === '') {
                arrCalibres.pop()
            }
            const request = {
                action: "put_inventarios_programacion_contenedores",
                _id: props.contenedor?._id,
                __v: props.contenedor?.__v,
                infoContenedor: {
                    "infoContenedor.tipoFruta": tipoFruta,
                    "infoContenedor.tipoCaja": arrTipoCaja,
                    "infoContenedor.calidad": arrCalidad,
                    "infoContenedor.calibres": arrCalibres
                }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Datos modificado con exito");

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            modificar()
        }
    }
    const guardarCambiosObservaciones = async (): Promise<void> => {
        try {
            const request = {
                action: "put_inventarios_programacion_contenedores",
                _id: props.contenedor?._id,
                __v: props.contenedor?.__v,
                infoContenedor: {
                    "infoContenedor.observaciones": observaciones,
                }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Datos modificado con exito");
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            modificarObservaciones()
        }
    }
    const guardarCambiosNumeroConedorCliente = async (): Promise<void> => {
        try {
            const request = {
                action: "put_inventarios_programacion_contenedores",
                _id: props.contenedor?._id,
                __v: props.contenedor?.__v,
                infoContenedor: {
                    numeroContenedor: numeroContenedor,
                    "infoContenedor.clienteInfo": cliente
                }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Datos modificado con exito");
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        } finally {
            modificarCliente()
        }
    }
    if (props.contenedor === undefined) {
        return (
            <div>No hay informacion del contenedor</div>
        )
    }
    const handleVentana = (id, name): void => {
        seleccionWindow(id, name)
        props.closeModal()

        if (ids.includes(id)) {
            localStorage.setItem("inventario-lista-insumos-contenedor", props.contenedor?._id ? props.contenedor?._id : '')
        }
        if (ids.includes(id)) {
            localStorage.setItem("proceso-listaempaque-id-contenedor", props.contenedor?._id ? props.contenedor?._id : '')
        }
        if (ids.includes(id)) {
            localStorage.setItem("proceso-historial-listaempaque-id-contenedor", props.contenedor?._id ? props.contenedor?._id : '')
        }
    }
    return (
        <div className="fondo-modal">
            <div className="modal-container">
                <div className='modal-header-agree'>


                    <div >
                        {modificandoCLiente ?
                            <div className='modal-header-agree-change-numero-cliente'>
                                <input
                                    onChange={(e): void => setNumeroContenedor(e.target.value)}
                                    type="text"
                                    value={numeroContenedor} />
                                <select onChange={(e): void => setCliente(e.target.value)} value={cliente}>
                                    <option>
                                        Cliente
                                    </option>
                                    {props.clientes && props.clientes.map(item => (
                                        <option value={item._id} key={item._id}>
                                            {item.CLIENTE}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            :
                            <h2>
                                {props.contenedor.numeroContenedor + " - " +
                                    (typeof props.contenedor.infoContenedor.clienteInfo === "object" ?
                                        props.contenedor.infoContenedor.clienteInfo.CLIENTE : "")}
                            </h2>
                        }
                    </div>
                    <section>
                        {!modificandoCLiente && <button onClick={modificarCliente}><MdEditDocument color="blue" /></button>}
                        {modificandoCLiente && <button onClick={guardarCambiosNumeroConedorCliente} style={{ color: 'green' }}><IoSaveSharp /></button>}
                        {modificandoCLiente && <button onClick={modificarCliente} style={{ color: 'red' }}><GiCancel /></button>}
                    </section>
                </div>
                <div></div>
                <div className="modal-container-body-contenedor">
                    <div className='modal-container-body-contenedor-info'>
                        {/* Fechas */}
                        <div className="modal-container-body-contenedor-info-fechas">
                            <h3>Fechas</h3>
                            <div >
                                <h4>Fecha Creación:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.fechaCreacion ?
                                        formatearFecha(props.contenedor.infoContenedor.fechaCreacion, true) : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Fecha Inicio:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.fechaInicio ?
                                        formatearFecha(props.contenedor.infoContenedor.fechaInicio) : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Fecha Estimada de cargue:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.fechaEstimadaCargue ?
                                        formatearFecha(props.contenedor.infoContenedor.fechaEstimadaCargue) : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Fecha Finalizado:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.fechaFinalizado ?
                                        formatearFecha(props.contenedor.infoContenedor.fechaFinalizado, true) : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Fecha Salida:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.fechaSalida ?
                                        formatearFecha(props.contenedor.infoContenedor.fechaSalida) : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Ultima modificación:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.ultimaModificacion ?
                                        formatearFecha(props.contenedor.infoContenedor.ultimaModificacion) : ""}
                                </h5>
                            </div>
                        </div>
                        {/* observaciones */}
                        <div className="modal-container-body-contenedor-info-observaciones">
                            <h3>Observaciones</h3>
                            <div >
                                {modificandoObservaciones ?
                                    <textarea
                                        value={observaciones}
                                        onChange={(e): void => setObservaciones(e.target.value)} />
                                    :
                                    <h5>{observaciones}</h5>}

                            </div>
                            <section>
                                {!modificandoObservaciones && <button onClick={modificarObservaciones}><MdEditDocument /></button>}
                                {modificandoObservaciones && <button onClick={guardarCambiosObservaciones} style={{ color: 'green' }}><IoSaveSharp /></button>}
                                {modificandoObservaciones && <button onClick={modificarObservaciones} style={{ color: 'red' }}><GiCancel /></button>}
                            </section>
                        </div>
                        {/* Info proceso */}
                        <div className="modal-container-body-contenedor-info-fechas">
                            <h3>Info. Proceso</h3>
                            <div>
                                <h4>Tipo fruta:</h4>
                                {modificando ?
                                    <input type="text" value={tipoFruta} onChange={(e): void => setTipoFruta(e.target.value)} />
                                    :
                                    <h5>{tipoFruta}</h5>
                                }
                            </div>
                            <div >
                                <h4>Tipo Caja:</h4>
                                {modificando ?
                                    <input type="text" value={tipoCaja} onChange={(e): void => setTipoCaja(e.target.value)} />
                                    :
                                    <h5>{tipoCaja}</h5>}

                            </div>
                            <div >
                                <h4>Calibres:</h4>
                                {modificando ?
                                    <input type="text" value={calibres} onChange={(e): void => setCalibres(e.target.value)} />
                                    :
                                    <h5>{calibres}</h5>}
                            </div>
                            <div >
                                <h4>Calidad:</h4>
                                {modificando ?
                                    <input type="text" value={calidad} onChange={(e): void => setCalidad(e.target.value)} />
                                    :
                                    <h5>{calidad}</h5>}
                            </div>
                            <section>
                                {!modificando && <button onClick={modificar}><MdEditDocument /></button>}
                                {modificando && <button onClick={guardarCambiosInfoProceso} style={{ color: 'green' }}><IoSaveSharp /></button>}
                                {modificando && <button onClick={modificar} style={{ color: 'red' }}><GiCancel /></button>}
                            </section>
                        </div>
                        {/* Info extra */}
                        <div className="modal-container-body-contenedor-info-fechas">
                            <h3>Info. Extra</h3>
                            <div>
                                <h4>Sombra:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.sombra ?
                                        props.contenedor.infoContenedor.sombra : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Defecto:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.defecto ?
                                        props.contenedor.infoContenedor.defecto : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Mancha:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.mancha ?
                                        props.contenedor.infoContenedor.mancha : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Verde manzana:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.verdeManzana ?
                                        props.contenedor.infoContenedor.verdeManzana : ""}
                                </h5>
                            </div>
                            <div>
                                <h4>Desverdizado:</h4>
                                <h5>
                                    {props.contenedor.infoContenedor.desverdizado ?
                                        "Desverdizado" : "N/A"}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-container-buttons">
                    {props.contenedor.infoContenedor.fechaFinalizado !== null &&
                        <button onClick={(): void => handleVentana("66db296f3d43194ad7a7f2b2", "Ingreso insumos contenedor")} className='defaulButtonAgree'>Insumos</button>}
                    {props.contenedor.infoContenedor.fechaFinalizado === null &&
                        <button onClick={(): void => handleVentana("66b6707777549ed0672a9029", "Lista de empaque")} className='defaulButtonAgree'>
                            Lista de empaque
                        </button>}
                    {props.contenedor.infoContenedor.fechaFinalizado !== null && props.contenedor.infoContenedor.fechaInicioReal &&
                        <button onClick={(): void => handleVentana("66e06dff4440112c276a5bbb", "Listas de empaque")} className='defaulButtonAgree'>
                            Lista de empaque
                        </button>}
                </div>
                <button onClick={props.closeModal} className="modal-container-close-button">

                    <IoMdCloseCircle />

                </button>
            </div>
        </div>
    )
}
