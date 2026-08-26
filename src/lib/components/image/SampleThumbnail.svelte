<script lang="ts">
	import type { SampleImage } from '$lib/image-processing/core/samples';

	interface Props {
		sample: SampleImage;
		onselect: (imageData: ImageData) => void;
	}

	let { sample, onselect }: Props = $props();

	let canvas: HTMLCanvasElement;
	const thumbnailSize = 64;

	$effect(() => {
		const imageData = sample.generate(thumbnailSize);
		canvas.width = thumbnailSize;
		canvas.height = thumbnailSize;
		canvas.getContext('2d')?.putImageData(imageData, 0, 0);
	});

	function handleClick() {
		onselect(sample.generate(256));
	}
</script>

<button type="button" class="thumbnail" onclick={handleClick}>
	<canvas bind:this={canvas}></canvas>
	<span>{sample.name}</span>
</button>

<style>
	.thumbnail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}

	canvas {
		width: 4rem;
		height: 4rem;
		border-radius: 0.375rem;
		border: 1px solid var(--color-border, #ccc);
	}

	.thumbnail:hover canvas,
	.thumbnail:focus-visible canvas {
		border-color: var(--color-accent, #6366f1);
	}

	span {
		font-size: 0.75rem;
		color: var(--color-muted, #666);
	}
</style>
