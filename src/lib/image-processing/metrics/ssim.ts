import { toGrayscale } from '../core/pixel';

// Simplified global SSIM (single-window) rather than the full sliding-window version — good enough to compare restoration results in a classroom setting.
export function ssim(a: ImageData, b: ImageData): number {
	const n = a.width * a.height;
	const grayA = new Float64Array(n);
	const grayB = new Float64Array(n);

	for (let p = 0; p < n; p++) {
		const i = p * 4;
		grayA[p] = toGrayscale(a.data[i], a.data[i + 1], a.data[i + 2]);
		grayB[p] = toGrayscale(b.data[i], b.data[i + 1], b.data[i + 2]);
	}

	const meanA = mean(grayA);
	const meanB = mean(grayB);
	const varA = variance(grayA, meanA);
	const varB = variance(grayB, meanB);
	const covAB = covariance(grayA, grayB, meanA, meanB);

	const C1 = (0.01 * 255) ** 2;
	const C2 = (0.03 * 255) ** 2;

	return (
		((2 * meanA * meanB + C1) * (2 * covAB + C2)) /
		((meanA ** 2 + meanB ** 2 + C1) * (varA + varB + C2))
	);
}

function mean(values: Float64Array): number {
	let sum = 0;
	for (const v of values) sum += v;
	return sum / values.length;
}

function variance(values: Float64Array, avg: number): number {
	let sum = 0;
	for (const v of values) sum += (v - avg) ** 2;
	return sum / (values.length - 1);
}

function covariance(a: Float64Array, b: Float64Array, meanA: number, meanB: number): number {
	let sum = 0;
	for (let i = 0; i < a.length; i++) sum += (a[i] - meanA) * (b[i] - meanB);
	return sum / (a.length - 1);
}
