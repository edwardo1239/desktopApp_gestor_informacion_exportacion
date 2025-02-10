/* eslint-disable prettier/prettier */


import { useEffect, useState } from "react"
import HigienePersonal from "../calidad/formularios/higienePersonal/HigienePersonal"
import VolanteCalidad from "../calidad/formularios/volanteCalidad/VolanteCalidad"
import HistorialCalidadInterna from "../calidad/historiales/historialCalidadInterna/HistorialCalidadInterna"
import HistorialClasificacionCalidad from "../calidad/historiales/historialClasificacionCalidad/HistorialClasificacionCalidad"
import Informes from "../calidad/informes/informesCalidad/Informes"
import CalidadInterna from "../calidad/ingresos/calidadInterna/CalidadInterna"
import IngresoClasificacionCalidad from "../calidad/ingresos/clasificacionCalidad/IngresoClasificacionCalidad"
import IngresoHigienePersonal from "../calidad/ingresos/higienePersonal/IngresoHigienePersonal"
import IngresoVolanteCalidad from "../calidad/ingresos/ingresoVolanteCalidad/IngresoVolanteCalidad"
import InspeccionIngresoFruta from "../calidad/ingresos/inspeccionIngresoFruta/InspeccionIngresoFruta"
import Clientes from "../comercial/clientes/Clientes"
import CrearContenedor from "../comercial/ingresos/crearContenedor/CrearContenedor"
import PrecioLimon from "../comercial/precioLimon/PrecioLimon"
import PrecioNaranja from "../comercial/precioNaranja/PrecioNaranja"
import Proveedores from "../comercial/proveedores/Proveedores"
import Cargos from "../gestionDeCuentas/Cargos/Cargos"
import Cuentas from "../gestionDeCuentas/crearCuentas/Cuentas"
import EficienciaFruta from "../indicadores/operaciones/EficienciaFruta/EficienciaFruta"
import HistorialDespachoDescartes from "../inventarioYlogistica/historiales/HistorialDespachoDescarte/HistorialDespachoDescartes"
import HistorialDirectoNacional from "../inventarioYlogistica/historiales/historialDirectoNacional/HistorialDirectoNacional"
import HistorialIngresoFruta from "../inventarioYlogistica/historiales/historialIngresoFruta/HistorialIngreso"
import HistorialProcesado from "../inventarioYlogistica/historiales/historialProcesado/HistorialProcesado"
import Lotes from "../inventarioYlogistica/historiales/lotes/Lotes"
import IngresoFruta from "../inventarioYlogistica/ingresos/ingresoFruta/IngresoFruta"
import Desverdizado from "../inventarioYlogistica/inventarios/desverdizado/Desverdizado"
import InventarioFrutaSinProcesar from "../inventarioYlogistica/inventarios/frutaSinProcesar/InventarioFrutaSinProcesar"
import OrdenDeVaceo from "../inventarioYlogistica/inventarios/orden/OrdenDeVaceo"
import ReprocesoDescarte from "../inventarioYlogistica/inventarios/reproceso descarte/ReprocesoDescarte"
import ProgramacionContenedores from "../inventarioYlogistica/programaciones/programacionContenedores/ProgramacionContenedores"
import DescarteEnceradoSistema from "../proceso/aplicaciones/descarteEncerado/DescarteEnceradoSistema"
import DescarteLavadoSistema from "../proceso/aplicaciones/descarteLavado/DescarteLavadoSistema"
import HabilitarPrediosProceso from "../sistema/habilitarPrediosProceso/HabilitarPrediosProceso"
import ProcesoListaEmpaque from "../proceso/aplicaciones/ListaEmpaque/ProcesoListaEmpaque"
import IngresoTipoInsumo from "../inventarioYlogistica/insumos/ingresoTipoInsumo/IngresoTIpoInsumo"
import HistorialIngresoDescarteLavado from "../proceso/historial/descarteLavado/HistorialIngresoDescarteLavado"
import HistorialIngresoDescarteEncerado from "../proceso/historial/descarteEncerado/HistorialIngresoDescarteEncerado"
import IngresoInsumoContenedor from "../inventarioYlogistica/insumos/ingresoInsumosContenedor/IngresoInsumoContenedor"
import ProcesoFotosCalidad from "../proceso/aplicaciones/FotosCalidad/ProcesoFotosCalidad"
import HistorialListaEmpaque from "../inventarioYlogistica/historiales/listasDeEmpaque/HistorialListasEmpaque"
import Contenedores from "../inventarioYlogistica/historiales/contenedores/Contenedores"
import PanelControlProceso from "../sistema/panelControlProceso/PanelControlProceso"
import MiCuenta from "../gestionDeCuentas/cuentaPersonal/MiCuenta"
import CreacionFormulariosCalidad from "../calidad/formularios/creacionFormulariosCalidad/CreacionFormulariosCalidad"
import IngresarLimpiezaDiaria from "../calidad/formularios/ingresarLimpiezaDiaria/IngresoFormulariosCalidad"
import LimpiezaDiaria from "../calidad/formularios/LimpiezaDiaria/LimpiezaDiaria"
import LimpiezaMensual from "../calidad/formularios/LimpizaMensual/LimpiezaMensual"
import ControlPlagas from "../calidad/formularios/controlPlagas/ControlPlagas"
import InformesProveedorContabilidad from "../Contabilidad/informesProveedor/InformesProveedorContabilidad"
import HistorialEsperaDescargue from "../inventarioYlogistica/historiales/enEsperaDescargue/HistorialEsperaDescargue"
import HistorialEnInventarioFrutaSinProcesar from "../inventarioYlogistica/historiales/historialEnInventario/HistorialEnInventarioFrutaSinProcesar"
import TransporteExportacionIngresoData from "../transporte/Ingresos/TransporteExportacion/TransporteExportacionIngresoData"
import TransporteExportacionRegistros from "../transporte/registros/TransporteExportacion/TransporteExportacionRegistros"
import TransporteProgramacionMula from "../transporte/Ingresos/ProgramacionMula/TransporteProgramacionMula"
import TransporteProgramacionMulaRegistros from "../transporte/registros/TransporteProgramacionMula/TransporteProgramacionMulaRegistros"
import FormularioMulas from "../transporte/Ingresos/inspeccionMulas/FormularioMulas"
import TransporteRegistroInspeccionMulas from "../transporte/registros/inspeccionMulas/TransporteRegistroInspeccionMulas"
import TransporteDocumentacionProgramacionMula from "../transporte/documentacion/documentacionProgramacionMulas/TransporteDocumentacionProgramacionMula"
import SistemaFormulariosCrearInformeProveedor from "../sistema/formatoInformeProveedor/SistemaFormulariosCrearInformeProveedor"
import RegistroFrutaDescompuesta from "../inventarioYlogistica/historiales/registrosFrutaDescompuesta/RegistroFrutaDescompuesta"
import InfoActualizacion from "../utils/InfoActualizacion"
import RegistrosEficienciaOperativa from "../indicadores/operaciones/RegistrosEficienciaOperativa/RegistrosEficienciaOperativa"
import ShowIndicadores from "../indicadores/operaciones/ShowindIcadores/ShowIndicadores"


