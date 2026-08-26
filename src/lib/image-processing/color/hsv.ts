export interface Hsv {
	h: number; // 0-360
	s: number; // 0-100
	v: number; // 0-100
}

export function rgbToHsv(r: number, g: number, b: number): Hsv {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;

	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const delta = max - min;

	let h = 0;
	if (delta !== 0) {
		if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
		else if (max === gn) h = 60 * ((bn - rn) / delta + 2);
		else h = 60 * ((rn - gn) / delta + 4);
	}
	if (h < 0) h += 360;

	const s = max === 0 ? 0 : delta / max;

	return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(max * 100) };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
	const sn = s / 100;
	const vn = v / 100;

	const c = vn * sn;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = vn - c;

	let r: number;
	let g: number;
	let b: number;

	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255)
	};
}
