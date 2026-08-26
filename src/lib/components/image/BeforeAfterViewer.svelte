<script lang="ts">
	import { differenceImage } from '$lib/image-processing/core/image';

	interface Props {
		original: ImageData;
		processed: ImageData;
	}

	let { original, processed }: Props = $props();

	let mode = $state<'side-by-side' | 'split' | 'difference'>('side-by-side');
	let splitPosition = $state(50);

	let originalCanvas: HTMLCanvasElement | undefined = $state();
	let processedCanvas: HTMLCanvasElement | undefined = $state();
	let diffCanvas: HTMLCanvasElement | undefined = $state();

	function draw(canvas: HTMLCanvasElement | undefined, data: ImageData) {
		if (!canvas) return;
		canvas.width = data.width;
		canvas.height = data.height;
		canvas.getContext('2d')?.putImageData(data, 0, 0);
	}

	$effect(() => {
		draw(originalCanvas, original);
	});

	$effect(() => {
		draw(processedCanvas, processed);
	});

	$effect(() => {
		if (mode === 'difference') draw(diffCanvas, differenceImage(original, processed));
	});
</script>

<div class="viewer">
	<div class="toolbar">
		<label><input type="radio" bind:group={mode} value="side-by-side" /> Side by side</label>
		<label><input type="radio" bind:group={mode} value="split" /> Split slider</label>
		<label><input type="radio" bind:group={mode} value="difference" /> Difference</label>
	</div>

	{#if mode === 'side-by-side'}
		<div class="side-by-side">
			<figure>
				<canvas bind:this={originalCanvas}></canvas>
				<figcaption>Original</figcaption>
			</figure>
			<figure>
				<canvas bind:this={processedCanvas}></canvas>
				<figcaption>Processed</figcaption>
			</figure>
		</div>
	{:else if mode === 'split'}
		<div class="split" style:aspect-ratio="{original.width} / {original.height}">
			<canvas bind:this={processedCanvas} class="layer"></canvas>
			<div class="layer clip" style:clip-path="inset(0 {100 - splitPosition}% 0 0)">
				<canvas bind:this={originalCanvas}></canvas>
			</div>
			<div class="divider" style:left="{splitPosition}%"></div>
		</div>
		<input type="range" min="0" max="100" bind:value={splitPosition} />
	{:else}
		<canvas bind:this={diffCanvas}></canvas>
	{/if}
</div>

<style>
	.viewer {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.toolbar {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.side-by-side {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
	}

	figure {
		margin: 0;
	}

	canvas {
		max-width: 100%;
		display: block;
	}

	figcaption {
		text-align: center;
		color: var(--color-muted, #666);
		font-size: 0.875rem;
	}

	.split {
		position: relative;
		width: 100%;
		max-width: 40rem;
	}

	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.layer canvas,
	.split > canvas {
		width: 100%;
		height: 100%;
	}

	.divider {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--color-accent, #6366f1);
	}
</style>
