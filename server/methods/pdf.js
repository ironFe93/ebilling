/* const pdfmake = require('pdfmake');

exports.getDocDefinition = (bill) => {

	return docDefinition = {
		content: [
			{ text: 'THIS IS THE FIRST LINE TEXT', style: 'header' },
			{ text: 'this is the second line text', alignment: 'center' },
			{ text: `Receipt number: ${bill.cod}`, alignment: 'right' }
		]
	}
};

exports.getPDF = (docDefinition) => {
	return pdfmake.createPdfKitDocument(docDefinition);
}

 */