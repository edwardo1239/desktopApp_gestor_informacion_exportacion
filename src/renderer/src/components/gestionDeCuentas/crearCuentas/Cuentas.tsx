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

export default function Cuentas(): JSX.Element {
  const { messageModal } = useAppContext();
  const [opciones, setOpciones] = useState<string>('inicio')
  const [usuario, setUsuario] = useState<userType>()
  const [cargos, setCargos] = useState<cargoType[]>()


  const obtenerCargos = async (): Promise<void> => {
    try {
      const request = { action: 'get_cargos' }
      const response = await window.api.server2(request);
      if (response.status !== 200)
        throw new Error(response.message)
      setCargos(response.data)
    } catch (err) {
      if (err instanceof Error)
        messageModal("error", err.message);
    }
  }

  useEffect(() => {
    obtenerCargos()
  }, [])

  const handleModificar = (usuario, tipo): void => {
    setOpciones(tipo)
    setUsuario(usuario)
  }

  return (
    <div className='componentContainer'>
      <div className='navBar'></div>
      <h2>Cuentas</h2>
      <hr />

      <div>
        {opciones === "inicio" &&
          <TablaCuentas
            cargos={cargos}
            setOpciones={setOpciones}
            handleModificar={handleModificar} />}

        {opciones === "agregar" &&
          <IngresarCuentas
            setOpciones={setOpciones}
            cargos={cargos}
          />
        }

        {opciones === 'modificar' &&
          <ModificarUsuario
            cargos={cargos}
            setOpciones={setOpciones}
            usuario={usuario} />}
      </div>

    </div>
  )
}