export type InterpolationMethod = 'nearest' | 'bilinear' | 'bicubic';

function clampCoord(v: number, max: number): number {
	return Math.min(max, Math.max(0, v));
}

function sample(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	x: number,
	y: number,
	channel: number
): number {
	const cx = clampCoord(x, width - 1);
	const cy = clampCoord(y, height - 1);
	return data[(cy * width + cx) * 4 + channel];
}

function cubicWeight(t: number): number {
	const a = -0.5;
	const at = Math.abs(t);
	if (at <= 1) return (a + 2) * at ** 3 - (a + 3) * at ** 2 + 1;
	if (at < 2) return a * at ** 3 - 5 * a * at ** 2 + 8 * a * at - 4 * a;
	return 0;
}

export function resample(
	imageData: ImageData,
	targetWidth: number,
	targetHeight: number,
	method: InterpolationMethod
): ImageData {
	const { width, height, data } = imageData;
	const out = new ImageData(targetWidth, targetHeight);
	const scaleX = width / targetWidth;
	const scaleY = height / targetHeight;

	for (let ty = 0; ty < targetHeight; ty++) {
		for (let tx = 0; tx < targetWidth; tx++) {
			const srcX = (tx + 0.5) * scaleX - 0.5;
			const srcY = (ty + 0.5) * scaleY - 0.5;
			const i = (ty * targetWidth + tx) * 4;

			for (let c = 0; c < 4; c++) {
				let value: number;

				if (method === 'nearest') {
					value = sample(data, width, height, Math.round(srcX), Math.round(srcY), c);
				} else if (method === 'bilinear') {
					const x0 = Math.floor(srcX);
					const y0 = Math.floor(srcY);
					const fx = srcX - x0;
					const fy = srcY - y0;

					const v00 = sample(data, width, height, x0, y0, c);
					const v10 = sample(data, width, height, x0 + 1, y0, c);
					const v01 = sample(data, width, height, x0, y0 + 1, c);
					const v11 = sample(data, width, height, x0 + 1, y0 + 1, c);

					value =
						v00 * (1 - fx) * (1 - fy) + v10 * fx * (1 - fy) + v01 * (1 - fx) * fy + v11 * fx * fy;
				} else {
					const x0 = Math.floor(srcX);
					const y0 = Math.floor(srcY);
					let sum = 0;
					let weightSum = 0;

					for (let m = -1; m <= 2; m++) {
						for (let n = -1; n <= 2; n++) {
							const weight = cubicWeight(srcX - (x0 + n)) * cubicWeight(srcY - (y0 + m));
							sum += weight * sample(data, width, height, x0 + n, y0 + m, c);
							weightSum += weight;
						}
					}

					value = weightSum === 0 ? 0 : sum / weightSum;
				}

				out.data[i + c] = Math.min(255, Math.max(0, Math.round(value)));
			}
		}
	}

	return out;
}

export function quantize(imageData: ImageData, levels: number): ImageData {
	const out = new ImageData(
		new Uint8ClampedArray(imageData.data),
		imageData.width,
		imageData.height
	);
	const step = 255 / (levels - 1);

	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = Math.round(Math.round(out.data[i] / step) * step);
		out.data[i + 1] = Math.round(Math.round(out.data[i + 1] / step) * step);
		out.data[i + 2] = Math.round(Math.round(out.data[i + 2] / step) * step);
	}

	return out;
}
