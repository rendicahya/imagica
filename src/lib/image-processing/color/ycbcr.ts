export interface YCbCr {
	y: number;
	cb: number;
	cr: number;
}

// ITU-R BT.601 full-range conversion.
export function rgbToYCbCr(r: number, g: number, b: number): YCbCr {
	const y = 0.299 * r + 0.587 * g + 0.114 * b;
	const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
	const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

	return { y: Math.round(y), cb: Math.round(cb), cr: Math.round(cr) };
}
