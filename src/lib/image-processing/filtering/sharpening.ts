import type { Kernel } from './kernels';
import { convolve } from './convolution';

export function sharpenKernel(amount: number): Kernel {
	const center = 1 + 4 * amount;
	return {
		size: 3,
		values: [0, -amount, 0, -amount, center, -amount, 0, -amount, 0]
	};
}

export function sharpen(imageData: ImageData, amount: number): ImageData {
	return convolve(imageData, sharpenKernel(amount));
}
