/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import './styles.css'
import useAppContext from '@renderer/hooks/useAppContext'
import { LimpiezaDiariaType } from '@renderer/types/limpieza_diaria';
import { control_plagas, limpieza_diaria, limpieza_mensual } from '@renderer/constants/formSchema';
import { formType, LimpiezaObjectType } from './type';
export default function IngresarLimpiezaDiaria(): JSX.Element {
    const { messageModal } = useAppContext();
    const [formularios, setFormularios] = useState<LimpiezaDiariaType[]>();
    const [formularioSeleccionado, setFormularioSeleccionado] = useState<LimpiezaDiariaType>();
    const [areaSeleccionada, setAreaSeleccionada] = useState<string>();
    const [tipoFormulario, setTipoFormulario] = useState<LimpiezaObjectType>();
    const [formData, setFormData] = useState<formType>();
    useEffect(() => {
        obtener_formularios_existentes()
    }, [])
    const obtener_formularios_existentes = async (): Promise<void> => {
        try {
            const request = {
                action: "get_calidad_ingresos_formulariosCalidad",
            }
            const response = await window.api.server2(request)
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`)
            setFormularios(response.data)
            console.log(response)
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    const handle_select_formulario = (id: string): void => {
        if (formularios !== undefined) {
            const select = formularios.find(item => item._id === id);

            if (!select) { return messageModal("error","Error, formulario no existe"); }

            setAreaSeleccionada('');
            setFormularioSeleccionado(select);
            switch (select.formulario) {
                case 'Limpieza diaría':
                    setTipoFormulario(limpieza_diaria);
                    break;
                case 'Limpieza mensual':
                    setTipoFormulario(limpieza_mensual);
                    break;
                case 'Control de plagas':
                    setTipoFormulario(control_plagas);
                    break;
                default:
                    break;
            }
        }
    };
    const handle_select_area = (area: string): void => {
        if (tipoFormulario !== undefined) {
            setAreaSeleccionada(area);
            const obj: formType = {};

            tipoFormulario[area].forEach(item => {
                obj[item.key] = {
                    status: false,
                    observaciones: '',
                };
            });
            setFormData(obj);

        }
    };
    const handle_cumple_checkbox = (e: boolean, item: string): void => {
        if (formData !== undefined) {
            setFormData(prevFormData => {
                if (prevFormData !== undefined) {
                    return ({
                        ...prevFormData,
                        [item]: {
                            ...prevFormData[item],
                            status: e,
                        },
                    });
                }
                return prevFormData
            });
        }
    };
    const handle_observaciones = (e: string, item: string): void => {
        if (formData !== undefined) {
            setFormData(prevFormData => {
                if (prevFormData !== undefined) {
                    return ({
                        ...prevFormData,
                        [item]: {
                            ...prevFormData[item],
                            observaciones: e,
                        },
                    });
                }
                return prevFormData

            });
        }
    };
    const handle_guardar = async (): Promise<void> => {
        try {
            if (formularioSeleccionado === undefined) {
                throw new Error("Seleccione un formulario");
            }
            if (areaSeleccionada === undefined) {
                throw new Error("Seleccione un area");
            }

            const request = {
                action: "put_calidad_ingresos_formulariosCalidad",
                tipoFormulario: formularioSeleccionado.formulario,
                _id: formularioSeleccionado._id,
                area: areaSeleccionada,
                data: formData,
            };
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            messageModal("success", "Se guardó con éxito")
            setFormData(undefined);
            setTipoFormulario(undefined);
        } catch (err) {
            if (err instanceof Error) {
                messageModal("error", err.message)
            }
        }
    }
    if (formularios === undefined) {
        return (
            <div className="componentContainer">
                <div className="navBar"></div>
                <h2>Cargando datos</h2>
            </div>
        )
    }
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Ingresar formulario calidad</h2>
            <hr />
            <div className='ingresarformularioscalidad-container'>
                <div className='ingresoformulariocalidad-selectformulario-container'>
                    <h2>Seleccione el formulario</h2>
                    <select
                        value={formularioSeleccionado?._id}
                        className="defaultSelect"
                        onChange={(e): void => handle_select_formulario(e.target.value)}
                    >
                        <option value=""></option>
                        {formularios.map(item => (
                            <option value={item._id} key={item._id}>
                                {item.ID + "-" + item.formulario}
                            </option>
                        ))}
                    </select>
                </div>
                <hr />
                <div className='ingresoformulariocalidad-selectformulario-container'>
                    <h2>Seleccionar Áreas</h2>
                    {tipoFormulario &&
                        <select
                            value={areaSeleccionada}
                            className="defaultSelect"
                            onChange={(e): void => handle_select_area(e.target.value)}
                        >
                            <option value=""></option>
                            {Object.keys(tipoFormulario).map(area => (
                                <option value={area} key={area}>{area}</option>
                            ))}
                        </select>
                    }
                </div>
                <hr />


                <div className='ingresoformulariocalidad-selectformulario-container'>
                    <h2>Items del formulario</h2>
                    {areaSeleccionada && tipoFormulario &&
                        tipoFormulario[areaSeleccionada].map((item, index) => (
                            <div key={item.key + index} className='ingresoformulariocalidad-selectformulario-container'>                                
                                <h2>{item.label}</h2>
                                <hr />
                                <section className='ingresoformulariocalidad-cumple-button'>
                                    <p>Cumple</p>
                                    <label className="switch">
                                        <input  
                                            checked={formData && formData[item.key].status}
                                            type="checkbox" 
                                            onChange={(e):void => handle_cumple_checkbox(e.target.checked, item.key)}  
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </section>
                                <label className='ingresoformulariocalidad-obsercaciones'>
                                    <p>Observaciones</p>
                                    <textarea
                                        value={formData && formData[item.key].observaciones}
                                        className="defaultSelect"
                                        onChange={(e):void => handle_observaciones(e.target.value, item.key)}
                                    ></textarea>
                                </label>
                            </div>
                        ))
                    }

                </div>


                <div className='ingresoformularioscalidad-button-div'>
                    <button
                        onClick={handle_guardar}
                        className='defaulButtonAgree'>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}