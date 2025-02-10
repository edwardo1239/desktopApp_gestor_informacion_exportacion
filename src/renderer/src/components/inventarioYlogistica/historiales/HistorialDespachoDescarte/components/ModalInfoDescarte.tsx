/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType"
import { labels } from "../functions/datos"

type propsType = {
    data: lotesType[] | undefined
    handleModal: () => void
}

export default function ModalInfoDescartes(props: propsType): JSX.Element {
    if (props.data === undefined) {
        return (
            <div>No hay datos disponibles</div>
        )
    }
    return (
        <div className="fondo-modal">
            <div className={`modal-container`}>
                <div className='modal-header-agree'>
                    <h2>
                        Resumen del descarte
                    </h2>
                </div>
                <div className='modal-container-body-resumen-despacho'>
                    {props.data.map(lote => (
                        <div key={lote._id}>
                            <div>
                                <p>{lote.enf}</p>
                                <p>{lote.predio.PREDIO}</p>
                            </div>
                            <hr />
                            <h3>Descarte Lavado:</h3>
                            <div className="modal-container-body-resumen-despacho-descarte">
                                {lote.descarteLavado && Object.keys(lote.descarteLavado).map(descarte => (
                                    <div key={lote._id + descarte} >
                                        <p>
                                            {labels[descarte]}:
                                            {lote.descarteLavado && lote.descarteLavado[descarte]} Kg
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <h3>Descarte Encerado:</h3>
                            <div className="modal-container-body-resumen-despacho-descarte">
                                {lote.descarteEncerado && Object.keys(lote.descarteEncerado).map(descarte => (
                                    <div key={lote._id + descarte} >
                                        <p>
                                            {labels[descarte]}:
                                            {lote.descarteEncerado && lote.descarteEncerado[descarte]} Kg
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-container-buttons">
                    <button className='cancel' onClick={props.handleModal}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}
