export interface Cmyk {
	c: number; // 0-100
	m: number; // 0-100
	y: number; // 0-100
	k: number; // 0-100
}

export function rgbToCmyk(r: number, g: number, b: number): Cmyk {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;

	const k = 1 - Math.max(rn, gn, bn);

	if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

	const c = (1 - rn - k) / (1 - k);
	const m = (1 - gn - k) / (1 - k);
	const y = (1 - bn - k) / (1 - k);

	return {
		c: Math.round(c * 100),
		m: Math.round(m * 100),
		y: Math.round(y * 100),
		k: Math.round(k * 100)
	};
}

export function cmykToRgb(
	c: number,
	m: number,
	y: number,
	k: number
): { r: number; g: number; b: number } {
	const cn = c / 100;
	const mn = m / 100;
	const yn = y / 100;
	const kn = k / 100;

	return {
		r: Math.round(255 * (1 - cn) * (1 - kn)),
		g: Math.round(255 * (1 - mn) * (1 - kn)),
		b: Math.round(255 * (1 - yn) * (1 - kn))
	};
}
