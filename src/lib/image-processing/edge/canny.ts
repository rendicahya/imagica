import { toGrayscale } from '../core/pixel';
import { gaussianKernel } from '../filtering/smoothing';

function convolveGray(
	gray: Float32Array<ArrayBufferLike>,
	width: number,
	height: number,
	values: number[],
	size: number,
	divisor: number
): Float32Array<ArrayBuffer> {
	const radius = Math.floor(size / 2);
	const out = new Float32Array(width * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let sum = 0;
			for (let ky = 0; ky < size; ky++) {
				for (let kx = 0; kx < size; kx++) {
					const nx = Math.min(width - 1, Math.max(0, x + kx - radius));
					const ny = Math.min(height - 1, Math.max(0, y + ky - radius));
					sum += values[ky * size + kx] * gray[ny * width + nx];
				}
			}
			out[y * width + x] = sum / divisor;
		}
	}

	return out;
}

export function canny(
	imageData: ImageData,
	options: { blurSize?: number; sigma?: number; lowThreshold?: number; highThreshold?: number } = {}
): ImageData {
	const { blurSize = 5, sigma = 1.4, lowThreshold = 30, highThreshold = 80 } = options;
	const { width, height, data } = imageData;

	let gray = new Float32Array(width * height);
	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = toGrayscale(data[i], data[i + 1], data[i + 2]);
	}

	const blurKernel = gaussianKernel(blurSize, sigma);
	gray = convolveGray(gray, width, height, blurKernel.values, blurSize, blurKernel.divisor ?? 1);

	const gx = convolveGray(gray, width, height, [-1, 0, 1, -2, 0, 2, -1, 0, 1], 3, 1);
	const gy = convolveGray(gray, width, height, [-1, -2, -1, 0, 0, 0, 1, 2, 1], 3, 1);

	const magnitude = new Float32Array(width * height);
	const direction = new Float32Array(width * height);

	for (let p = 0; p < magnitude.length; p++) {
		magnitude[p] = Math.sqrt(gx[p] * gx[p] + gy[p] * gy[p]);
		direction[p] = Math.atan2(gy[p], gx[p]);
	}

	// Non-maximum suppression: keep a pixel only if it's a local peak along its gradient direction.
	const suppressed = new Float32Array(width * height);
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			const p = y * width + x;
			let angle = (direction[p] * 180) / Math.PI;
			if (angle < 0) angle += 180;

			let neighborA: number;
			let neighborB: number;

			if (angle < 22.5 || angle >= 157.5) {
				neighborA = magnitude[p - 1];
				neighborB = magnitude[p + 1];
			} else if (angle < 67.5) {
				neighborA = magnitude[p - width + 1];
				neighborB = magnitude[p + width - 1];
			} else if (angle < 112.5) {
				neighborA = magnitude[p - width];
				neighborB = magnitude[p + width];
			} else {
				neighborA = magnitude[p - width - 1];
				neighborB = magnitude[p + width + 1];
			}

			suppressed[p] = magnitude[p] >= neighborA && magnitude[p] >= neighborB ? magnitude[p] : 0;
		}
	}

	// Double threshold + hysteresis: strong edges survive, weak edges survive only if connected to a strong one.
	const STRONG = 2;
	const WEAK = 1;
	const classification = new Uint8Array(width * height);

	for (let p = 0; p < suppressed.length; p++) {
		if (suppressed[p] >= highThreshold) classification[p] = STRONG;
		else if (suppressed[p] >= lowThreshold) classification[p] = WEAK;
	}

	const out = new ImageData(width, height);
	const visited = new Uint8Array(width * height);
	const stack: number[] = [];

	for (let p = 0; p < classification.length; p++) {
		if (classification[p] === STRONG) stack.push(p);
	}

	while (stack.length) {
		const p = stack.pop() as number;
		if (visited[p]) continue;
		visited[p] = 1;

		const x = p % width;
		const y = Math.floor(p / width);

		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
				const np = ny * width + nx;
				if (!visited[np] && classification[np] >= WEAK) stack.push(np);
			}
		}
	}

	for (let p = 0; p < visited.length; p++) {
		const value = visited[p] ? 255 : 0;
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}
