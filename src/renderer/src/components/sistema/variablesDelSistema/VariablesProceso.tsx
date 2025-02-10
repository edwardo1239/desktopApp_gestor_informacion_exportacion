/* eslint-disable prettier/prettier */
// import { useContext, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faIndustry, faBuilding, faClock, faWeight, faBolt } from "@fortawesome/free-solid-svg-icons";

export default function VariablesProceso(): JSX.Element {
    // const [kilosVaciadosHoy, setKilosVaciadosHoy] = useState<number>(0);
    // const [kilosProcesadosHoy, setKilosProcesadosHoy] = useState<number>(0);
    // const [kilosProcesadosHora, setKilosProcesadosHora] = useState<number>(0);
    // const [kilosExportacionHoy, setKilosExportacionHoy] = useState<number>(0);
    // const [kilosExpotacionHora, setKilosExportacionHora] = useState<number>(0);
    // const [rendimiento, setRendimiento] = useState<number>(0);
    // const [predioProcesando, setPredioProcesando] = useState<string>('');
    // const [nombrePredio, setNombrePredio] = useState<string>('');
    // const [horaInicio, setHoraInicio] = useState<string>('');

    // useEffect(() => {
    //     const request = async (): Promise<void> => {
    //         try {
    //             const request = {
    //                 collection: 'variablesDesktop',
    //                 action: 'obtenerEF1Sistema',
    //                 query: 'variablesDelProceso'
    //             };
    //             const response = await window.api.server2(request);
    //             setKilosVaciadosHoy(Number(response.kilosVaciadosHoy));
    //             setKilosProcesadosHoy(Number(response.kilosProcesadosHoy));
    //             setKilosProcesadosHora(Number(response.kilosProcesadosHora));
    //             setKilosExportacionHoy(Number(response.kilosExportacionHoy));
    //             setKilosExportacionHora(Number(response.kilosExportacionHora));
    //             setRendimiento(Number(response.rendimiento));
    //             setPredioProcesando(response.predioProcesando.enf);
    //             setNombrePredio(response.predioProcesando.nombrePredio);
    //             setHoraInicio(response.inicioProceso);
    //             console.log(response);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };
    //     request();
    // }, []);

    // const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <div className="p-5 flex flex-col justify-start w-full">
            <h2>Variables del sistema</h2>
            {/* <div className={`border rounded-lg overflow-hidden shadow-lg ${theme === 'Dark' ? 'border-gray-600 bg-gray-300' : 'border-gray-300 bg-white'}`}>
                <table className="w-full border-collapse">
                    <tbody className={`${theme === 'Dark' ? 'bg-slate-700 text-white' : 'bg-white'}`}>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 1 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(1)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faIndustry} className="mr-2" />Predio procesando:</td>
                            <td className={`py-3 px-6 text-xl`}>{predioProcesando}</td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 2 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(2)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faBuilding} className="mr-2" />Nombre del predio:</td>
                            <td className={`py-3 px-6 text-xl`}>{nombrePredio}</td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 3 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(3)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faClock} className="mr-2" />Inicio proceso:</td>
                            <td className={`py-3 px-6 text-xl`}>{new Date(horaInicio).toLocaleString()}</td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 4 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(4)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faWeight} className="mr-2" />Kilos vaciados hoy:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {kilosVaciadosHoy.toFixed(0)} Kg
                            </td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 5 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(5)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faWeight} className="mr-2" />Kilos procesados hoy:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {kilosProcesadosHoy.toFixed(0)} Kg
                            </td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 6 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(6)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faWeight} className="mr-2" />Kilos procesados hora:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {kilosProcesadosHora.toFixed(0)} Kg
                            </td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 7 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(7)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faWeight} className="mr-2" />Kilos exportación hoy:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {kilosExportacionHoy.toFixed(0)} Kg
                            </td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 8 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(8)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faWeight} className="mr-2" />Kilos exportación hora:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {kilosExpotacionHora.toFixed(0)} Kg
                            </td>
                        </tr>
                        <tr className={`border-b transition-colors duration-300 ${hoveredRow === 9 ? (theme === 'Dark' ? 'bg-gray-900' : 'bg-gray-100') : ''}`} onMouseEnter={(): void => setHoveredRow(9)} onMouseLeave={(): void => setHoveredRow(null)}>
                            <td className={`py-3 px-6 text-xl font-bold`}><FontAwesomeIcon icon={faBolt} className="mr-2" />Rendimiento:</td>
                            <td className={`py-3 px-6 text-xl`}>
                                {rendimiento.toFixed(0)} %
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> */}
        </div>
    );
}