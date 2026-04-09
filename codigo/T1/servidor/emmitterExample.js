import { EventEmitter } from "react";

const emisor = new EventEmitter();

emisor.on('miEvento', (mensaje) => {console.log('Evento recibido:', mensaje);});
emisor.emit('miEvento', '¡Hola, este es un mensaje desde el emisor de eventos!');