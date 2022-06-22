const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero
        this.escritorio = escritorio
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate(); //numero del dia
        this.tickets = [];
        this.ultimos4 = [];

        this.init(); //llamamos el metodo para inicializar
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    //inicializar la clase
    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json');
        if (hoy === this.hoy) { //si son iguales los dias actualizamos las propiedades de la clase
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            //Es otro dia aqui
            this.guardarDB();
        }
    }

    guardarDB() {

        //generamos el json con el objeto que tenemos
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));

    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket); //agregamos el nuevo ticket al arreglo
        this.guardarDB(); //guardamos en la bd
        return 'Ticket ' + ticket.numero;

    }

    atenderTicket(escritorio) {
        //si no hay tickets
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); //eliminamos el primer elemento del arreglo
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket) //enviamos el elemento capturado al inicio del arreglo

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1) //.splice(ultima_posicion, cortamos 1 elemento)
        }

        this.guardarDB();
        return ticket;
    }

}

module.exports = TicketControl;