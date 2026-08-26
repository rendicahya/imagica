import { toGrayscale } from '../core/pixel';

export function laplacian(imageData: ImageData): ImageData {
	const { width, height, data } = imageData;
	const gray = new Float32Array(width * height);

	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = toGrayscale(data[i], data[i + 1], data[i + 2]);
	}

	const kernel = [0, 1, 0, 1, -4, 1, 0, 1, 0];
	const values = new Float32Array(width * height);
	let maxAbs = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let sum = 0;
			for (let ky = -1; ky <= 1; ky++) {
				for (let kx = -1; kx <= 1; kx++) {
					const nx = Math.min(width - 1, Math.max(0, x + kx));
					const ny = Math.min(height - 1, Math.max(0, y + ky));
					sum += kernel[(ky + 1) * 3 + (kx + 1)] * gray[ny * width + nx];
				}
			}
			values[y * width + x] = sum;
			if (Math.abs(sum) > maxAbs) maxAbs = Math.abs(sum);
		}
	}

	const out = new ImageData(width, height);
	for (let p = 0; p < values.length; p++) {
		const value = Math.round(((values[p] / (maxAbs || 1)) * 0.5 + 0.5) * 255);
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}
