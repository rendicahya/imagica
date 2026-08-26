import type { Kernel } from './kernels';
import { kernelDivisor } from './kernels';

export type EdgeMode = 'clamp' | 'zero';

function sampleChannel(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	x: number,
	y: number,
	channel: number,
	edgeMode: EdgeMode
): number {
	let sx = x;
	let sy = y;

	if (sx < 0 || sy < 0 || sx >= width || sy >= height) {
		if (edgeMode === 'zero') return 0;
		sx = Math.min(width - 1, Math.max(0, sx));
		sy = Math.min(height - 1, Math.max(0, sy));
	}

	return data[(sy * width + sx) * 4 + channel];
}

export function convolve(
	imageData: ImageData,
	kernel: Kernel,
	edgeMode: EdgeMode = 'clamp'
): ImageData {
	const { width, height, data } = imageData;
	const out = new ImageData(width, height);
	const radius = Math.floor(kernel.size / 2);
	const divisor = kernelDivisor(kernel);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let r = 0;
			let g = 0;
			let b = 0;

			for (let ky = 0; ky < kernel.size; ky++) {
				for (let kx = 0; kx < kernel.size; kx++) {
					const weight = kernel.values[ky * kernel.size + kx];
					if (weight === 0) continue;

					const sx = x + kx - radius;
					const sy = y + ky - radius;

					r += weight * sampleChannel(data, width, height, sx, sy, 0, edgeMode);
					g += weight * sampleChannel(data, width, height, sx, sy, 1, edgeMode);
					b += weight * sampleChannel(data, width, height, sx, sy, 2, edgeMode);
				}
			}

			const i = (y * width + x) * 4;
			out.data[i] = clamp(r / divisor);
			out.data[i + 1] = clamp(g / divisor);
			out.data[i + 2] = clamp(b / divisor);
			out.data[i + 3] = data[i + 3];
		}
	}

	return out;
}

// Single-pixel convolution trace, used to walk through the multiply-sum steps for the Convolution Playground.
export function convolveAtPixel(
	imageData: ImageData,
	kernel: Kernel,
	x: number,
	y: number,
	edgeMode: EdgeMode = 'clamp'
): { products: number[]; sum: number; result: number } {
	const { width, height, data } = imageData;
	const radius = Math.floor(kernel.size / 2);
	const divisor = kernelDivisor(kernel);
	const products: number[] = [];
	let sum = 0;

	for (let ky = 0; ky < kernel.size; ky++) {
		for (let kx = 0; kx < kernel.size; kx++) {
			const weight = kernel.values[ky * kernel.size + kx];
			const sx = x + kx - radius;
			const sy = y + ky - radius;
			const value = sampleChannel(data, width, height, sx, sy, 0, edgeMode);
			const product = weight * value;
			products.push(product);
			sum += product;
		}
	}

	return { products, sum, result: clamp(sum / divisor) };
}

function clamp(value: number): number {
	return Math.min(255, Math.max(0, Math.round(value)));
}
