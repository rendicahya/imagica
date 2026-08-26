import { rgbToHsv } from './hsv';
import { rgbToLab } from './lab';
import { rgbToYCbCr } from './ycbcr';

export type ColorSpace = 'rgb' | 'hsv' | 'lab' | 'ycbcr';

export interface ChannelResult {
	label: string;
	imageData: ImageData;
}

function grayscaleFrom(
	width: number,
	height: number,
	values: number[],
	min: number,
	max: number
): ImageData {
	const out = new ImageData(width, height);
	const range = max - min || 1;

	for (let i = 0; i < values.length; i++) {
		const normalized = Math.round(((values[i] - min) / range) * 255);
		const offset = i * 4;
		out.data[offset] = normalized;
		out.data[offset + 1] = normalized;
		out.data[offset + 2] = normalized;
		out.data[offset + 3] = 255;
	}

	return out;
}

const channelConfig: Record<
	ColorSpace,
	{ labels: [string, string, string]; ranges: [number, number][] }
> = {
	rgb: {
		labels: ['Red', 'Green', 'Blue'],
		ranges: [
			[0, 255],
			[0, 255],
			[0, 255]
		]
	},
	hsv: {
		labels: ['Hue', 'Saturation', 'Value'],
		ranges: [
			[0, 360],
			[0, 100],
			[0, 100]
		]
	},
	lab: {
		labels: ['L (Lightness)', 'a (Green-Red)', 'b (Blue-Yellow)'],
		ranges: [
			[0, 100],
			[-128, 127],
			[-128, 127]
		]
	},
	ycbcr: {
		labels: ['Y (Luma)', 'Cb', 'Cr'],
		ranges: [
			[0, 255],
			[0, 255],
			[0, 255]
		]
	}
};

export function extractChannels(imageData: ImageData, space: ColorSpace): ChannelResult[] {
	const { width, height, data } = imageData;
	const pixelCount = width * height;
	const channelValues: [number[], number[], number[]] = [[], [], []];

	for (let p = 0; p < pixelCount; p++) {
		const i = p * 4;
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];

		let values: [number, number, number];

		switch (space) {
			case 'rgb':
				values = [r, g, b];
				break;
			case 'hsv': {
				const hsv = rgbToHsv(r, g, b);
				values = [hsv.h, hsv.s, hsv.v];
				break;
			}
			case 'lab': {
				const lab = rgbToLab(r, g, b);
				values = [lab.l, lab.a, lab.b];
				break;
			}
			case 'ycbcr': {
				const ycbcr = rgbToYCbCr(r, g, b);
				values = [ycbcr.y, ycbcr.cb, ycbcr.cr];
				break;
			}
		}

		channelValues[0].push(values[0]);
		channelValues[1].push(values[1]);
		channelValues[2].push(values[2]);
	}

	const config = channelConfig[space];

	return config.labels.map((label, index) => ({
		label,
		imageData: grayscaleFrom(
			width,
			height,
			channelValues[index],
			config.ranges[index][0],
			config.ranges[index][1]
		)
	}));
}
