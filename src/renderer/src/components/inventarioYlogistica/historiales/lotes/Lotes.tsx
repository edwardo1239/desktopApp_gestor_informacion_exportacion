/* eslint-disable prettier/prettier */
import { useState } from "react"
import ProcesoData from "./components/ProcesoData"
import CalidadData from "./components/CalidadData"
import { IoMdMenu } from "react-icons/io";
import "./css/styles.css"


export default function Lotes(): JSX.Element {
    const [seccion, setSeccion] = useState<string>('Proceso')
    const [showMenu, setShowMenu] = useState<boolean>(false)

    const handleSectionSelect = (data: string): void => {
        setSeccion(data)
        setShowMenu(false)
    }
    return (
        <div>
            <div className="navBar">
                <button className="navBar-menuButton" onClick={():void => setShowMenu(!showMenu)}>
                    <IoMdMenu />
                </button>
                {showMenu && 
                <div className="navBar-menu-div">
                    <button onClick={():void=>handleSectionSelect("Proceso")}>Proceso</button>
                    <button onClick={():void=>handleSectionSelect("Calidad")}>Calidad</button>
                </div>
                }
            </div>
            {seccion === 'Proceso' && <ProcesoData />}
            {seccion === 'Calidad' && <CalidadData />}
        </div>
    )
}
