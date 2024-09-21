function mostrarBebidas(tipo) {
    const bebidasConAlcohol = document.querySelectorAll('.bebida-alcohol');
    const bebidasSinAlcohol = document.querySelectorAll('.bebida-sin-alcohol');
    
    if (tipo === 'conAlcohol') {
        bebidasConAlcohol.forEach(bebida => bebida.style.display = 'table-row');
        bebidasSinAlcohol.forEach(bebida => bebida.style.display = 'none');
    } else {
        bebidasSinAlcohol.forEach(bebida => bebida.style.display = 'table-row');
        bebidasConAlcohol.forEach(bebida => bebida.style.display = 'none');
    }
}

function calcularTotal() {
    // Calcular los totales para todas las bebidas
    const filas = document.querySelectorAll('#stockTable tr');
    filas.forEach((fila, index) => {
        const stock = parseFloat(fila.querySelector(`#stock${index + 1}`).value) || 0;
        const pedido = parseFloat(fila.querySelector(`#pedido${index + 1}`).value) || 0;
        const consumo = parseFloat(fila.querySelector(`#consumo${index + 1}`).value) || 0;
        const total = stock + pedido - consumo;
        fila.querySelector(`#total${index + 1}`).innerText = total;
    });
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener los detalles ingresados
    const sector = document.getElementById('sector').value || 'No especificado';
    const responsable = document.getElementById('responsable').value || 'No especificado';
    const fecha = document.getElementById('fecha').value || 'No especificada';

    // Añadir título principal
    doc.setFontSize(18);
    doc.text('Solicitud de Bebidas', 105, 15, null, null, 'center');

    // Añadir detalles generales
    doc.setFontSize(12);
    doc.text(`Sector de Solicitud: ${sector}`, 10, 30);
    doc.text(`Responsable: ${responsable}`, 10, 40);
    doc.text(`Fecha: ${fecha}`, 10, 50);

    // Función para dibujar una tabla para bebidas
    function dibujarTablaBebidas(filas, titulo, yInicial) {
        // Añadir título para la sección (Bebidas con o sin alcohol)
        doc.setFontSize(14);
        doc.text(titulo, 10, yInicial);

        // Dibujar encabezados de la tabla
        yInicial += 10;
        doc.setFontSize(12);
        doc.text('Bebida', 10, yInicial);
        doc.text('Stock', 60, yInicial);
        doc.text('Pedido', 85, yInicial);
        doc.text('Consumo', 115, yInicial);
        doc.text('Total', 145, yInicial);
        
        yInicial += 5;
        doc.line(10, yInicial, 200, yInicial); // Línea de separación

        // Iterar sobre las filas y agregar cada bebida a la tabla
        filas.forEach(fila => {
            const bebida = fila.cells[0].innerText;
            const stock = fila.cells[1].querySelector('input').value;
            const pedido = fila.cells[2].querySelector('input').value;
            const consumo = fila.cells[3].querySelector('input').value;
            const total = fila.cells[4].innerText;

            // Solo incluir si se ha ingresado algún dato
            if (stock > 0 || pedido > 0 || consumo > 0) {
                yInicial += 10;
                doc.text(bebida, 10, yInicial);
                doc.text(stock, 60, yInicial);
                doc.text(pedido, 85, yInicial);
                doc.text(consumo, 115, yInicial);
                doc.text(total, 145, yInicial);
            }
        });
    }

    // Bebidas con Alcohol
    let y = 60;
    const filasAlcohol = document.querySelectorAll('.bebida-alcohol');
    dibujarTablaBebidas(filasAlcohol, 'Bebidas con Alcohol', y);

    // Bebidas sin Alcohol
    y += (filasAlcohol.length * 10) + 30; // Ajustar la posición para la siguiente tabla
    const filasSinAlcohol = document.querySelectorAll('.bebida-sin-alcohol');
    dibujarTablaBebidas(filasSinAlcohol, 'Bebidas sin Alcohol', y);

    // Guardar el PDF
    doc.save('Solicitud_Bebidas.pdf');
}
