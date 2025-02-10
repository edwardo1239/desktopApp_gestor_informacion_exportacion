/* eslint-disable prettier/prettier */

import ErrorModal from "@renderer/errors/modal/ErrorModal";
import SuccessModal from "@renderer/errors/modal/SuccessModal";
import { useEffect, useState } from "react";

type propsType = {
    messageType: string
    message: string
}

export default function MessagesComponent(props:propsType): JSX.Element {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(()=>{
        if(props.messageType !== '' && props.message !== ''){
            if(props.messageType === "success"){
                setShowSuccess(true)
            } else if (props.messageType === 'error'){
                setShowError(true)
            }
        } else {
            setShowSuccess(false)
            setShowError(false)
        }
    },[props.message, props.messageType])
    const closeSuccess = (): void => {
        setShowSuccess(false)
    }

    const closeError = (): void => {
        setShowError(false)
    }
    return <div>
        {showSuccess &&
            <div className='fixed bottom-0 right-0 flex items-center justify-center'>
                <SuccessModal theme='Dark' message={props.message} closeModal={closeSuccess} />
            </div>
        }
        {showError &&
            <div className='fixed bottom-0 right-0 flex items-center justify-center'>
                <ErrorModal theme='Dark' message={props.message} closeModal={closeError} />
            </div>
        }
    </div>
}
