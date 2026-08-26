<script lang="ts">
	import { getPixel, toGrayscale, toHex } from '$lib/image-processing/core/pixel';

	interface Props {
		imageData: ImageData;
		position: { x: number; y: number } | null;
	}

	let { imageData, position }: Props = $props();

	let pixel = $derived(position ? getPixel(imageData, position.x, position.y) : null);
</script>

<div class="inspector">
	{#if pixel}
		<div class="swatch" style:background-color="rgb({pixel.r} {pixel.g} {pixel.b})"></div>
		<dl>
			<dt>Posisi</dt>
			<dd>({pixel.x}, {pixel.y})</dd>

			<dt>RGB</dt>
			<dd>R={pixel.r} G={pixel.g} B={pixel.b}</dd>

			<dt>Hex</dt>
			<dd>{toHex(pixel.r, pixel.g, pixel.b)}</dd>

			<dt>Grayscale</dt>
			<dd>{toGrayscale(pixel.r, pixel.g, pixel.b)}</dd>
		</dl>
	{:else}
		<p class="hint">Klik pada gambar untuk melihat detail pixel.</p>
	{/if}
</div>

<style>
	.inspector {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.75rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 0.5rem;
	}

	.swatch {
		width: 3rem;
		height: 3rem;
		border-radius: 0.25rem;
		border: 1px solid var(--color-border, #ccc);
		flex-shrink: 0;
	}

	dl {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 0.75rem;
		row-gap: 0.25rem;
		margin: 0;
		font-variant-numeric: tabular-nums;
	}

	dt {
		color: var(--color-muted, #666);
	}

	dd {
		margin: 0;
	}

	.hint {
		color: var(--color-muted, #666);
	}
</style>
