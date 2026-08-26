import { toGrayscale } from '../core/pixel';

export interface GradientResult {
	gx: Float32Array;
	gy: Float32Array;
	magnitude: ImageData;
}

function toGrayscaleArray(imageData: ImageData): {
	width: number;
	height: number;
	gray: Float32Array;
} {
	const { width, height, data } = imageData;
	const gray = new Float32Array(width * height);

	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = toGrayscale(data[i], data[i + 1], data[i + 2]);
	}

	return { width, height, gray };
}

export function applyGradientKernels(
	imageData: ImageData,
	kx: number[],
	ky: number[]
): GradientResult {
	const { width, height, gray } = toGrayscaleArray(imageData);
	const gx = new Float32Array(width * height);
	const gy = new Float32Array(width * height);
	const magnitude = new ImageData(width, height);

	let maxMag = 0;
	const magnitudes = new Float32Array(width * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let sx = 0;
			let sy = 0;

			for (let ky2 = -1; ky2 <= 1; ky2++) {
				for (let kx2 = -1; kx2 <= 1; kx2++) {
					const nx = Math.min(width - 1, Math.max(0, x + kx2));
					const ny = Math.min(height - 1, Math.max(0, y + ky2));
					const value = gray[ny * width + nx];
					const idx = (ky2 + 1) * 3 + (kx2 + 1);
					sx += kx[idx] * value;
					sy += ky[idx] * value;
				}
			}

			const p = y * width + x;
			gx[p] = sx;
			gy[p] = sy;
			const mag = Math.sqrt(sx * sx + sy * sy);
			magnitudes[p] = mag;
			if (mag > maxMag) maxMag = mag;
		}
	}

	for (let p = 0; p < magnitudes.length; p++) {
		const value = maxMag === 0 ? 0 : Math.round((magnitudes[p] / maxMag) * 255);
		const i = p * 4;
		magnitude.data[i] = value;
		magnitude.data[i + 1] = value;
		magnitude.data[i + 2] = value;
		magnitude.data[i + 3] = 255;
	}

	return { gx, gy, magnitude };
}

export function sobel(imageData: ImageData): GradientResult {
	return applyGradientKernels(
		imageData,
		[-1, 0, 1, -2, 0, 2, -1, 0, 1],
		[-1, -2, -1, 0, 0, 0, 1, 2, 1]
	);
}

export function gradientToImage(g: Float32Array, width: number, height: number): ImageData {
	const out = new ImageData(width, height);
	const maxAbs = Math.max(...Array.from(g).map(Math.abs), 1);

	for (let p = 0; p < g.length; p++) {
		const value = Math.round(((g[p] / maxAbs) * 0.5 + 0.5) * 255);
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}
