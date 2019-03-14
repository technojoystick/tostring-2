const num = [];

const a  = (int) => {
	let intP = parseInt(int);
	if (intP < 2) {
		num.push(intP);
		return;
	}
	const digit = intP % 2;
	num.push(digit);
	a(intP / 2);
}

const b = (int) => {
	a(int);
	console.log(num);
}
