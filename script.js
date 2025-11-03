// Manejar el formulario
document.getElementById('fileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateCustomFile();
});

// Generar archivo personalizado
function generateCustomFile() {
    const fileName = document.getElementById('fileName').value;
    const fileType = document.getElementById('fileType').value;
    const content = document.getElementById('content').value || 'Contenido generado automáticamente';
    
    let finalContent = content;
    let mimeType = 'text/plain';
    let extension = '.txt';
    
    // Configurar según el tipo de archivo
    switch(fileType) {
        case 'json':
            try {
                // Intentar parsear como JSON si es válido
                const jsonData = content ? JSON.parse(content) : { 
                    mensaje: "Archivo JSON generado automáticamente",
                    fecha: new Date().toISOString()
                };
                finalContent = JSON.stringify(jsonData, null, 2);
                mimeType = 'application/json';
                extension = '.json';
            } catch (e) {
                // Si no es JSON válido, crear uno por defecto
                finalContent = JSON.stringify({
                    mensaje: "Archivo JSON generado automáticamente",
                    contenido: content,
                    fecha: new Date().toISOString()
                }, null, 2);
                mimeType = 'application/json';
                extension = '.json';
            }
            break;
            
        case 'csv':
            if (!content.includes(',')) {
                // Si no parece CSV, crear uno de ejemplo
                finalContent = 'Nombre,Edad,Ciudad\nJuan,25,Madrid\nMaría,30,Barcelona';
            } else {
                finalContent = content;
            }
            mimeType = 'text/csv';
            extension = '.csv';
            break;
            
        case 'html':
            finalContent = `<!DOCTYPE html>
<html>
<head>
    <title>${fileName}</title>
</head>
<body>
    <h1>${fileName}</h1>
    <div>${content.replace(/\n/g, '<br>')}</div>
    <p><em>Generado el ${new Date().toLocaleString()}</em></p>
</body>
</html>`;
            mimeType = 'text/html';
            extension = '.html';
            break;
            
        default: // txt
            mimeType = 'text/plain';
            extension = '.txt';
    }
    
    // Crear y descargar archivo
    const blob = new Blob([finalContent], { type: mimeType });
    downloadFile(blob, fileName + extension);
    
    // Mostrar feedback
    alert(`✅ Archivo "${fileName + extension}" generado exitosamente!`);
}

// Descargar archivos de ejemplo
function downloadSample(type) {
    let content, fileName, mimeType;
    
    switch(type) {
        case 'txt':
            content = `Este es un archivo de texto de ejemplo.
            
Generado automáticamente el: ${new Date().toLocaleString()}

Puedes usar este generador para crear:
• Documentos de texto
• Notas
• Configuraciones
• Y mucho más!`;
            fileName = 'ejemplo.txt';
            mimeType = 'text/plain';
            break;
            
        case 'json':
            content = JSON.stringify({
                proyecto: "Generador de Archivos",
                version: "1.0",
                fecha: new Date().toISOString(),
                datos: {
                    usuarios: ["Ana", "Carlos", "Elena"],
                    configuraciones: {
                        tema: "oscuro",
                        idioma: "es"
                    }
                },
                activo: true
            }, null, 2);
            fileName = 'ejemplo.json';
            mimeType = 'application/json';
            break;
            
        case 'csv':
            content = `Producto,Precio,Cantidad,Disponible
Laptop,999.99,50,true
Mouse,25.50,100,true
Teclado,75.00,30,true
Monitor,299.99,25,false`;
            fileName = 'ejemplo.csv';
            mimeType = 'text/csv';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    downloadFile(blob, fileName);
}

// Función universal para descargar
function downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}