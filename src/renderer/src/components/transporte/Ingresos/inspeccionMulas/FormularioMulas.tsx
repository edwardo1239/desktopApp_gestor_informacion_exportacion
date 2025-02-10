/* eslint-disable prettier/prettier */
import '@fortawesome/fontawesome-free/css/all.css';
import { contenedoresType } from '@renderer/types/contenedoresType';
import { useEffect, useState } from 'react';
import { contenedoresRequest, initData, send_data } from './functions/constants';
import useAppContext from '@renderer/hooks/useAppContext';
import ShowDataContenedores from './utils/ShowDataContenedores';
import FormularioInspeccion from './utils/FormularioInspeccion';

const FormularioMulas: React.FC = () => {
  const { messageModal } = useAppContext();
  const [contenedores, setContenedores] = useState<contenedoresType[]>()
  const [contenedorSelect, setContenedorSelect] = useState<contenedoresType>()
  const [formState, setFormState] = useState(initData)

  useEffect(() => {
    obtenerContenedores();
  }, []);
  const obtenerContenedores = async (): Promise<void> => {
    try {
      const response = await window.api.server2(contenedoresRequest);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      setContenedores(response.data);
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message)
      }
    }
  };
  const handleChangeCheckBoxk = (event): void => {
    const { name, checked } = event.target;
    setFormState({
      ...formState,
      [name]: { ...formState[name], cumple: checked }
    });
  };
  const handleChangeObservaciones = (event): void => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: { ...formState[name], observaciones: value }
    });
  }
  const handleSubmit = async (event): Promise<void> => {
    event.preventDefault();
    try {
      const sendData = send_data(formState, contenedorSelect);
      const response = await window.api.server2(sendData);
      if (response.status !== 200)
        throw new Error(response.message)
      messageModal("success", "datos guardados con exito!")
      setFormState(initData);
      obtenerContenedores();
      setContenedorSelect(undefined)
    } catch (e) {
      if (e instanceof Error) {
        messageModal("error", e.message)
      }
    }
  }

  return (
    <div className="componentContainer">
      <div className='navBar'></div>
      <h2>Formulario de Inspección</h2>
      <hr />
      <form className='formulario-inspeccion-mula-container' onSubmit={handleSubmit}>
        <div>
          <label>Contenedores</label>
          <select className='defaultSelect'
            onChange={(e): void => {
              const selectedContenedor = contenedores?.find(item => item._id === e.target.value);
              setContenedorSelect(selectedContenedor);
            }}>
            <option value="">Contenedores</option>
            {contenedores && contenedores?.map(item => (
              <option key={item._id} value={item._id}>
                {item.infoContenedor?.clienteInfo && typeof item.infoContenedor.clienteInfo === 'object' &&
                  `${item.numeroContenedor} - ${item.infoContenedor.clienteInfo.CLIENTE}`
                }
              </option>
            ))}
          </select>

        </div>
        <div>
          {contenedorSelect !== undefined && <ShowDataContenedores contenedorSelect={contenedorSelect} />}
        </div>
        <div>
          <FormularioInspeccion
            formState={formState}
            handleChangeCheckBoxk={handleChangeCheckBoxk}
            handleChangeObservaciones={handleChangeObservaciones} />
        </div>
        <div className='formulario-inspeccionMula-div-button'>
          <button className='formulario-inspeccionMula-button'>Guardar</button>
        </div>
      </form>
    </div>
  );
};
export default FormularioMulas;