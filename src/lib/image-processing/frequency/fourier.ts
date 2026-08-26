export interface ComplexField {
	width: number;
	height: number;
	re: Float64Array;
	im: Float64Array;
}

// O(n^2) 1D DFT — fine for the small grids (<=128px) this module operates on.
function dft1d(
	re: Float64Array,
	im: Float64Array,
	inverse: boolean
): { re: Float64Array; im: Float64Array } {
	const n = re.length;
	const outRe = new Float64Array(n);
	const outIm = new Float64Array(n);
	const sign = inverse ? 1 : -1;

	for (let k = 0; k < n; k++) {
		let sumRe = 0;
		let sumIm = 0;

		for (let t = 0; t < n; t++) {
			const angle = (sign * 2 * Math.PI * k * t) / n;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			sumRe += re[t] * cos - im[t] * sin;
			sumIm += re[t] * sin + im[t] * cos;
		}

		if (inverse) {
			outRe[k] = sumRe / n;
			outIm[k] = sumIm / n;
		} else {
			outRe[k] = sumRe;
			outIm[k] = sumIm;
		}
	}

	return { re: outRe, im: outIm };
}

function transformRows(field: ComplexField, inverse: boolean): ComplexField {
	const { width, height } = field;
	const re = new Float64Array(width * height);
	const im = new Float64Array(width * height);

	for (let y = 0; y < height; y++) {
		const rowRe = field.re.slice(y * width, y * width + width);
		const rowIm = field.im.slice(y * width, y * width + width);
		const result = dft1d(rowRe, rowIm, inverse);
		re.set(result.re, y * width);
		im.set(result.im, y * width);
	}

	return { width, height, re, im };
}

function transformColumns(field: ComplexField, inverse: boolean): ComplexField {
	const { width, height } = field;
	const re = new Float64Array(width * height);
	const im = new Float64Array(width * height);

	for (let x = 0; x < width; x++) {
		const colRe = new Float64Array(height);
		const colIm = new Float64Array(height);
		for (let y = 0; y < height; y++) {
			colRe[y] = field.re[y * width + x];
			colIm[y] = field.im[y * width + x];
		}

		const result = dft1d(colRe, colIm, inverse);
		for (let y = 0; y < height; y++) {
			re[y * width + x] = result.re[y];
			im[y * width + x] = result.im[y];
		}
	}

	return { width, height, re, im };
}

export function dft2d(gray: Float64Array, width: number, height: number): ComplexField {
	const field: ComplexField = {
		width,
		height,
		re: gray.slice(),
		im: new Float64Array(width * height)
	};
	return transformColumns(transformRows(field, false), false);
}

export function idft2d(field: ComplexField): Float64Array {
	const result = transformColumns(transformRows(field, true), true);
	return result.re;
}

// Reorders quadrants so the zero frequency sits at the center, matching the conventional spectrum view.
export function fftShift(field: ComplexField): ComplexField {
	const { width, height, re, im } = field;
	const outRe = new Float64Array(width * height);
	const outIm = new Float64Array(width * height);
	const halfW = Math.floor(width / 2);
	const halfH = Math.floor(height / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const nx = (x + halfW) % width;
			const ny = (y + halfH) % height;
			outRe[ny * width + nx] = re[y * width + x];
			outIm[ny * width + nx] = im[y * width + x];
		}
	}

	return { width, height, re: outRe, im: outIm };
}

export function magnitudeSpectrumImage(field: ComplexField): ImageData {
	const { width, height, re, im } = field;
	const magnitudes = new Float64Array(width * height);
	let maxLog = 0;

	for (let p = 0; p < magnitudes.length; p++) {
		const mag = Math.sqrt(re[p] * re[p] + im[p] * im[p]);
		const logMag = Math.log(1 + mag);
		magnitudes[p] = logMag;
		if (logMag > maxLog) maxLog = logMag;
	}

	const out = new ImageData(width, height);
	for (let p = 0; p < magnitudes.length; p++) {
		const value = maxLog === 0 ? 0 : Math.round((magnitudes[p] / maxLog) * 255);
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}

export type FilterKind = 'low-pass' | 'high-pass' | 'band-pass';

// Applies a circular frequency mask centered on the (shifted) spectrum, then removes the shift before returning.
export function applyFrequencyFilter(
	field: ComplexField,
	kind: FilterKind,
	innerRadius: number,
	outerRadius: number
): ComplexField {
	const shifted = fftShift(field);
	const { width, height, re, im } = shifted;
	const cx = width / 2;
	const cy = height / 2;

	const outRe = new Float64Array(width * height);
	const outIm = new Float64Array(width * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const dist = Math.hypot(x - cx, y - cy);
			const keep =
				kind === 'low-pass'
					? dist <= outerRadius
					: kind === 'high-pass'
						? dist >= innerRadius
						: dist >= innerRadius && dist <= outerRadius;

			const p = y * width + x;
			if (keep) {
				outRe[p] = re[p];
				outIm[p] = im[p];
			}
		}
	}

	return fftShiftInverse({ width, height, re: outRe, im: outIm });
}

function fftShiftInverse(field: ComplexField): ComplexField {
	// fftShift is its own inverse for even dimensions, which is all this module produces.
	return fftShift(field);
}

export function grayscaleField(imageData: ImageData): Float64Array {
	const { width, height, data } = imageData;
	const gray = new Float64Array(width * height);

	for (let p = 0; p < gray.length; p++) {
		const i = p * 4;
		gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
	}

	return gray;
}

export function fieldToGrayscaleImage(
	values: Float64Array,
	width: number,
	height: number
): ImageData {
	const out = new ImageData(width, height);

	for (let p = 0; p < values.length; p++) {
		const value = Math.min(255, Math.max(0, Math.round(values[p])));
		const i = p * 4;
		out.data[i] = value;
		out.data[i + 1] = value;
		out.data[i + 2] = value;
		out.data[i + 3] = 255;
	}

	return out;
}
