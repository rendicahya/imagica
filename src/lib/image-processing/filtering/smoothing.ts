import type { Kernel } from './kernels';
import { convolve } from './convolution';

export function boxBlurKernel(size: number): Kernel {
	return { size, values: new Array(size * size).fill(1), divisor: size * size };
}

export function gaussianKernel(size: number, sigma: number): Kernel {
	const radius = Math.floor(size / 2);
	const values: number[] = [];
	let sum = 0;

	for (let y = -radius; y <= radius; y++) {
		for (let x = -radius; x <= radius; x++) {
			const weight = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
			values.push(weight);
			sum += weight;
		}
	}

	return { size, values, divisor: sum };
}

export function boxBlur(imageData: ImageData, size: number): ImageData {
	return convolve(imageData, boxBlurKernel(size));
}

export function gaussianBlur(imageData: ImageData, size: number, sigma: number): ImageData {
	return convolve(imageData, gaussianKernel(size, sigma));
}

// Non-linear filter: replaces each pixel with the median of its neighborhood, per channel. Good at removing salt-and-pepper noise while preserving edges.
export function medianFilter(imageData: ImageData, size: number): ImageData {
	const { width, height, data } = imageData;
	const out = new ImageData(width, height);
	const radius = Math.floor(size / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const rs: number[] = [];
			const gs: number[] = [];
			const bs: number[] = [];

			for (let dy = -radius; dy <= radius; dy++) {
				for (let dx = -radius; dx <= radius; dx++) {
					const sx = Math.min(width - 1, Math.max(0, x + dx));
					const sy = Math.min(height - 1, Math.max(0, y + dy));
					const i = (sy * width + sx) * 4;
					rs.push(data[i]);
					gs.push(data[i + 1]);
					bs.push(data[i + 2]);
				}
			}

			rs.sort((a, b) => a - b);
			gs.sort((a, b) => a - b);
			bs.sort((a, b) => a - b);
			const mid = Math.floor(rs.length / 2);

			const i = (y * width + x) * 4;
			out.data[i] = rs[mid];
			out.data[i + 1] = gs[mid];
			out.data[i + 2] = bs[mid];
			out.data[i + 3] = data[i + 3];
		}
	}

	return out;
}
