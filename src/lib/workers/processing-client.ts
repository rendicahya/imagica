import type { ProcessingRequest } from './processing.worker';
import type { EdgeMode } from '$lib/image-processing/filtering/convolution';
import type { Kernel } from '$lib/image-processing/filtering/kernels';
import type { GradientResult } from '$lib/image-processing/edge/sobel';

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<
	number,
	{ resolve: (value: unknown) => void; reject: (reason: unknown) => void }
>();

function getWorker(): Worker {
	if (!worker) {
		worker = new Worker(new URL('./processing.worker.ts', import.meta.url), { type: 'module' });
		worker.onmessage = (event: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
			const { id, result, error } = event.data;
			const entry = pending.get(id);
			if (!entry) return;
			pending.delete(id);
			if (error) entry.reject(new Error(error));
			else entry.resolve(result);
		};
	}
	return worker;
}

function call<T>(request: ProcessingRequest): Promise<T> {
	const id = nextId++;
	return new Promise<T>((resolve, reject) => {
		pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
		getWorker().postMessage({ id, ...request });
	});
}

export function convolveAsync(imageData: ImageData, kernel: Kernel, edgeMode: EdgeMode = 'clamp') {
	return call<ImageData>({ op: 'convolve', imageData, kernel, edgeMode });
}

export function boxBlurAsync(imageData: ImageData, size: number) {
	return call<ImageData>({ op: 'boxBlur', imageData, size });
}

export function gaussianBlurAsync(imageData: ImageData, size: number, sigma: number) {
	return call<ImageData>({ op: 'gaussianBlur', imageData, size, sigma });
}

export function medianFilterAsync(imageData: ImageData, size: number) {
	return call<ImageData>({ op: 'medianFilter', imageData, size });
}

export function sharpenAsync(imageData: ImageData, amount: number) {
	return call<ImageData>({ op: 'sharpen', imageData, amount });
}

export function sobelAsync(imageData: ImageData) {
	return call<GradientResult>({ op: 'sobel', imageData });
}

export function prewittAsync(imageData: ImageData) {
	return call<GradientResult>({ op: 'prewitt', imageData });
}

export function robertsAsync(imageData: ImageData) {
	return call<ImageData>({ op: 'roberts', imageData });
}

export function laplacianAsync(imageData: ImageData) {
	return call<ImageData>({ op: 'laplacian', imageData });
}

export function cannyAsync(imageData: ImageData, lowThreshold: number, highThreshold: number) {
	return call<ImageData>({ op: 'canny', imageData, lowThreshold, highThreshold });
}
