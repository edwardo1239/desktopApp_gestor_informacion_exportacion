/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import IngresarDescarteLavado from "./components/IngresarDescarteLavado";
import useAppContext from "@renderer/hooks/useAppContext";
import { predioDescarteType } from "@renderer/types/descartes.d";
import IngresarDescarteEncerado from "./components/IngresoDescarteEncerado";
export default function IngresoSistemaDescartes (): JSX.Element{
    const {messageModal} = useAppContext();
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [showDescarte, setShowDescarte] = useState<boolean>(true)
    const [predio, setPredio] = useState<predioDescarteType>()
    useEffect(()=>{
        obtenerEF1()
    },[])
    const obtenerEF1 = async ():Promise<void> => {
        try{
            const request = {
                collection:'variablesDesktop',
                action: 'obtener_datos_sistem',
                query: 'obtener_EF1_procesando',
            };
            const response = await window.api.server2(request);
            if(response.status !== 200)
                throw new Error(response.message)
            setPredio(response.data)
            
        }catch(e){
            if(e instanceof Error)
                messageModal("error", e.message)
        }
    } 
    const handleMenu = (e):void => {
        setShowDescarte(e)
        setShowMenu(false)
    }
    return(
        <div className="componentContainer">
            <div className="navBar">
                <button className="navBar-menuButton" onClick={():void => setShowMenu(!showMenu)}>
                    <IoMdMenu />
                </button>
                {showMenu && 
                <div className="navBar-menu-div">
                    <button onClick={():void=>handleMenu(true)}>Descarte lavado</button>
                    <button onClick={():void=>handleMenu(false)}>Descarte encerado</button>
                </div>
                }
            </div>
            {showDescarte ? <IngresarDescarteLavado predio={predio}/> : <IngresarDescarteEncerado predio={predio} />}
        </div>
    )
}