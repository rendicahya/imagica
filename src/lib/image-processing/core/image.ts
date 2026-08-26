export function cloneImageData(imageData: ImageData): ImageData {
	return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

export function createImageData(width: number, height: number): ImageData {
	return new ImageData(width, height);
}

// Highlights per-channel absolute difference; alpha is always fully opaque.
export function differenceImage(a: ImageData, b: ImageData): ImageData {
	const out = createImageData(a.width, a.height);

	for (let i = 0; i < out.data.length; i += 4) {
		out.data[i] = Math.abs(a.data[i] - b.data[i]);
		out.data[i + 1] = Math.abs(a.data[i + 1] - b.data[i + 1]);
		out.data[i + 2] = Math.abs(a.data[i + 2] - b.data[i + 2]);
		out.data[i + 3] = 255;
	}

	return out;
}
