import type { PixelInfo } from '$lib/types/image';

export function isInBounds(imageData: ImageData, x: number, y: number): boolean {
	return x >= 0 && y >= 0 && x < imageData.width && y < imageData.height;
}

export function getPixel(imageData: ImageData, x: number, y: number): PixelInfo {
	const i = (y * imageData.width + x) * 4;
	const { data } = imageData;

	return {
		x,
		y,
		r: data[i],
		g: data[i + 1],
		b: data[i + 2],
		a: data[i + 3]
	};
}

export function toHex(r: number, g: number, b: number): string {
	const channel = (value: number) => value.toString(16).padStart(2, '0');
	return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
}

// ITU-R BT.601 luminosity weighting, matches common grayscale conversion in image processing courses.
export function toGrayscale(r: number, g: number, b: number): number {
	return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

export function get4Neighborhood(imageData: ImageData, x: number, y: number): (PixelInfo | null)[] {
	const offsets: [number, number][] = [
		[0, -1],
		[-1, 0],
		[1, 0],
		[0, 1]
	];

	return offsets.map(([dx, dy]) =>
		isInBounds(imageData, x + dx, y + dy) ? getPixel(imageData, x + dx, y + dy) : null
	);
}

export function get8Neighborhood(imageData: ImageData, x: number, y: number): (PixelInfo | null)[] {
	const offsets: [number, number][] = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[-1, 0],
		[1, 0],
		[-1, 1],
		[0, 1],
		[1, 1]
	];

	return offsets.map(([dx, dy]) =>
		isInBounds(imageData, x + dx, y + dy) ? getPixel(imageData, x + dx, y + dy) : null
	);
}
