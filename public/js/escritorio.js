
//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');//buscamos la primera clase alert

const searchParams = new URLSearchParams(window.location.search); //capturar los parametros de la url

if (!searchParams.has('escritorio')) {
    window.location = 'index.html'; //redirecciona al index.html
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false; //habilitado
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    // lblNuevoTicket.innerText = 'Ticket ' + ultimo;
});

btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ ok, ticket, msg }) => {

        //no tengo un ticket
        if (!ok) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }

        //tengo un ticket
        lblTicket.innerText = 'Ticket ' + ticket.numero;
    });

});


