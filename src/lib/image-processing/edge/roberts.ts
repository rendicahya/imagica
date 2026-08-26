import { toGrayscale } from '../core/pixel';

export function roberts(imageData: ImageData): ImageData {
	const { width, height, data } = imageData;
	const gray = new Float32Array(width * height);

	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = toGrayscale(data[i], data[i + 1], data[i + 2]);
	}

	const magnitudes = new Float32Array(width * height);
	let maxMag = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const p00 = gray[y * width + x];
			const p11 = gray[Math.min(height - 1, y + 1) * width + Math.min(width - 1, x + 1)];
			const p01 = gray[y * width + Math.min(width - 1, x + 1)];
			const p10 = gray[Math.min(height - 1, y + 1) * width + x];

			const gx = p00 - p11;
			const gy = p01 - p10;
			const mag = Math.sqrt(gx * gx + gy * gy);

			magnitudes[y * width + x] = mag;
			if (mag > maxMag) maxMag = mag;
		}
	}

	const out = new ImageData(width, height);
	for (let p = 0; p < magnitudes.length; p++) {
		const value = maxMag === 0 ? 0 : Math.round((magnitudes[p] / maxMag) * 255);
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}
