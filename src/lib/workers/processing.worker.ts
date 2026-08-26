import { convolve, type EdgeMode } from '$lib/image-processing/filtering/convolution';
import { boxBlur, gaussianBlur, medianFilter } from '$lib/image-processing/filtering/smoothing';
import { sharpen } from '$lib/image-processing/filtering/sharpening';
import type { Kernel } from '$lib/image-processing/filtering/kernels';
import { sobel } from '$lib/image-processing/edge/sobel';
import { prewitt } from '$lib/image-processing/edge/prewitt';
import { roberts } from '$lib/image-processing/edge/roberts';
import { laplacian } from '$lib/image-processing/edge/laplacian';
import { canny } from '$lib/image-processing/edge/canny';

export type ProcessingRequest =
	| { op: 'convolve'; imageData: ImageData; kernel: Kernel; edgeMode: EdgeMode }
	| { op: 'boxBlur'; imageData: ImageData; size: number }
	| { op: 'gaussianBlur'; imageData: ImageData; size: number; sigma: number }
	| { op: 'medianFilter'; imageData: ImageData; size: number }
	| { op: 'sharpen'; imageData: ImageData; amount: number }
	| { op: 'sobel'; imageData: ImageData }
	| { op: 'prewitt'; imageData: ImageData }
	| { op: 'roberts'; imageData: ImageData }
	| { op: 'laplacian'; imageData: ImageData }
	| { op: 'canny'; imageData: ImageData; lowThreshold: number; highThreshold: number };

function run(request: ProcessingRequest) {
	switch (request.op) {
		case 'convolve':
			return convolve(request.imageData, request.kernel, request.edgeMode);
		case 'boxBlur':
			return boxBlur(request.imageData, request.size);
		case 'gaussianBlur':
			return gaussianBlur(request.imageData, request.size, request.sigma);
		case 'medianFilter':
			return medianFilter(request.imageData, request.size);
		case 'sharpen':
			return sharpen(request.imageData, request.amount);
		case 'sobel':
			return sobel(request.imageData);
		case 'prewitt':
			return prewitt(request.imageData);
		case 'roberts':
			return roberts(request.imageData);
		case 'laplacian':
			return laplacian(request.imageData);
		case 'canny':
			return canny(request.imageData, {
				lowThreshold: request.lowThreshold,
				highThreshold: request.highThreshold
			});
	}
}

self.onmessage = (event: MessageEvent<{ id: number } & ProcessingRequest>) => {
	const { id, ...request } = event.data;

	try {
		const result = run(request);
		self.postMessage({ id, result });
	} catch (err) {
		self.postMessage({ id, error: err instanceof Error ? err.message : String(err) });
	}
};
