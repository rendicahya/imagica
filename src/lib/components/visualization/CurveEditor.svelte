<script lang="ts">
	import type { ControlPoint } from '$lib/image-processing/enhancement/custom-curve';

	interface Props {
		points: ControlPoint[];
	}

	let { points = $bindable() }: Props = $props();

	let svg: SVGSVGElement;
	let draggingIndex = $state<number | null>(null);

	let sortedIndices = $derived(points.map((_, i) => i).sort((a, b) => points[a].x - points[b].x));

	let path = $derived.by(() => {
		const sorted = sortedIndices.map((i) => points[i]);
		return `M${sorted.map((p) => `${p.x},${255 - p.y}`).join(' L')}`;
	});

	function toSvgPoint(event: PointerEvent): ControlPoint {
		const rect = svg.getBoundingClientRect();
		const x = Math.round(((event.clientX - rect.left) / rect.width) * 255);
		const y = Math.round(255 - ((event.clientY - rect.top) / rect.height) * 255);
		return { x: Math.min(255, Math.max(0, x)), y: Math.min(255, Math.max(0, y)) };
	}

	function handlePointerDown(index: number, event: PointerEvent) {
		event.stopPropagation();
		draggingIndex = index;
		(event.target as Element).setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (draggingIndex === null) return;
		const point = toSvgPoint(event);
		const index = draggingIndex;
		const isEndpoint = index === 0 || index === points.length - 1;

		points = points.map((p, i) =>
			i === index ? { x: isEndpoint ? p.x : point.x, y: point.y } : p
		);
	}

	function handlePointerUp() {
		draggingIndex = null;
	}

	function handleSvgClick(event: PointerEvent) {
		if (draggingIndex !== null) return;
		const point = toSvgPoint(event);
		points = [...points, point];
	}

	function removePoint(index: number, event: MouseEvent) {
		event.stopPropagation();
		if (index === 0 || index === points.length - 1) return;
		points = points.filter((_, i) => i !== index);
	}
</script>

<svg
	bind:this={svg}
	viewBox="0 0 255 255"
	preserveAspectRatio="none"
	class="editor"
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointerdown={handleSvgClick}
	role="img"
	aria-label="Editor kurva transformasi intensitas"
>
	<line x1="0" y1="255" x2="255" y2="0" class="reference" />
	<path d={path} class="curve" />

	{#each points as point, index (index)}
		<circle
			cx={point.x}
			cy={255 - point.y}
			r="6"
			class="point"
			onpointerdown={(e) => handlePointerDown(index, e)}
			ondblclick={(e) => removePoint(index, e)}
			role="slider"
			aria-label="Titik kontrol {index}"
			aria-valuenow={point.y}
			tabindex="0"
		/>
	{/each}
</svg>

<p class="hint">Klik untuk menambah titik, seret untuk mengubah, klik dua kali untuk menghapus.</p>

<style>
	.editor {
		width: 100%;
		max-width: 20rem;
		aspect-ratio: 1;
		background: var(--color-surface, #fafafa);
		border: 1px solid var(--color-border, #ccc);
		touch-action: none;
	}

	.reference {
		stroke: var(--color-border, #ccc);
		stroke-dasharray: 4 4;
		vector-effect: non-scaling-stroke;
	}

	.curve {
		fill: none;
		stroke: var(--color-accent, #6366f1);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}

	.point {
		fill: var(--color-accent, #6366f1);
		stroke: white;
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
		cursor: grab;
	}

	.hint {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0.25rem 0 0;
	}
</style>
