/* eslint-disable prettier/prettier */
import useAppContext from "@renderer/hooks/useAppContext";
import { useEffect, useState } from "react"
import TablaCargos from "./components/TablaCargos";
import { cargoType } from "@renderer/types/cargos";
import CrearCargo from "./components/CrearCargo";
import './styles/styles.css';
import ModificarCargo from "./components/Modificarcargo";

export default function Cargos(): JSX.Element {
    const { messageModal, setLoading } = useAppContext();
    const [cargos, setCargos] = useState<cargoType[]>()
    const [cargosOriginales, setCargosOriginales] = useState<cargoType[]>()
    const [cargoSeleccionado, setCargoSeleccionado] = useState<cargoType>();
    const [filtro, setFiltro] = useState<string>('')

    const [addCargo, setAddCargo] = useState<string>('inicio');
    const [dev, setDev] = useState<cargoType>()
    useEffect(() => {
        getCargos()
    }, [])
    useEffect(()=>{
        if(!cargosOriginales || !cargos) return 
        if(filtro === ''){
            setCargos(cargosOriginales)
        } else {
            const datosFiltrados = cargos.filter(
                item => item.Cargo.toLowerCase().includes(filtro.toLocaleLowerCase()
            ))
            setCargos(datosFiltrados)
        }
    },[filtro])
    const getCargos = async (): Promise<void> => {
        try {
            setLoading(true)
            const response = await window.api.server2({ action: "get_gestionCuentas_cargos" })
            if (response.status !== 200) throw new Error(`Code ${response.status}: ${response.message}`);
            const arrayCargos = response.data;
            const miCargo = arrayCargos.shift();
            setCargos(arrayCargos)
            setCargosOriginales(arrayCargos)
            setDev(miCargo)

        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", `${err.message}`)
            }
        } finally {
            setLoading(false)
        }
    }
    const handleChange = (tipo): void => {
        setAddCargo(tipo)
    }
    const buttonHandle = (): void => {
        if (addCargo !== 'inicio') {
            setAddCargo('inicio')
        } else {
            setAddCargo('crear')
        }
    }

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Cargos</h2>
            <hr />
            <div className='filtroContainer'>
                <div className='div-filter-actions'>
                    <label className="search-label">
                        Cargo:
                    </label>
                    <div className="search-container">
                        <input
                            type="text"
                            onChange={(e): void => setFiltro(e.target.value)}
                            className="search-input"
                            placeholder="Busca aquí..."
                        />
                    </div>
                    <button onClick={buttonHandle}>
                        {addCargo === 'inicio' ? 'Crear Cargo' : 'Cancelar'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                    </button>
                </div>
            </div>
            {addCargo === 'crear' &&
                <CrearCargo handleChange={handleChange} getCargos={getCargos} data={dev} />}
            {addCargo === 'inicio' &&
                <TablaCargos
                    cargoSeleccionado={cargoSeleccionado}
                    setCargoSeleccionado={setCargoSeleccionado}
                    getCargos={getCargos}
                    data={cargos}
                    handleChange={handleChange} />
            }
            {addCargo === 'modificar' &&
                <ModificarCargo
                    getCargos={getCargos}
                    buttonHandle={buttonHandle}
                    cargoSeleccionado={cargoSeleccionado}
                    dev={dev}
                />}

        </div>
    )
}