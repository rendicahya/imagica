export function mse(a: ImageData, b: ImageData): number {
	let sum = 0;
	const n = a.data.length;

	for (let i = 0; i < n; i += 4) {
		for (let c = 0; c < 3; c++) {
			const diff = a.data[i + c] - b.data[i + c];
			sum += diff * diff;
		}
	}

	return sum / (a.width * a.height * 3);
}
