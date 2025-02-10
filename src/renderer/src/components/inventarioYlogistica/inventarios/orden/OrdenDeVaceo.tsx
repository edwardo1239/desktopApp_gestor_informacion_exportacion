/* eslint-disable prettier/prettier */

import OrdenVaceo from "./components/OrdenVaceo";
import "./css/predioCard.css"


export default function OrdenDeVaceo(): JSX.Element {

    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Orden de vaceo</h2>
            <OrdenVaceo />
        </div>
    )
}