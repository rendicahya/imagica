export interface Kernel {
	size: number;
	values: number[];
	divisor?: number;
}

export function makeKernel(size: number, values: number[], divisor?: number): Kernel {
	return { size, values, divisor };
}

export const kernelPresets: Record<string, Kernel> = {
	identity: makeKernel(3, [0, 0, 0, 0, 1, 0, 0, 0, 0]),
	boxBlur: makeKernel(3, [1, 1, 1, 1, 1, 1, 1, 1, 1], 9),
	gaussianBlur: makeKernel(3, [1, 2, 1, 2, 4, 2, 1, 2, 1], 16),
	sharpen: makeKernel(3, [0, -1, 0, -1, 5, -1, 0, -1, 0]),
	edgeDetect: makeKernel(3, [-1, -1, -1, -1, 8, -1, -1, -1, -1]),
	emboss: makeKernel(3, [-2, -1, 0, -1, 1, 1, 0, 1, 2])
};

export function kernelDivisor(kernel: Kernel): number {
	if (kernel.divisor !== undefined) return kernel.divisor;
	const sum = kernel.values.reduce((acc, v) => acc + v, 0);
	return sum === 0 ? 1 : sum;
}
