const thousands = (value) => {
	return new Intl.NumberFormat("id-ID").format(value);
};

module.exports = thousands;
