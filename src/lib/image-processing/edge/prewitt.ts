import { applyGradientKernels, type GradientResult } from './sobel';

export function prewitt(imageData: ImageData): GradientResult {
	return applyGradientKernels(
		imageData,
		[-1, 0, 1, -1, 0, 1, -1, 0, 1],
		[-1, -1, -1, 0, 0, 0, 1, 1, 1]
	);
}
