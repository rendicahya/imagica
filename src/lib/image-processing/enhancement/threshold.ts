import { toGrayscale } from '../core/pixel';

export function globalThreshold(imageData: ImageData, level: number): ImageData {
	const out = new ImageData(imageData.width, imageData.height);
	const { data } = imageData;

	for (let i = 0; i < data.length; i += 4) {
		const gray = toGrayscale(data[i], data[i + 1], data[i + 2]);
		const value = gray >= level ? 255 : 0;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}

// Mean-based adaptive thresholding: each pixel is compared to the mean of its local window minus a bias constant C.
export function adaptiveThreshold(imageData: ImageData, blockSize: number, c: number): ImageData {
	const { width, height, data } = imageData;
	const gray = new Uint8ClampedArray(width * height);

	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = toGrayscale(data[i], data[i + 1], data[i + 2]);
	}

	const radius = Math.floor(blockSize / 2);
	const out = new ImageData(width, height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let sum = 0;
			let count = 0;

			for (let dy = -radius; dy <= radius; dy++) {
				for (let dx = -radius; dx <= radius; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
					sum += gray[ny * width + nx];
					count++;
				}
			}

			const mean = sum / count;
			const value = gray[y * width + x] >= mean - c ? 255 : 0;
			const i = (y * width + x) * 4;

			out.data[i] = value;
			out.data[i + 1] = value;
			out.data[i + 2] = value;
			out.data[i + 3] = 255;
		}
	}

	return out;
}
