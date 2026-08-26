function clamp(value: number): number {
	return Math.min(255, Math.max(0, value));
}

// Box-Muller transform for a standard normal sample.
function gaussianSample(): number {
	const u1 = Math.random() || 1e-9;
	const u2 = Math.random();
	return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function addGaussianNoise(imageData: ImageData, sigma: number): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	for (let i = 0; i < out.data.length; i += 4) {
		const noise = gaussianSample() * sigma;
		out.data[i] = clamp(out.data[i] + noise);
		out.data[i + 1] = clamp(out.data[i + 1] + noise);
		out.data[i + 2] = clamp(out.data[i + 2] + noise);
	}

	return out;
}

export function addSaltAndPepperNoise(imageData: ImageData, amount: number): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);
	const pixelCount = imageData.width * imageData.height;

	for (let p = 0; p < pixelCount; p++) {
		if (Math.random() >= amount) continue;
		const value = Math.random() < 0.5 ? 0 : 255;
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
	}

	return out;
}

export function addSpeckleNoise(imageData: ImageData, amount: number): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	for (let i = 0; i < out.data.length; i += 4) {
		const noise = gaussianSample() * amount;
		out.data[i] = clamp(out.data[i] + out.data[i] * noise);
		out.data[i + 1] = clamp(out.data[i + 1] + out.data[i + 1] * noise);
		out.data[i + 2] = clamp(out.data[i + 2] + out.data[i + 2] * noise);
	}

	return out;
}

export function motionBlurKernel(
	size: number,
	angleDegrees: number
): { size: number; values: number[]; divisor: number } {
	const values = new Array(size * size).fill(0);
	const center = (size - 1) / 2;
	const angle = (angleDegrees * Math.PI) / 180;

	for (let t = -center; t <= center; t += 0.5) {
		const x = Math.round(center + t * Math.cos(angle));
		const y = Math.round(center + t * Math.sin(angle));
		if (x >= 0 && x < size && y >= 0 && y < size) {
			values[y * size + x] = 1;
		}
	}

	const count = values.reduce((a, b) => a + b, 0);
	return { size, values, divisor: count || 1 };
}
