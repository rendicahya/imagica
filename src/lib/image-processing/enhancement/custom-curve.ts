export interface ControlPoint {
	x: number;
	y: number;
}

// Piecewise-linear interpolation between sorted control points, sampled at every intensity 0-255.
export function curveToLut(points: ControlPoint[]): number[] {
	const sorted = [...points].sort((a, b) => a.x - b.x);

	return Array.from({ length: 256 }, (_, x) => {
		let left = sorted[0];
		let right = sorted[sorted.length - 1];

		for (let i = 0; i < sorted.length - 1; i++) {
			if (x >= sorted[i].x && x <= sorted[i + 1].x) {
				left = sorted[i];
				right = sorted[i + 1];
				break;
			}
		}

		if (right.x === left.x) return Math.round(left.y);

		const t = (x - left.x) / (right.x - left.x);
		return Math.min(255, Math.max(0, Math.round(left.y + t * (right.y - left.y))));
	});
}
