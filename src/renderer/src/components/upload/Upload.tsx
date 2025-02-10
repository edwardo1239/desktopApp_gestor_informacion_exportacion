/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react"
import './styles.css'

export default function Upload(): JSX.Element {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
      if (window.api) {
        window.api.updateProgress("updateProgress", (data) => {
          console.log("Progreso de descarga:", data);
          const progressBar = document.getElementById('progressBar') as HTMLProgressElement;
          if (progressBar) {
            progressBar.value = data;
            setProgress(data); // Actualizar el estado del progreso
          }
        });
      }
    }, []);
    return (
        <div className="container-upload">
        <h1>Descargando actualización...</h1>
        <progress id="progressBar" value="0" max="100"></progress>
        <div id="percentage">{progress}%</div> {/* Mostrar porcentaje numérico */}
      </div>
    )
}