type propsType = {
    section: string[][] | undefined
    widthBar: number
    pestañaActiva: string | undefined
    version: string
}
export default function Ventana(props: propsType): JSX.Element {
    const [activas, setActivas] = useState<string[]>()
    useEffect(() => {
        if (props.section !== undefined) {
            const ventanas = props.section.map(item => item[0]);
            setActivas(ventanas)
        }
    }, [props.section])
    return (
        <>
            {activas === undefined ?
                <div className="ventana-main">
                    <div className="componentContainer">
                        <InfoActualizacion version={props.version} />
                    </div>

                </div>
                :
                <div className="ventana-main">
                    {/* Inventario y logistica */}
                    {/* ingreso */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66fe277549ed0672a901e" ? 'block' : 'none' }}>
                        {activas.includes("66b66fe277549ed0672a901e") && <IngresoFruta />}
                    </div>
                    {/* inventrario */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66e8d77549ed0672a9015" ? 'block' : 'none' }}>
                        {activas.includes("66b66e8d77549ed0672a9015") && <InventarioFrutaSinProcesar />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66ece77549ed0672a9018" ? 'block' : 'none' }}>
                        {activas.includes("66b66ece77549ed0672a9018") && <OrdenDeVaceo />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66eb677549ed0672a9017" ? 'block' : 'none' }}>
                        {activas.includes("66b66eb677549ed0672a9017") && <Desverdizado />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66ee777549ed0672a9019" ? 'block' : 'none' }}>
                        {activas.includes("66b66ee777549ed0672a9019") && <ReprocesoDescarte />}
                    </div>
                    {/* historiales */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66f1077549ed0672a901a" ? 'block' : 'none' }}>
                        {activas.includes("66b66f1077549ed0672a901a") && <HistorialProcesado />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66f1b77549ed0672a901b" ? 'block' : 'none' }}>
                        {activas.includes("66b66f1b77549ed0672a901b") && <HistorialDirectoNacional />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66f2377549ed0672a901c" ? 'block' : 'none' }}>
                        {activas.includes("66b66f2377549ed0672a901c") && <Lotes />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66f3077549ed0672a901d" ? 'block' : 'none' }}>
                        {activas.includes("66b66f3077549ed0672a901d") && <HistorialIngresoFruta />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66bd248bb1d612b0ec3b4bb9" ? 'block' : 'none' }}>
                        {activas.includes("66bd248bb1d612b0ec3b4bb9") && <HistorialDespachoDescartes />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66e06dff4440112c276a5bbb" ? 'block' : 'none' }}>
                        {activas.includes("66e06dff4440112c276a5bbb") && <HistorialListaEmpaque />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66e84c5e9ac43480493de0f1" ? 'block' : 'none' }}>
                        {activas.includes("66e84c5e9ac43480493de0f1") && <Contenedores />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6740a7bc8e9713e210a04894" ? 'block' : 'none' }}>
                        {activas.includes("6740a7bc8e9713e210a04894") && <HistorialEsperaDescargue />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6740fb4f8e9713e210a0489a" ? 'block' : 'none' }}>
                        {activas.includes("6740fb4f8e9713e210a0489a") && <HistorialEnInventarioFrutaSinProcesar />}
                    </div>
                    {/* programacion contenedores */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66c5ee45d07e71f7d36597ee" ? 'block' : 'none' }}>
                        {activas.includes("66c5ee45d07e71f7d36597ee") && <ProgramacionContenedores />}
                    </div>
                    {/* insumos */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66d8898a4c996e1a41c27ecb" ? 'block' : 'none' }}>
                        {activas.includes("66d8898a4c996e1a41c27ecb") && <IngresoTipoInsumo />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66db296f3d43194ad7a7f2b2" ? 'block' : 'none' }}>
                        {activas.includes("66db296f3d43194ad7a7f2b2") && <IngresoInsumoContenedor />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6769612fcf68f45e6bfe625a" ? 'block' : 'none' }}>
                        {activas.includes("6769612fcf68f45e6bfe625a") && <RegistroFrutaDescompuesta />}
                    </div>

                    {/* Calidad */}
                    {/* historial */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66ff077549ed0672a901f" ? 'block' : 'none' }}>
                        {activas.includes("66b66ff077549ed0672a901f") && <HistorialCalidadInterna />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b66ff977549ed0672a9020" ? 'block' : 'none' }}>
                        {activas.includes("66b66ff977549ed0672a9020") && <HistorialClasificacionCalidad />}
                    </div>
                    {/* informes */}

                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6700677549ed0672a9021" ? 'block' : 'none' }}>
                        {activas.includes("66b6700677549ed0672a9021") && <Informes />}
                    </div>
                    {/* ingreso */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6701177549ed0672a9022" ? 'block' : 'none' }}>
                        {activas.includes("66b6701177549ed0672a9022") && <IngresoClasificacionCalidad />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6701977549ed0672a9023" ? 'block' : 'none' }}>
                        {activas.includes("66b6701977549ed0672a9023") && <CalidadInterna />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66bfb3cc81ff0fb8705bb0d4" ? 'block' : 'none' }}>
                        {activas.includes("66bfb3cc81ff0fb8705bb0d4") && <IngresoVolanteCalidad />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66c5130bb51eef12da89050e" ? 'block' : 'none' }}>
                        {activas.includes("66c5130bb51eef12da89050e") && <IngresoHigienePersonal />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66c794bc1389de72f33cc6b7" ? 'block' : 'none' }}>
                        {activas.includes("66c794bc1389de72f33cc6b7") && <InspeccionIngresoFruta />}
                    </div>
                    {/* formularios */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66c4a508b51eef12da890504" ? 'block' : 'none' }}>
                        {activas.includes("66c4a508b51eef12da890504") && <VolanteCalidad />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66c52193b51eef12da890513" ? 'block' : 'none' }}>
                        {activas.includes("66c52193b51eef12da890513") && <HigienePersonal />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66f71432e65bccbdaf8bb627" ? 'block' : 'none' }}>
                        {activas.includes("66f71432e65bccbdaf8bb627") && <CreacionFormulariosCalidad />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66f8228c2d9d7eec9ff11d51" ? 'block' : 'none' }}>
                        {activas.includes("66f8228c2d9d7eec9ff11d51") && <IngresarLimpiezaDiaria />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66fd81aadd5f88524b9d0b27" ? 'block' : 'none' }}>
                        {activas.includes("66fd81aadd5f88524b9d0b27") && <LimpiezaDiaria />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66feb38338a347aa97a5dbd0" ? 'block' : 'none' }}>
                        {activas.includes("66feb38338a347aa97a5dbd0") && <LimpiezaMensual />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66feb92b38a347aa97a5dbd2" ? 'block' : 'none' }}>
                        {activas.includes("66feb92b38a347aa97a5dbd2") && <ControlPlagas />}
                    </div>


                    {/* Gestion de cuentas */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670e977549ed0672a9033" ? 'block' : 'none' }}>
                        {activas.includes("66b670e977549ed0672a9033") && <Cuentas />}
                    </div>                    {/* // {activas.includes("Gestión de Cuentas//Opera)rios//Operarios" && <Operario />} */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670e077549ed0672a9032" ? 'block' : 'none' }}>
                        {activas.includes('66b670e077549ed0672a9032') && <Cargos />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "MiCuenta" ? 'block' : 'none' }}>
                        {activas.includes('MiCuenta') && <MiCuenta />}
                    </div>
                    {/* Transporte */}

                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66fc79f53f566460b7a34994" ? 'block' : 'none' }}>
                        {activas.includes('66fc79f53f566460b7a34994') && <FormularioMulas />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "67487597e297c515615415df" ? 'block' : 'none' }}>
                        {activas.includes('67487597e297c515615415df') && <TransporteExportacionIngresoData />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "67489905e297c515615415e8" ? 'block' : 'none' }}>
                        {activas.includes('67489905e297c515615415e8') && <TransporteExportacionRegistros />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66cc8a24faeed9f06595f551" ? 'block' : 'none' }}>
                        {activas.includes('66cc8a24faeed9f06595f551') && <TransporteProgramacionMula />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6748df7ae297c515615415e9" ? 'block' : 'none' }}>
                        {activas.includes('6748df7ae297c515615415e9') && <TransporteProgramacionMulaRegistros />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6749d4535a6f3f420f703738" ? 'block' : 'none' }}>
                        {activas.includes('6749d4535a6f3f420f703738') && <TransporteRegistroInspeccionMulas />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "674a223e5a6f3f420f70373c" ? 'block' : 'none' }}>
                        {activas.includes('674a223e5a6f3f420f70373c') && <TransporteDocumentacionProgramacionMula />}
                    </div>

                    {/* Sistema */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6702977549ed0672a9024" ? 'block' : 'none' }}>
                        {activas.includes('66b6702977549ed0672a9024') && <HabilitarPrediosProceso />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66edad8cdb2f266ea4878b1e" ? 'block' : 'none' }}>
                        {activas.includes('66edad8cdb2f266ea4878b1e') && <PanelControlProceso />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6750c3f83a6cf23bfef7d1b7" ? 'block' : 'none' }}>
                        {activas.includes('6750c3f83a6cf23bfef7d1b7') && <SistemaFormulariosCrearInformeProveedor />}
                    </div>

                    {/* indicadores */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6704777549ed0672a9025" ? 'block' : 'none' }}>
                        {activas.includes('66b6704777549ed0672a9025') && <EficienciaFruta widthBar={props.widthBar} />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "678542ef3a942eb3a4e562e4" ? 'block' : 'none' }}>
                        {activas.includes('678542ef3a942eb3a4e562e4') && <RegistrosEficienciaOperativa  />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6793dfb319615dcbaf5b7a47" ? 'block' : 'none' }}>
                        {activas.includes('6793dfb319615dcbaf5b7a47') && <ShowIndicadores  />}
                    </div>

                    {/* Comercial */}
                    {/* precios */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670a777549ed0672a902d" ? 'block' : 'none' }}>
                        {activas.includes('66b670a777549ed0672a902d') && <PrecioLimon />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670b077549ed0672a902e" ? 'block' : 'none' }}>
                        {activas.includes('66b670b077549ed0672a902e') && <PrecioNaranja />}
                    </div>
                    {/* Contenedores */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670d677549ed0672a9031" ? 'block' : 'none' }}>
                        {activas.includes("66b670d677549ed0672a9031") && <CrearContenedor />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670c077549ed0672a902f" ? 'block' : 'none' }}>
                        {activas.includes("66b670c077549ed0672a902f") && <Clientes />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b670ca77549ed0672a9030" ? 'block' : 'none' }}>
                        {activas.includes("66b670ca77549ed0672a9030") && <Proveedores />}
                    </div>
                    {/* proceso */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6706477549ed0672a9027" ? 'block' : 'none' }}>
                        {activas.includes('66b6706477549ed0672a9027') && <DescarteLavadoSistema />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6706e77549ed0672a9028" ? 'block' : 'none' }}>
                        {activas.includes('66b6706e77549ed0672a9028') && <DescarteEnceradoSistema />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6707777549ed0672a9029" ? 'block' : 'none' }}>
                        {activas.includes('66b6707777549ed0672a9029') && <ProcesoListaEmpaque />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6708677549ed0672a902a" ? 'block' : 'none' }}>
                        {activas.includes('66b6708677549ed0672a902a') && <HistorialIngresoDescarteLavado />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6708f77549ed0672a902b" ? 'block' : 'none' }}>
                        {activas.includes('66b6708f77549ed0672a902b') && <HistorialIngresoDescarteEncerado />}
                    </div>
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "66b6705a77549ed0672a9026" ? 'block' : 'none' }}>
                        {activas.includes('66b6705a77549ed0672a9026') && <ProcesoFotosCalidad />}
                    </div>

                    {/* contabilidad */}
                    <div className="componentContainer" style={{ display: props.pestañaActiva === "6720ec07f716c8c77cb3446d" ? 'block' : 'none' }}>
                        {activas.includes('6720ec07f716c8c77cb3446d') && <InformesProveedorContabilidad />}
                    </div>
                </div>
            }
        </>
    )
}