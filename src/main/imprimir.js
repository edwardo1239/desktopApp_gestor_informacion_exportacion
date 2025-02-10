/* eslint-disable prettier/prettier */
const edge = require('electron-edge-js')

var about
var openport
var sendcommand
var clearbuffer
var printerfont
var barcode
var printlabel
var closeport
var printer_status
var sendcommand_utf8
var sendcommand_binary
var windowsfont
var formfeed
var nobackfeed
var setup

try {
  openport = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'openport'
  })
} catch (error) {
  console.log(error)
}

try {
  setup = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'setup'
  })
} catch (error) {
  console.log(error)
}
try {
  formfeed = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'formfeed'
  })
} catch (error) {
  console.log(error)
}

try {
  nobackfeed = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'nobackfeed'
  })
} catch (error) {
  console.log(error)
}

try {
  about = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'about'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand'
  })
} catch (error) {
  console.log(error)
}

try {
  clearbuffer = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'clearbuffer'
  })
} catch (error) {
  console.log(error)
}

try {
  printerfont = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'printerfont'
  })
} catch (error) {
  console.log(error)
}

try {
  barcode = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'barcode'
  })
} catch (error) {
  console.log(error)
}

try {
  printlabel = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'printlabel'
  })
} catch (error) {
  console.log(error)
}

try {
  closeport = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'closeport'
  })
} catch (error) {
  console.log(error)
}

try {
  printer_status = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'printerstatus_string'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand_utf8 = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand_utf8'
  })
} catch (error) {
  console.log(error)
}

try {
  sendcommand_binary = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'sendcommand_binary'
  })
} catch (error) {
  console.log(error)
}

console.log(__dirname)
try {
  windowsfont = edge.func({
    assemblyFile: './resources/app.asar.unpacked/tsclibnet.dll',
    typeName: 'TSCSDK.node_usb',
    methodName: 'windowsfont'
  })
} catch (error) {
  console.log(error)
}

var country_from = {
  x: '20',
  y: '40',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'PRODUCT OF COLOMBIA'
}
const destino = {
  x: '20',
  y: '60',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'DESTINATION:'
}
const product = {
  x: '20',
  y: '80',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'PRODUCT: ACID LIME TAHITI (Citrus latifolla)'
}
const pesoNeto_label = {
  x: '500',
  y: '80',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'NET WEIGHT: '
}
const pesoTotal_label = {
  x: '500',
  y: '100',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'GROSS WEIGHT: '
}
const client_code = {
  x: '20',
  y: '100',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'CLIENT CODE: '
}
const farm_code = {
  x: '20',
  y: '120',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'FARM CODE: '
}
const ICA_code = {
  x: '20',
  y: '140',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'FARM ICA CODE: '
}
const GGN_code = {
  x: '20',
  y: '160',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'GGN: '
}
const CoC_code = {
  x: '20',
  y: '180',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'CoC: '
}
const cont_ef1 = {
  x: '20',
  y: '200',
  fonttype: '1',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: ''
}
const cliente = {
  x: '100',
  y: '260',
  fonttype: '2',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: ''
}
const clienteID = {
  x: '100',
  y: '280',
  fonttype: '2',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'ID: '
}
const clienteTelefono = {
  x: '100',
  y: '300',
  fonttype: '2',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: 'CELL PHONE: '
}
const clienteCorreo = {
  x: '100',
  y: '320',
  fonttype: '2',
  rotation: '0',
  xmul: '1',
  ymul: '1',
  text: ''
}

var label_variable = { quantity: '1', copy: '1' }

const label_setup = {
  width: '100',
  height: '49',
  speed: '5',
  density: '8',
  sensor: '0',
  vertical: '4',
  offset: '1'
}

let pesoNeto
let pesoTotal

process.parentPort.once('message', (e) => {

  destino.text = destino.text + e.data.destino
  client_code.text = client_code.text + e.data.codigoCliente
  farm_code.text = farm_code.text + e.data.codigoPredio
  ICA_code.text = ICA_code.text + e.data.codigoICA
  cliente.text = e.data.cliente
  clienteID.text = clienteID.text + e.data.clienteID
  clienteTelefono.text =  clienteTelefono.text + e.data.telefono
  clienteCorreo.text =  e.data.correo
  label_variable.copy = String(e.data.cajas)
  cont_ef1.text = e.data.contenedor + '- ' + e.data.ef1

  if (e.data.codigoGGN === undefined) {
    GGN_code.text = GGN_code.text + 'N/A'
  } else {
    GGN_code.text = GGN_code.text + e.data.codigoGGN
  }
  if (e.data.codigoCoC === undefined) {
    CoC_code.text = CoC_code.text + 'N/A'
  } else {
    CoC_code.text = CoC_code.text + e.data.codigoGGN
  }
  if(e.data.tipoFruta === 'Naranja'){
    product.text = 'PRODUCT: ORANGE (CITRUS SINESIS)'
  }

  switch (e.data.tipoCaja) {
    case "G-37":
    case "B-37":
      pesoNeto = '16'
      pesoTotal = '17'
      break;
    case "G-4.5":
      pesoNeto = '4.5'
      pesoTotal = '4.8'
      break;
    case "B-30":
    case "G-30":
      pesoNeto = '13'
      pesoTotal = '14'
      break;
    case "B-40":
    case "G-40":
      pesoNeto = '18'
      pesoTotal = '19'
      break
    }

    pesoNeto_label.text = pesoNeto_label.text + pesoNeto;
    pesoTotal_label.text = pesoTotal_label.text + pesoTotal;
  openport('TSC TE200', true)

  setup(label_setup, true)

  clearbuffer('', true)

  sendcommand('BAR 15, 20, 800,2')
  sendcommand('BAR 15, 230, 800,2')
  printerfont(country_from, true)
  printerfont(destino, true)
  printerfont(product, true)
  printerfont(pesoNeto_label, true)
  printerfont(pesoTotal_label, true)
  printerfont(client_code, true)
  printerfont(farm_code, true)
  printerfont(ICA_code, true)
  printerfont(GGN_code, true)
  printerfont(CoC_code, true)
  printerfont(cont_ef1, true)
  printerfont(cliente, true)
  printerfont(clienteID, true)
  printerfont(clienteTelefono, true)
  printerfont(clienteCorreo, true)
  printlabel(label_variable, true)


  closeport('', true)
})
