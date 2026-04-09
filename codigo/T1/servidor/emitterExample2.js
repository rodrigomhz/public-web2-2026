import {EventEmitter} from 'events';

const emisor = new EventEmitter();

async function esperarEvento() {
    console.log('Esperando evento...');
    const [mensaje] = await once (emisor, 'saludo');
    console.log('Evento recibido:', mensaje);
}

esperarEvento();
setTimeout(() =>emisor.emit('saludo', '¡Hola desde el emisor de eventos!'), 2000);
console.log('Fin del hilo sincrono.');