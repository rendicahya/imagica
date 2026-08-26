<script lang="ts">
	import type { Histogram } from '$lib/image-processing/enhancement/histogram';

	interface Props {
		histogram: Histogram;
		mode?: 'gray' | 'rgb';
		range?: [number, number] | null;
	}

	let { histogram, mode = 'gray', range = null }: Props = $props();

	const width = 256;
	const height = 120;

	let hoveredBin = $state<number | null>(null);

	function toPath(values: number[]): string {
		const max = Math.max(...values, 1);
		return values.map((v, i) => `${i},${height - (v / max) * height}`).join(' L');
	}

	let grayPath = $derived(`M0,${height} L${toPath(histogram.gray)} L${width},${height} Z`);
	let redPath = $derived(`M0,${height} L${toPath(histogram.red)} L${width},${height} Z`);
	let greenPath = $derived(`M0,${height} L${toPath(histogram.green)} L${width},${height} Z`);
	let bluePath = $derived(`M0,${height} L${toPath(histogram.blue)} L${width},${height} Z`);

	function handleMove(event: MouseEvent & { currentTarget: SVGSVGElement }) {
		const rect = event.currentTarget.getBoundingClientRect();
		const bin = Math.floor(((event.clientX - rect.left) / rect.width) * width);
		hoveredBin = Math.min(255, Math.max(0, bin));
	}
</script>

<div class="histogram">
	<svg
		viewBox="0 0 {width} {height}"
		preserveAspectRatio="none"
		onmousemove={handleMove}
		onmouseleave={() => (hoveredBin = null)}
		role="img"
		aria-label="Histogram distribusi intensitas pixel"
	>
		{#if mode === 'gray'}
			<path d={grayPath} class="gray" />
		{:else}
			<path d={redPath} class="channel red" />
			<path d={greenPath} class="channel green" />
			<path d={bluePath} class="channel blue" />
		{/if}

		{#if range}
			<rect x={range[0]} y="0" width={range[1] - range[0]} {height} class="range" />
		{/if}

		{#if hoveredBin !== null}
			<line x1={hoveredBin} x2={hoveredBin} y1="0" y2={height} class="cursor" />
		{/if}
	</svg>

	<div class="axis">
		<span>0</span>
		<span>128</span>
		<span>255</span>
	</div>

	{#if hoveredBin !== null}
		<p class="tooltip">
			Intensitas {hoveredBin}:
			{#if mode === 'gray'}
				{histogram.gray[hoveredBin]} pixel
			{:else}
				R={histogram.red[hoveredBin]} G={histogram.green[hoveredBin]} B={histogram.blue[hoveredBin]}
			{/if}
		</p>
	{/if}
</div>

<style>
	.histogram {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	svg {
		width: 100%;
		height: 8rem;
		background: var(--color-surface, #fafafa);
		border: 1px solid var(--color-border, #ccc);
		cursor: crosshair;
	}

	.gray {
		fill: #666;
	}

	.channel {
		mix-blend-mode: multiply;
		opacity: 0.75;
	}

	.channel.red {
		fill: #ef4444;
	}
	.channel.green {
		fill: #22c55e;
	}
	.channel.blue {
		fill: #3b82f6;
	}

	.range {
		fill: var(--color-accent, #6366f1);
		opacity: 0.15;
	}

	.cursor {
		stroke: var(--color-accent, #6366f1);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.axis {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--color-muted, #666);
	}

	.tooltip {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0;
	}
</style>
