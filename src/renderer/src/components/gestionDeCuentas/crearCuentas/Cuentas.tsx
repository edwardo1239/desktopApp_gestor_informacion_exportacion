/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react'
import "../../../css/filtros.css"
import { userType } from '@renderer/types/cuentas';
import TablaCuentas from './components/TablaCuentas';
import "./css/usuarios-estilos.css"
import IngresarCuentas from './components/IngresarCuenta';
import ModificarUsuario from './components/ModificarUsuario';
import useAppContext from '@renderer/hooks/useAppContext';
import { cargoType } from '@renderer/types/cargos';
import BotonesPasarPaginas from '@renderer/components/UI/BotonesPasarPaginas';
import { FaSearch } from "react-icons/fa";

type filtroType = {
  nombre?: string
  cargo?: string
  estado?: string
}

export default function Cuentas(): JSX.Element {
  const { messageModal, setLoading } = useAppContext();
  const [opciones, setOpciones] = useState<string>('inicio')
  const [usuario, setUsuario] = useState<userType>()
  const [cargos, setCargos] = useState<cargoType[]>()
  const [data, setData] = useState<userType[]>();

  const [filtro, setFiltro] = useState<filtroType>()


  const [page, setPage] = useState<number>(1);
  const [numeroDoc, setNumeroDoc] = useState<number>();


  const obtenerCargos = async (): Promise<void> => {
    const request = { action: 'get_data_cargos' }
    const response = await window.api.server2(request);
    if (response.status !== 200)
      throw new Error(response.message)
    setCargos(response.data)
  }
  const obtenerData = async (): Promise<void> => {
    const request = {
      action: 'get_gestionCuentas_usuarios',
      page: page,
      filtro: filtro
    }
    const response = await window.api.server2(request);
    if (response.status !== 200)
      throw new Error(response.message)
    setData(response.data)
  }
  const obtener_numero_elementos = async (): Promise<void> => {
    const request = { action: "obtener_cantidad_usuarios" }
    const response = await window.api.server2(request)
    if (response.status !== 200)
      throw new Error(`Code ${response.status}: ${response.message}`)
    setNumeroDoc(response.data)
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true)
        await obtenerCargos()
        await obtener_numero_elementos()
        await obtenerData()
      } catch (err) {
        if (err instanceof Error)
          messageModal("error", err.message);
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])


  const handleModificar = (usuario, tipo): void => {
    setOpciones(tipo)
    setUsuario(usuario)
  }

  const desactivar = async (usuarioDataSeleccionado): Promise<void> => {
    try {
      const request = {
        action: 'put_gestionCuentas_usuarioEstado',
        _id: usuarioDataSeleccionado?._id,
        __v: usuarioDataSeleccionado?.__v
      }
      const response = await window.api.server2(request);
      if (response.status !== 200)
        throw new Error(response.message)
      if (usuarioDataSeleccionado?.estado) {
        messageModal("success", "Usuario desactivado con exito")
      } else {
        messageModal("success", "Usuario activado con exito")
      }

      obtenerData();
    } catch (e) {
      if (e instanceof Error)
        messageModal("error", e.message)
    }
  }

  const handleChange = (e): void => {
    const { value, name } = e.target

    setFiltro({
      ...filtro,
      [name]: value,
    });
  };

  return (
    <div className='componentContainer'>
      <div className='navBar'></div>
      <h2>Cuentas</h2>
      <hr />
      {opciones === "inicio" &&
        <>
          <div className='filtroContainer'>
            <div className='div-filter-actions'>
              <button onClick={(): void => setOpciones("agregar")}>
                {"Agregar cuenta"}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
              </button>
            </div>
            <hr />
            <div className='div-filter-actions'>
              <select onChange={handleChange} name='estado'>
                <option value="">Ver usuarios por:</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
              <select onChange={handleChange} name='cargo'>
                <option value="">Cargos</option>
                {cargos && cargos.map(cargo => (
                  <option value={cargo._id} key={cargo._id}>{cargo.Cargo}</option>
                ))}
              </select>
              <input type="text" name='nombre' placeholder='Usuario' onChange={handleChange} />
              <button onClick={obtenerData}>
                {"Buscar"}
                <FaSearch />
              </button>
            </div>
          </div>


          <TablaCuentas
            desactivar={desactivar}
            data={data}
            cargos={cargos}
            setOpciones={setOpciones}
            handleModificar={handleModificar} />

          <BotonesPasarPaginas
            division={25}
            page={page}
            numeroElementos={numeroDoc}
            setPage={setPage} />
        </>
      }

      {opciones === "agregar" &&
        <IngresarCuentas
          setOpciones={setOpciones}
          cargos={cargos}
        />
      }

      {opciones === 'modificar' &&
        <ModificarUsuario
          obtenerData={obtenerData}
          cargos={cargos}
          setOpciones={setOpciones}
          usuario={usuario} />}

    </div >
  )
}