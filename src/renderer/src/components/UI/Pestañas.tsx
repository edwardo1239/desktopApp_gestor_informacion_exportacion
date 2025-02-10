/* eslint-disable prettier/prettier */
import './styles/pestaña.css'
import { IoMdCloseCircleOutline } from "react-icons/io";

type propsType = {
    section: string[][] | undefined
    selccionPestaña: (e: string) => void
    pestañaActiva: string | undefined
    closePestaña: (e: string) => void
}
export default function Pestañas(props: propsType): JSX.Element {
    if (props.section === undefined) {
        return (
            <div className='pestaña-container'></div>
        )
    }
    return (
        <div className="pestaña-container">
            {props.section.map(item => (
                <div
                    className={props.pestañaActiva === item[0] ? 'pestaña-seleccionada' : 'pestaña-style'}
                    key={item[0]}
                    onClick={(): void => props.selccionPestaña(item[0])}>
                    <p>{item[1]}</p>
                    <button 
                        className='pestaña-close' 
                        onClick={(e): void => {
                            e.stopPropagation()
                            props.closePestaña(item[0])
                        }}>
                        <IoMdCloseCircleOutline />
                    </button>
                </div>
            ))}
        </div>
    )
}


