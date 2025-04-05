/* eslint-disable prettier/prettier */

import useAppContext from "@renderer/hooks/useAppContext"


type propsType = {
    newCargo: object
    handleCloseModal: () => void
    cargo: string
    reiniciarCargo: () => void
    handleChange: (tipo:string) => void
    getCargos: () => void

}
export default function ModalConfirmacionCrearcargo(props: propsType): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const handleGuardar = async (): Promise<void> => {
        try {
            setLoading(true)
            const request = {
                action: "post_gestionCuentas_cargo",
                data: {
                    ...props.newCargo,
                    Cargo: props.cargo
                }
            }
            const response = await window.api.server2(request);
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Cargo creado con exito");
            props.reiniciarCargo()
            props.handleCloseModal()
            props.getCargos()
            props.handleChange('inicio')
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message);
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="fondo-modal">
            <div className="modal-container">
                <div className='modal-header-agree'>
                    <h2>Verifique si la información es correcta</h2>
                </div>
                <div className='modal-container-body-cargo'>
                    <div>
                        <h3>Cargo: {props.cargo}</h3>
                    </div>
                    <div className="modal-container-crear-cargo-seccion">
                        {Object.keys(props.newCargo).map(key => (
                            <div key={key}>
                                <hr />
                                <h3>{key}:</h3>
                                <hr />
                                <div className="modal-container-crear-cargo-tipo">
                                    {Object.keys(props.newCargo[key]).map(tipo => (
                                        <div key={`${key}-${tipo}`}>
                                            <h3>{tipo}:</h3>
                                            <hr />
                                            <div className="modal-container-crear-cargo-item">
                                                {Object.keys(props.newCargo[key][tipo]).map(item => (
                                                    <div key={key + tipo + item}>
                                                        <h3>{item}:</h3>
                                                        <hr />
                                                        <div className="modal-container-crear-cargo-permiso">
                                                            {Object.keys(props.newCargo[key][tipo][item].permisos).map(permiso => (
                                                                <div key={key + tipo + item + permiso}>
                                                                    <h3>- {permiso}</h3>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-container-buttons">
                        <button className="agree" onClick={handleGuardar}>Aceptar</button>
                        <button className="cancel" onClick={props.handleCloseModal}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
