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
    const filas = document.querySelectorAll('#stockTable tr');

    filas.forEach(fila => {
        const stock = parseFloat(fila.querySelector('input[id^="stock"]').value) || 0;
        const pedido = parseFloat(fila.querySelector('input[id^="pedido"]').value) || 0;
        const consumo = parseFloat(fila.querySelector('input[id^="consumo"]').value) || 0;

        // Cálculo del total (puedes ajustar la fórmula si es necesario)
        const total = stock + pedido - consumo;

        // Actualizar el campo del total
        fila.querySelector('.total').innerText = total;
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

    // Añadir detalles generales con separación
    doc.setFontSize(12);
    doc.text(`Sector de Solicitud: ${sector}`, 20, 30); 
    doc.text(`Responsable: ${responsable}`, 20, 40); 
    doc.text(`Fecha: ${fecha}`, 20, 50);

    let yPosition = 70; // Posición vertical inicial para la tabla

    // Dibujar una línea de separación más destacada entre el encabezado y la tabla
    doc.setLineWidth(1.5);
    doc.line(10, yPosition - 5, 200, yPosition - 5); 

    // Función para dibujar la tabla en el PDF, incluyendo los nuevos ítems
    function dibujarTablaBebidas(filas) {
        if (filas.length === 0) return;
    
        doc.setFontSize(10);
        doc.text('Bebida', 20, yPosition);
        doc.text('Stock', 80, yPosition); 
        doc.text('Pedido', 105, yPosition); 
        doc.text('Consumo', 125, yPosition); 
        doc.text('Total', 145, yPosition); 
    
        yPosition += 6;
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition); 
        yPosition += 6;
    
        filas.forEach(fila => {
            // Verificar si existe el input para el nombre de la bebida
            const bebidaInputElement = fila.querySelector('td:nth-child(1) input');
            const bebidaInput = bebidaInputElement ? bebidaInputElement.value : fila.querySelector('td:nth-child(1)').innerText;
    
            const stockInput = fila.querySelector('input[type="number"][id^="stock"]')?.value || 0;
            const pedidoInput = fila.querySelector('input[type="number"][id^="pedido"]')?.value || 0;
            const consumoInput = fila.querySelector('input[type="number"][id^="consumo"]')?.value || 0;
            const totalCell = fila.querySelector('.total')?.innerText || 0;
    
            // Si alguno de los campos no existe, saltamos esta fila
            if (!bebidaInput) return;
    
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
    
            doc.text(bebidaInput, 20, yPosition); 
            doc.text(stockInput.toString(), 80, yPosition); 
            doc.text(pedidoInput.toString(), 105, yPosition); 
            doc.text(consumoInput.toString(), 125, yPosition); 
            doc.text(totalCell.toString(), 145, yPosition); 
    
            yPosition += 8;
        });
    }
    

    // Obtener todas las filas de la tabla, incluidas las filas agregadas dinámicamente
    const filas = document.querySelectorAll('#stockTable tr'); 
    dibujarTablaBebidas(filas);

    // Guardar el PDF
    doc.save('Solicitud_Bebidas.pdf');
}

