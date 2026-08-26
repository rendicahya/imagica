export type GrayscaleMethod = 'average' | 'lightness' | 'luminosity' | 'custom';

export interface CustomGrayscaleWeights {
	a: number;
	b: number;
	c: number;
}

export function grayscaleValue(
	r: number,
	g: number,
	b: number,
	method: GrayscaleMethod,
	weights?: CustomGrayscaleWeights
): number {
	switch (method) {
		case 'average':
			return Math.round((r + g + b) / 3);
		case 'lightness':
			return Math.round((Math.max(r, g, b) + Math.min(r, g, b)) / 2);
		case 'luminosity':
			return Math.round(0.21 * r + 0.72 * g + 0.07 * b);
		case 'custom': {
			const w = weights ?? { a: 0.33, b: 0.33, c: 0.34 };
			return Math.min(255, Math.max(0, Math.round(w.a * r + w.b * g + w.c * b)));
		}
	}
}

export function toGrayscaleImage(
	imageData: ImageData,
	method: GrayscaleMethod,
	weights?: CustomGrayscaleWeights
): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	for (let i = 0; i < out.data.length; i += 4) {
		const gray = grayscaleValue(out.data[i], out.data[i + 1], out.data[i + 2], method, weights);
		out.data[i] = gray;
		out.data[i + 1] = gray;
		out.data[i + 2] = gray;
	}

	return out;
}
