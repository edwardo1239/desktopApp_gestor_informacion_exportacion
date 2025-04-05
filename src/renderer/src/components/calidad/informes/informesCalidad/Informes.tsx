/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { lotesType } from "@renderer/types/lotesType";
import useAppContext from "@renderer/hooks/useAppContext";
import "@renderer/css/components.css"
import "@renderer/css/main.css"
import "@renderer/css/table.css"
import "./css/informesCalidad.css"

import { requestObject } from "./functions/request";
import TablaInformeCalidad from "./components/TablaInformeCalidad";
import ViewInformeData from "./components/ViewInformeData";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BotonesPasarPaginas from "@renderer/components/UI/BotonesPasarPaginas";

export default function Informes(): JSX.Element {
  const { messageModal, eventoServidor, triggerServer } = useAppContext();

  const [datos, setDatos] = useState<lotesType[]>([]);
  const [datosFiltrados, setDatosFiltrados] = useState<lotesType[]>([]);
  const [filtro, setFiltro] = useState('');
  const [countPage, setCountPage] = useState<number>(1);
  const [showTable, setShowTable] = useState<boolean>(true)
  const [loteSeleccionado, setLoteSeleccionado] = useState<lotesType>()
  const [numeroDatos, setNumeroDatos] = useState<number>(1);
  const obtenerDatosDelServidor = async (): Promise<void> => {
    try {
      const request = requestObject(countPage)
      const response = await window.api.server2(request);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      setDatos(response.data);
      setDatosFiltrados(response.data);
    } catch (error) {
      if (error instanceof Error) {
        messageModal("error", `${error.message}`)
      }
    }
  };
  const obtenerCantidadDeDatos = async (): Promise<void> => {
    try {
      const request = {
        action: 'get_calidad_informes_informeProveedor_numeroElementos'
      }
      const response = await window.api.server2(request);
      if (response.status !== 200) {
        throw new Error(`Code ${response.status}: ${response.message}`)
      }
      setNumeroDatos(response.data)
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", err.message)
      }
    }
  }
  useEffect(() => {
    obtenerCantidadDeDatos()
  }, [])
  useEffect(() => {
    if (
      eventoServidor === 'add_lote'
    ) {
      obtenerDatosDelServidor()
    }
  }, [triggerServer])

  useEffect(() => {
    obtenerDatosDelServidor();
  }, [countPage]);

  useEffect(() => {
    const datosFiltrados = datos.filter(
      (item) =>
        item._id && item._id.toLowerCase().includes(filtro.toLowerCase()) ||
        item.predio && item.predio.PREDIO && item.predio.PREDIO.toLowerCase().includes(filtro.toLowerCase()) ||
        item.tipoFruta && item.tipoFruta.toLowerCase().includes(filtro.toLowerCase())
    );
    setDatosFiltrados(datosFiltrados);
  }, [filtro, datos]);

  const handleAccederDocumento = (lote): void => {
    setShowTable(false)
    setLoteSeleccionado(lote)
  };
  const handleVolverTabla = (): void => {
    setShowTable(true)
  }

  const no_pagar_balin = async (newLote: lotesType): Promise<void> => {
    setLoteSeleccionado(newLote);
    try {
      const query = {
        action: "put_calidad_informe_noPagarBalinLote",
        _id: newLote._id,
      }
      const response = await window.api.server2(query)
      if (response.status !== 200)
        throw new Error(`Code ${response.status} : ${response.message}`)
      obtenerDatosDelServidor();
      messageModal("success", "Datos guardados con exito")
    } catch (err) {
      if (err instanceof Error) {
        messageModal("error", "Error creando caso Favorita")
      }
    }
  }
  const captureComponent = async (): Promise<void> => {
    const element = document.getElementById('viewInformeDataContainer');
    if (element) {

      const FIXED_WIDTH = 1150;


      // Esperar a que todos los elementos estén completamente renderizados
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Opciones mejoradas para html2canvas
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff',
        onclone: (document) => {
          // Asegurarse de que las tablas tengan los estilos correctos
          const clonedElement = document.getElementById('viewInformeDataContainer');
          if (clonedElement) {
            clonedElement.style.width = `${FIXED_WIDTH}px`;

            // Copiar los estilos del elemento original
            const originalStyles = window.getComputedStyle(element);
            clonedElement.style.fontFamily = originalStyles.fontFamily;
            clonedElement.style.fontSize = originalStyles.fontSize;
            clonedElement.style.lineHeight = originalStyles.lineHeight;

            const tables = clonedElement.getElementsByTagName('table');
            for (const table of tables) {
              table.style.borderCollapse = 'collapse';
              table.style.backgroundColor = '#ffffff';

              const cells = table.getElementsByTagName('td');
              for (const cell of cells) {
                cell.style.verticalAlign = 'middle';
                cell.style.padding = '5px';
                cell.style.backgroundColor = '#ffffff';
              }
            }
          }
        },
        width: FIXED_WIDTH,
      });
      const dataURL = canvas.toDataURL('image/png');
      const alturaDoc = canvas.height

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [FIXED_WIDTH, alturaDoc]
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, FIXED_WIDTH, alturaDoc); // Ajusta las dimensiones según sea necesario
      pdf.save(`${loteSeleccionado?.enf} ${loteSeleccionado?.predio.PREDIO} ${loteSeleccionado?.tipoFruta} ${loteSeleccionado?.kilos} ${new Date(loteSeleccionado?.fechaIngreso ?
        loteSeleccionado?.fechaIngreso : 0
      ).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/Bogota"
      })}.pdf`);
    }
  }
  return (
    <div className="componentContainer">
      <div className="navBar">
        <div>
          <input
            type="text"
            value={filtro}
            onChange={(e): void => setFiltro(e.target.value)}
            placeholder="Buscador ..."
            className="defaultSelect"
          />
        </div>
      </div>
      <h2>Informe proveedor</h2>
      {showTable ?
        <TablaInformeCalidad
          handleAccederDocumento={handleAccederDocumento}
          datosFiltrados={datosFiltrados} />
        :

        <ViewInformeData
          no_pagar_balin={no_pagar_balin}
          obtenerDatosDelServidor={obtenerDatosDelServidor}
          // casoFavorita={casoFavorita}
          // modificarPrecios={modificarPrecios}
          captureComponent={captureComponent}
          handleVolverTabla={handleVolverTabla}
          loteSeleccionado={loteSeleccionado}
        />

      }
      {showTable &&
        <BotonesPasarPaginas
          division={50}
          page={countPage}
          numeroElementos={numeroDatos}
          setPage={setCountPage}
        />
      }
    </div>
  );
};