function agregarItem() {
    const tabla = document.getElementById('stockTable');
    const rowCount = tabla.rows.length + 1;

    // Crear una nueva fila
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td><input type="text" id="bebida${rowCount}" placeholder="Nueva bebida"></td>
        <td><input type="number" id="stock${rowCount}" value="0"></td>
        <td><input type="number" id="pedido${rowCount}" value="0"></td>
        <td><input type="number" id="consumo${rowCount}" value="0"></td>
        <td class="total" id="total${rowCount}">0</td>
    `;

    // Añadir la nueva fila a la tabla
    tabla.appendChild(nuevaFila);

    // Añadir event listeners para actualizar cálculos
    document.getElementById(`stock${rowCount}`).addEventListener('input', calcularTotal);
    document.getElementById(`pedido${rowCount}`).addEventListener('input', calcularTotal);
    document.getElementById(`consumo${rowCount}`).addEventListener('input', calcularTotal);
}


function solicitarPedido() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener los detalles ingresados
    const sector = document.getElementById('sector').value || 'No especificado';
    const responsable = document.getElementById('responsable').value || 'No especificado';
    const fecha = document.getElementById('fecha').value || 'No especificada';

    // Añadir título principal
    doc.setFontSize(18);
    doc.text('Solicitud de Pedido', 105, 15, null, null, 'center');

    // Añadir detalles generales
    doc.setFontSize(12);
    doc.text(`Sector: ${sector}`, 20, 30); 
    doc.text(`Responsable: ${responsable}`, 20, 40); 
    doc.text(`Fecha: ${fecha}`, 20, 50);

    let yPosition = 70; 

    // Dibujar encabezado de la tabla (stock inicial y pedido)
    doc.setFontSize(10);
    doc.text('Bebida', 20, yPosition);
    doc.text('Stock Inicial', 80, yPosition); 
    doc.text('Pedido', 120, yPosition);

    yPosition += 6;
    doc.line(20, yPosition, 190, yPosition); 
    yPosition += 6;

    // Obtener solo las filas de stock inicial y pedido
    const filas = document.querySelectorAll('#stockTable tr');
    filas.forEach(fila => {
        const bebida = fila.querySelector('td:nth-child(1)').innerText;
        const stock = fila.querySelector('input[type="number"][id^="stock"]').value || 0;
        const pedido = fila.querySelector('input[type="number"][id^="pedido"]').value || 0;

        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }

        doc.text(bebida, 20, yPosition); 
        doc.text(stock.toString(), 80, yPosition); 
        doc.text(pedido.toString(), 120, yPosition); 

        yPosition += 8;
    });

    // Guardar el PDF y enviar a WhatsApp
    doc.save('Solicitud_Pedido.pdf');
    enviarWhatsApp('Solicitud_Pedido.pdf');
}

function enviarResumenCierre() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener los detalles ingresados
    const sector = document.getElementById('sector').value || 'No especificado';
    const responsable = document.getElementById('responsable').value || 'No especificado';
    const fecha = document.getElementById('fecha').value || 'No especificada';

    // Añadir título principal
    doc.setFontSize(18);
    doc.text('Resumen de Cierre', 105, 15, null, null, 'center');

    // Añadir detalles generales
    doc.setFontSize(12);
    doc.text(`Sector: ${sector}`, 20, 30); 
    doc.text(`Responsable: ${responsable}`, 20, 40); 
    doc.text(`Fecha: ${fecha}`, 20, 50);

    let yPosition = 70; 

    // Dibujar la tabla completa
    doc.setFontSize(10);
    doc.text('Bebida', 20, yPosition);
    doc.text('Stock', 80, yPosition); 
    doc.text('Pedido', 100, yPosition); 
    doc.text('Consumo', 120, yPosition); 
    doc.text('Total', 145, yPosition);

    yPosition += 6;
    doc.line(20, yPosition, 190, yPosition); 
    yPosition += 6;

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll('#stockTable tr');
    filas.forEach(fila => {
        const bebida = fila.querySelector('td:nth-child(1)').innerText;
        const stock = fila.querySelector('input[type="number"][id^="stock"]').value || 0;
        const pedido = fila.querySelector('input[type="number"][id^="pedido"]').value || 0;
        const consumo = fila.querySelector('input[type="number"][id^="consumo"]').value || 0;
        const total = fila.querySelector('.total').innerText;

        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }

        doc.text(bebida, 20, yPosition); 
        doc.text(stock.toString(), 80, yPosition); 
        doc.text(pedido.toString(), 100, yPosition); 
        doc.text(consumo.toString(), 120, yPosition); 
        doc.text(total.toString(), 145, yPosition);

        yPosition += 8;
    });

    // Guardar el PDF y enviar a WhatsApp
    doc.save('Resumen_Cierre.pdf');
    enviarWhatsApp('Resumen_Cierre.pdf');
}

function enviarWhatsApp() {
    const archivoPDF = 'TuArchivo.pdf';  // Puedes pasar el archivo que generaste previamente

    // Comprobar si está disponible la aplicación de WhatsApp para Windows
    const isWindows = navigator.userAgent.includes('Win');
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isWindows) {
        // Intenta abrir la aplicación de WhatsApp en Windows
        const urlWhatsAppWindows = `whatsapp://send?text=${encodeURIComponent('Solicitud de pedido adjunta: ' + archivoPDF)}`;
        window.open(urlWhatsAppWindows);

    } else if (isMobile) {
        // Si está en un teléfono móvil (Android o iPhone)
        const urlWhatsAppMobile = `whatsapp://send?text=${encodeURIComponent('Solicitud de pedido adjunta: ' + archivoPDF)}`;
        window.open(urlWhatsAppMobile);

    } else {
        // Si no es Windows ni móvil, abre WhatsApp Web
        const urlWhatsAppWeb = `https://web.whatsapp.com/`;
        window.open(urlWhatsAppWeb);
    }
}
