const { jsPDF } = require("jspdf");
const { autoTable } = require("jspdf-autotable");
const thousands = require("./thousands");

const printToPdf = (carts) => {
	const doc = new jsPDF();
	let total = 0;
	const header = [["No", "Name", "Qty", "Price", "Total"]];
	const data = [];
	carts.forEach((cart, i) => {
		const subTotalItem = cart.quantity * cart.Product.price;
		total += subTotalItem;
		data.push([
			i + 1,
			cart.Product.name.toUpperCase(),
			cart.quantity,
			thousands(cart.Product.price),
			thousands(subTotalItem),
		]);
	});
	data.push(["GRAND TOTAL", "", "", "", thousands(total)]);
	doc.autoTable({
		head: header,
		body: data,
		startY: 40,
	});
	doc.text(
		10,
		10,
		`
        CHECKOUT SUMMARY
    `
	);
	return doc.output();
};

module.exports = printToPdf;
