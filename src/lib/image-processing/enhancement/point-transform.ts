export type Lut = number[];

export function identityLut(): Lut {
	return Array.from({ length: 256 }, (_, x) => x);
}

export function brightnessContrastLut(alpha: number, beta: number): Lut {
	return Array.from({ length: 256 }, (_, x) => clamp(alpha * x + beta));
}

export function negativeLut(): Lut {
	return Array.from({ length: 256 }, (_, x) => 255 - x);
}

export function gammaLut(gamma: number): Lut {
	return Array.from({ length: 256 }, (_, x) => clamp(255 * Math.pow(x / 255, 1 / gamma)));
}

export function composeLut(...luts: Lut[]): Lut {
	return Array.from({ length: 256 }, (_, x) => {
		let value = x;
		for (const lut of luts) value = lut[clamp(value)];
		return value;
	});
}

export function applyLut(imageData: ImageData, lut: Lut): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);

	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = lut[out.data[i]];
		out.data[i + 1] = lut[out.data[i + 1]];
		out.data[i + 2] = lut[out.data[i + 2]];
	}

	return out;
}

function clamp(value: number): number {
	return Math.min(255, Math.max(0, Math.round(value)));
}
