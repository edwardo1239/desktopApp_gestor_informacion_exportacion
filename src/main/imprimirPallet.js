/* eslint-disable prettier/prettier */
"use strict";
const edge = require("electron-edge-js");
var about;
var openport;
var sendcommand;
var clearbuffer;
var printerfont;
var barcode;
var printlabel;
var closeport;
var printer_status;
var sendcommand_utf8;
var sendcommand_binary;
var windowsfont;
var formfeed;
var nobackfeed;
var setup;
try {
  openport = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "openport"
  });
} catch (error) {
  console.log(error);
}
try {
  setup = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "setup"
  });
} catch (error) {
  console.log(error);
}
try {
  formfeed = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "formfeed"
  });
} catch (error) {
  console.log(error);
}
try {
  nobackfeed = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "nobackfeed"
  });
} catch (error) {
  console.log(error);
}
try {
  about = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "about"
  });
} catch (error) {
  console.log(error);
}
try {
  sendcommand = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand"
  });
} catch (error) {
  console.log(error);
}
try {
  clearbuffer = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "clearbuffer"
  });
} catch (error) {
  console.log(error);
}
try {
  printerfont = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printerfont"
  });
} catch (error) {
  console.log(error);
}
try {
  barcode = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "barcode"
  });
} catch (error) {
  console.log(error);
}
try {
  printlabel = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printlabel"
  });
} catch (error) {
  console.log(error);
}
try {
  closeport = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "closeport"
  });
} catch (error) {
  console.log(error);
}
try {
  printer_status = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "printerstatus_string"
  });
} catch (error) {
  console.log(error);
}
try {
  sendcommand_utf8 = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand_utf8"
  });
} catch (error) {
  console.log(error);
}
try {
  sendcommand_binary = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "sendcommand_binary"
  });
} catch (error) {
  console.log(error);
}
try {
  windowsfont = edge.func({
    assemblyFile: "./tsclibnet.dll",
    typeName: "TSCSDK.node_usb",
    methodName: "windowsfont"
  });
} catch (error) {
  console.log(error);
}
// var pallet = {
//   x: "20",
//   y: "40",
//   fonttype: "10",
//   rotation: "0",
//   xmul: "1",
//   ymul: "1",
//   text: ""
// };

var label_variable = { quantity: "1", copy: "1" };
const label_setup = {
  width: "100",
  height: "100",
  speed: "5",
  density: "8",
  sensor: "0",
  vertical: "4",
  offset: "1"
};

var pallet = {
  x: 10,
  y: 25,
  fontheight: 220,
  rotation: 0,
  fontstyle: 2,
  fontunderline: 0,
  szFaceName: "Arial",
  content: "PALLET",
};

var pallet1 = {
  x: 10,
  y: 200,
  fontheight: 400,
  rotation: 0,
  fontstyle: 2,
  fontunderline: 0,
  szFaceName: "Arial",
  content: "",
};
var pallet2 = {
  x: 400,
  y: 200,
  fontheight: 400,
  rotation: 0,
  fontstyle: 2,
  fontunderline: 0,
  szFaceName: "Arial",
  content: "",
};
process.parentPort.once("message", (e) => {

  pallet1.content = e.data.pallet
  pallet2.content = e.data.pallet
  openport("TSC TE200", true);
  setup(label_setup, true);
  clearbuffer('', true)

  windowsfont(pallet, true);
  windowsfont(pallet1, true);
  windowsfont(pallet2, true);
  printlabel(label_variable, true);

  closeport("", true);
});
