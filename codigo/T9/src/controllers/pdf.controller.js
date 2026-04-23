import PDFDocument from 'pdfkit'

export const sendSimplePDF = async (req, res) => {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="documento.pdf"');
    doc.pipe(res);
    doc.text('Algun texto en el PDF');
    doc.end();
}