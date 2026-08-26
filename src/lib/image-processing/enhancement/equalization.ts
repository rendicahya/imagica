import { toGrayscale } from '../core/pixel';

export interface EqualizationResult {
	histogram: number[];
	pdf: number[];
	cdf: number[];
	mapping: number[];
	image: ImageData;
}

export function equalizeHistogram(imageData: ImageData): EqualizationResult {
	const { width, height, data } = imageData;
	const totalPixels = width * height;
	const histogram = new Array(256).fill(0);

	for (let i = 0; i < data.length; i += 4) {
		histogram[toGrayscale(data[i], data[i + 1], data[i + 2])]++;
	}

	const pdf = histogram.map((count) => count / totalPixels);

	const cdf: number[] = [];
	let running = 0;
	for (const p of pdf) {
		running += p;
		cdf.push(running);
	}

	const mapping = cdf.map((c) => Math.round(c * 255));

	const out = new ImageData(width, height);
	for (let i = 0; i < data.length; i += 4) {
		const gray = toGrayscale(data[i], data[i + 1], data[i + 2]);
		const value = mapping[gray];
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return { histogram, pdf, cdf, mapping, image: out };
}
