export interface Lab {
	l: number; // 0-100
	a: number; // roughly -128..127
	b: number; // roughly -128..127
}

function srgbToLinear(channel: number): number {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// D65 reference white, sRGB primaries.
const REF_X = 0.95047;
const REF_Y = 1.0;
const REF_Z = 1.08883;

function xyzChannelToLab(t: number): number {
	return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

export function rgbToLab(r: number, g: number, b: number): Lab {
	const rl = srgbToLinear(r);
	const gl = srgbToLinear(g);
	const bl = srgbToLinear(b);

	const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / REF_X;
	const y = (rl * 0.2126 + gl * 0.7152 + bl * 0.0722) / REF_Y;
	const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / REF_Z;

	const fx = xyzChannelToLab(x);
	const fy = xyzChannelToLab(y);
	const fz = xyzChannelToLab(z);

	return {
		l: Math.round(116 * fy - 16),
		a: Math.round(500 * (fx - fy)),
		b: Math.round(200 * (fy - fz))
	};
}
