<script lang="ts">
	interface Props {
		imageData: ImageData;
		caption?: string;
	}

	let { imageData, caption }: Props = $props();
	let canvas: HTMLCanvasElement;

	$effect(() => {
		if (!canvas) return;
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		canvas.getContext('2d')?.putImageData(imageData, 0, 0);
	});
</script>

<figure>
	<canvas bind:this={canvas}></canvas>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	figure {
		margin: 0;
	}

	canvas {
		display: block;
		width: 100%;
		max-width: 100%;
		height: auto;
		border: 1px solid var(--color-border, #ccc);
	}

	figcaption {
		text-align: center;
		color: var(--color-muted, #666);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
