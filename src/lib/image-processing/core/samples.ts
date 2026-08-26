import { hsvToRgb } from '../color/hsv';

export interface SampleImage {
	name: string;
	generate: (size: number) => ImageData;
}

function setPixel(
	data: Uint8ClampedArray,
	width: number,
	x: number,
	y: number,
	r: number,
	g: number,
	b: number
) {
	const i = (y * width + x) * 4;
	data[i] = r;
	data[i + 1] = g;
	data[i + 2] = b;
	data[i + 3] = 255;
}

function gradient(size: number): ImageData {
	const out = new ImageData(size, size);
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const value = Math.round((x / (size - 1)) * 255);
			setPixel(out.data, size, x, y, value, value, value);
		}
	}
	return out;
}

function checkerboard(size: number): ImageData {
	const out = new ImageData(size, size);
	const tiles = 8;
	const tileSize = size / tiles;

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const tileX = Math.floor(x / tileSize);
			const tileY = Math.floor(y / tileSize);
			const value = (tileX + tileY) % 2 === 0 ? 255 : 0;
			setPixel(out.data, size, x, y, value, value, value);
		}
	}
	return out;
}

function colorWheel(size: number): ImageData {
	const out = new ImageData(size, size);
	const cx = size / 2;
	const cy = size / 2;
	const radius = size / 2;

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const dx = x - cx;
			const dy = y - cy;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist > radius) {
				setPixel(out.data, size, x, y, 255, 255, 255);
				continue;
			}

			let hue = (Math.atan2(dy, dx) * 180) / Math.PI;
			if (hue < 0) hue += 360;
			const saturation = Math.min(100, (dist / radius) * 100);
			const { r, g, b } = hsvToRgb(hue, saturation, 100);
			setPixel(out.data, size, x, y, r, g, b);
		}
	}
	return out;
}

function shapes(size: number): ImageData {
	const out = new ImageData(size, size);

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			setPixel(out.data, size, x, y, 245, 245, 245);
		}
	}

	// Circle, top-left.
	const cx = size * 0.28;
	const cy = size * 0.32;
	const r = size * 0.2;

	// Square, top-right.
	const squareLeft = size * 0.58;
	const squareTop = size * 0.14;
	const squareSize = size * 0.32;

	// Triangle, bottom-center.
	const triTop = size * 0.6;
	const triBottom = size * 0.92;
	const triHalfBase = size * 0.24;
	const triCenterX = size * 0.5;

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const dx = x - cx;
			const dy = y - cy;
			if (dx * dx + dy * dy <= r * r) {
				setPixel(out.data, size, x, y, 59, 130, 246);
				continue;
			}

			if (
				x >= squareLeft &&
				x <= squareLeft + squareSize &&
				y >= squareTop &&
				y <= squareTop + squareSize
			) {
				setPixel(out.data, size, x, y, 239, 68, 68);
				continue;
			}

			if (y >= triTop && y <= triBottom) {
				const t = (y - triTop) / (triBottom - triTop);
				const halfWidth = triHalfBase * t;
				if (x >= triCenterX - halfWidth && x <= triCenterX + halfWidth) {
					setPixel(out.data, size, x, y, 34, 197, 94);
				}
			}
		}
	}

	return out;
}

export const sampleImages: SampleImage[] = [
	{ name: 'Gradient', generate: gradient },
	{ name: 'Checkerboard', generate: checkerboard },
	{ name: 'Color Wheel', generate: colorWheel },
	{ name: 'Shapes', generate: shapes }
];
