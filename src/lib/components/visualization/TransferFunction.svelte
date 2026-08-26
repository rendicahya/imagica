<script lang="ts">
	interface Props {
		lut: number[];
	}

	let { lut }: Props = $props();

	let path = $derived(`M${lut.map((y, x) => `${x},${255 - y}`).join(' L')}`);
</script>

<svg viewBox="0 0 255 255" preserveAspectRatio="none" class="curve">
	<line x1="0" y1="255" x2="255" y2="0" class="reference" />
	<path d={path} class="curve-line" />
</svg>

<style>
	.curve {
		width: 12rem;
		height: 12rem;
		background: var(--color-surface, #fafafa);
		border: 1px solid var(--color-border, #ccc);
	}

	.reference {
		stroke: var(--color-border, #ccc);
		stroke-dasharray: 4 4;
		vector-effect: non-scaling-stroke;
	}

	.curve-line {
		fill: none;
		stroke: var(--color-accent, #6366f1);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}
</style>
