import { mse } from './mse';

export function psnr(a: ImageData, b: ImageData): number {
	const error = mse(a, b);
	if (error === 0) return Infinity;
	return 10 * Math.log10((255 * 255) / error);
}
