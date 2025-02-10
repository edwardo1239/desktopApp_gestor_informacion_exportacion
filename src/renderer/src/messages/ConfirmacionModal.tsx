/* eslint-disable prettier/prettier */
import { PiWarningFill } from "react-icons/pi";
import "./css/confirmacionModal.css"
import "../css/components.css"
import "../css/main.css"

type propsType = {
    message: string
    setConfirmation: (e) => void;
    setShowConfirmationModal: (e) => void;
}

export default function ConfirmacionModal(props: propsType): JSX.Element {
    const handleAccept = (): void => {
        props.setConfirmation(true)
        props.setShowConfirmationModal(false)
    }
    const handleCancel = (): void => {
        props.setConfirmation(false)
        props.setShowConfirmationModal(false)

    }

    return (
        <div className='confirmacionModal-container' >
            <div className='confirmacionModal-div'>
                <div className='navBar'></div>
                <div className='confirmationModal-message-div'>
                    <div className='confirmationModal-message-icon-div'>
                        <PiWarningFill />
                    </div>
                    <div className='confirmationModal-message-text-div'>
                        <p>{props.message}</p>
                    </div>
                </div>
                <div className='confirmationModal-buttons'>
                    <button onClick={handleAccept} className='defaulButtonAgree'>Aceptar</button>
                    <button onClick={handleCancel} className='defaulButtonError'>Cancelar</button>
                </div>
            </div>
        </div>
    )
}
