/* eslint-disable prettier/prettier */
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { headers } from "../functions/constants";
import { lotesType } from "@renderer/types/lotesType";
import { FcCancel } from 'react-icons/fc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { GrDocumentExcel } from "react-icons/gr";

type propsType = {
    datosFiltrados: lotesType[]
    handleAccederDocumento: (data: lotesType) => void
}
export default function TablaInformeCalidad(props: propsType): JSX.Element {
    return (
        <div className="table-container">

            <table className="table-main">
                <thead>
                    <tr>
                        {headers.map(item => (
                            <th key={item}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.datosFiltrados.map((item, index) => (
                        <tr className={`${index % 2 === 0 ? 'fondo-par' : 'fondo-impar'}`} key={index}>
                            <td>
                                {item.enf}
                            </td>
                            <td>{item.predio && item.predio.PREDIO}</td>
                            <td>{item.tipoFruta}</td>
                            <td>{format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}</td>
                            <td>
                                <div>
                                    {item.calidad && Object.prototype.hasOwnProperty.call(item.calidad, 'calidadInterna') ?
                                        format(item.calidad.calidadInterna?.fecha ? new Date(item.calidad.calidadInterna?.fecha) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es }) : <FcCancel />}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {item.calidad && Object.prototype.hasOwnProperty.call(item.calidad, 'clasificacionCalidad') ?
                                        format(item.calidad.clasificacionCalidad?.fecha ? new Date(item.calidad.clasificacionCalidad?.fecha) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es }) : <FcCancel />}
                                </div>
                            </td>
                            <td >
                                <div >
                                    {item.calidad && Object.prototype.hasOwnProperty.call(item.calidad, 'fotosCalidad') ?
                                        format(item.calidad.fotosCalidad?.fechaIngreso ? new Date(item.calidad.fotosCalidad?.fechaIngreso) : new Date(), 'dd/MM/yyyy HH:mm', { locale: es })
                                        : <FcCancel />}
                                </div>
                            </td>
                            <td >
                                <div>
                                    {typeof item.deshidratacion === "number" && item.deshidratacion.toFixed(2)}%
                                </div>
                            </td>
                            <td >
                                {item.calidad && Object.prototype.hasOwnProperty.call(item.calidad, 'calidadInterna') &&
                                    Object.prototype.hasOwnProperty.call(item.calidad, 'clasificacionCalidad') &&
                                    Object.prototype.hasOwnProperty.call(item.calidad, 'fotosCalidad') &&
                                    item.deshidratacion && item.deshidratacion <= 3 && item.deshidratacion >= -1 ?
                                    <button
                                        onClick={(): void => props.handleAccederDocumento(item)}>
                                        <FontAwesomeIcon icon={faFileAlt} />
                                    </button>
                                    :
                                    <div
                                        onClick={(): void => props.handleAccederDocumento(item)}
                                        className="table-main-noDocument">
                                        <GrDocumentExcel />
                                    </div>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}