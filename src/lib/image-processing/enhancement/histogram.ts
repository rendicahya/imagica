export interface Histogram {
	red: number[];
	green: number[];
	blue: number[];
	gray: number[];
}

export function computeHistogram(imageData: ImageData): Histogram {
	const red = new Array(256).fill(0);
	const green = new Array(256).fill(0);
	const blue = new Array(256).fill(0);
	const gray = new Array(256).fill(0);

	const { data } = imageData;

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];

		red[r]++;
		green[g]++;
		blue[b]++;
		gray[Math.round(0.299 * r + 0.587 * g + 0.114 * b)]++;
	}

	return { red, green, blue, gray };
}

// Tints pixels whose grayscale intensity falls in [min, max] and dims the rest, for range selection feedback.
export function highlightRange(imageData: ImageData, min: number, max: number): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	for (let i = 0; i < out.data.length; i += 4) {
		const gray = Math.round(
			0.299 * out.data[i] + 0.587 * out.data[i + 1] + 0.114 * out.data[i + 2]
		);
		const inRange = gray >= min && gray <= max;

		if (!inRange) {
			out.data[i] = out.data[i] * 0.2;
			out.data[i + 1] = out.data[i + 1] * 0.2;
			out.data[i + 2] = out.data[i + 2] * 0.2;
		}
	}

	return out;
}
