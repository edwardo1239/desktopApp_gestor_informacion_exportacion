/* eslint-disable prettier/prettier */

import { formatearFecha } from "@renderer/functions/fechas";
import useAppContext from "@renderer/hooks/useAppContext";
import { contenedoresType } from "@renderer/types/contenedoresType"

type propsType = {
    data: contenedoresType
}

export default function ModalInfoReclamacion(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const closeModal = (): void => {

        const dialogSetting = document.getElementById("comercial_fomrularios_reclamacionCalidad") as HTMLDialogElement;
        if (dialogSetting) {
            dialogSetting.close();
        }
    }

    const handleDescargarDocumento = async (path: string): Promise<void> => {
        try {
            const request = {
                action: "get_comercial_formularios_reclamacionCalidad_archivo",
                path: path,
            };
            const response = await window.api.server2(request);

            if (response.status !== 200) {
                throw new Error(`Code ${response.status}: ${response.message}`);
            }

            // Asegúrate de que la respuesta tenga los campos esperados
            const { mimeType, documento: base64String, nombre } = response.data;
            // "nombre" podría ser el nombre sugerido de tu archivo si lo proporcionas desde el servidor.

            // 1. Decodifica Base64 a binario
            const byteCharacters = atob(base64String); // decodifica base64
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // 2. Crea un Blob con el MIME type que llega del servidor
            const blob = new Blob([byteArray], { type: mimeType || "application/octet-stream" });

            // 3. Genera la URL temporal para descargar
            const url = window.URL.createObjectURL(blob);

            // 4. Crea un enlace que fuerce la descarga
            const link = document.createElement("a");
            link.href = url;

            // Nombre del archivo (si te llega alguno desde el servidor, úsalo):
            link.download = nombre || "archivoDescargado";

            // Dispara el evento de click para descargar
            link.click();

            // Limpia memoria
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        }
    };


    return (
        <dialog id="comercial_fomrularios_reclamacionCalidad" className="dialog-modal">
            <div className="dialog-header">
                <h3>Detalle del Reclamo</h3>
                <button className="close-button" aria-label="Cerrar" onClick={closeModal}>×</button>
            </div>

            <div className="dialog-body">

                {/* Ejemplo de fila */}
                <div className="dato">
                    <label>Contenedor:</label>
                    <span>{props.data.reclamacionCalidad.contenedor}</span>
                </div>

                <div className="dato">
                    <label>Cliente:</label>
                    <span>{props.data.reclamacionCalidad.cliente}</span>
                </div>

                <div className="dato">
                    <label>Responsable:</label>
                    <span>{props.data.reclamacionCalidad.responsable}</span>
                </div>

                <div className="dato">
                    <label>Teléfono:</label>
                    <span>{props.data.reclamacionCalidad.telefono}</span>
                </div>

                <div className="dato">
                    <label>Correo:</label>
                    <span>{props.data.reclamacionCalidad.correo}</span>
                </div>

                <div className="dato">
                    <label>Cargo:</label>
                    <span>{props.data.reclamacionCalidad.Cargo}</span>
                </div>

                <div className="dato">
                    <label>Cajas:</label>
                    <span>{props.data.reclamacionCalidad.cajas}</span>
                </div>

                <div className="dato">
                    <label>Kilos:</label>
                    <span>{props.data.reclamacionCalidad.kilos}</span>
                </div>

                <div className="dato">
                    <label>Fecha Arribo:</label>
                    <span>{props.data.reclamacionCalidad.fechaArribo}</span>
                </div>

                <div className="dato">
                    <label>Fecha Detección:</label>
                    <span>{formatearFecha(props.data.reclamacionCalidad.fechaDeteccion)}</span>
                </div>

                <div className="dato">
                    <label>Fecha Registro:</label>
                    <span>{props.data.reclamacionCalidad.fecha}</span>
                </div>

                {/* Sección de defectos (frío, golpes, moho, etc.) */}
                <div className="dato">
                    <label>Frío permitido/encontrado:</label>
                    <span>{props.data.reclamacionCalidad.frio_permitido} / {props.data.reclamacionCalidad.frio_encontrado}</span>
                </div>

                <div className="dato">
                    <label>Golpes permitido/encontrado:</label>
                    <span>{props.data.reclamacionCalidad.golpes_permitido} / {props.data.reclamacionCalidad.golpes_encontrado}</span>
                </div>

                <div className="dato">
                    <label>Moho permitido/encontrado:</label>
                    <span>{props.data.reclamacionCalidad.moho_permitido} / {props.data.reclamacionCalidad.moho_encontrado}</span>
                </div>

                <div className="dato">
                    <label>Maduración permitido/encontrado:</label>
                    <span>{props.data.reclamacionCalidad.maduracion_permitido} / {props.data.reclamacionCalidad.maduracion_encontrado}</span>
                </div>

                <div className="dato">
                    <label>Otro Defecto:</label>
                    <span>{props.data.reclamacionCalidad.otroDefecto}</span>
                </div>

                <div className="dato">
                    <label>Observaciones:</label>
                    <span>{props.data.reclamacionCalidad.observaciones}</span>
                </div>

                {/* Lista de archivos subidos */}
                <div className="dato">
                    <label>Archivos Subidos:</label>
                    <div style={{ display: "flex", flexDirection: "row", gap: "6px", marginTop: "4px" }} className="modal-container-buttons">
                        {props.data.reclamacionCalidad.archivosSubidos && props.data.reclamacionCalidad.archivosSubidos.length > 0 ? (
                            props.data.reclamacionCalidad.archivosSubidos.map((path, idx) => (
                                <div key={idx}>
                                    <button className="agree" onClick={async (): Promise<void> => await handleDescargarDocumento(path)}>   Documento {idx + 1}</button>
                                </div>
                            ))
                        ) : (
                            <span>No hay archivos disponibles</span>
                        )}
                    </div>
                </div>
            </div>
        </dialog>
    )
}
