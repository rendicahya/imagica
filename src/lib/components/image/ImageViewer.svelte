<script lang="ts">
	interface Props {
		imageData: ImageData;
		selected?: { x: number; y: number } | null;
	}

	let { imageData, selected = $bindable(null) }: Props = $props();

	let canvas: HTMLCanvasElement;
	let zoom = $state(1);
	let hovered = $state<{ x: number; y: number } | null>(null);

	const minZoom = 0.1;
	const maxZoom = 32;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = imageData.width;
		canvas.height = imageData.height;
		ctx.putImageData(imageData, 0, 0);
	});

	function pointerToPixel(event: PointerEvent): { x: number; y: number } | null {
		const rect = canvas.getBoundingClientRect();
		const x = Math.floor(((event.clientX - rect.left) / rect.width) * imageData.width);
		const y = Math.floor(((event.clientY - rect.top) / rect.height) * imageData.height);

		if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return null;
		return { x, y };
	}

	function handleMove(event: PointerEvent) {
		hovered = pointerToPixel(event);
	}

	function handleClick(event: PointerEvent) {
		selected = pointerToPixel(event);
	}

	function fitToScreen() {
		zoom = 1;
	}
</script>

<div class="viewer">
	<div class="toolbar">
		<label>
			Zoom
			<input type="range" min={minZoom} max={maxZoom} step="0.1" bind:value={zoom} />
		</label>
		<span class="zoom-value">{Math.round(zoom * 100)}%</span>
		<button type="button" onclick={fitToScreen}>Fit</button>
	</div>

	<div class="canvas-wrap">
		<div
			class="canvas-stage"
			style:width="{imageData.width * zoom}px"
			style:height="{imageData.height * zoom}px"
		>
			<canvas
				bind:this={canvas}
				style:width="{imageData.width * zoom}px"
				style:height="{imageData.height * zoom}px"
				style:image-rendering={zoom >= 4 ? 'pixelated' : 'auto'}
				onpointermove={handleMove}
				onpointerleave={() => (hovered = null)}
				onpointerdown={handleClick}
			></canvas>

			{#if selected}
				<div
					class="marker"
					style:left="{selected.x * zoom}px"
					style:top="{selected.y * zoom}px"
					style:width="{zoom}px"
					style:height="{zoom}px"
				></div>
			{/if}
		</div>
	</div>

	{#if hovered}
		<p class="coords">
			({hovered.x}, {hovered.y})
		</p>
	{/if}
</div>

<style>
	.viewer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.zoom-value {
		min-width: 3.5rem;
		font-variant-numeric: tabular-nums;
	}

	.canvas-wrap {
		overflow: auto;
		border: 1px solid var(--color-border, #ccc);
		max-height: 70vh;
	}

	.canvas-stage {
		position: relative;
	}

	canvas {
		display: block;
		cursor: crosshair;
	}

	.marker {
		position: absolute;
		outline: 2px solid var(--color-accent, #6366f1);
		outline-offset: -1px;
		pointer-events: none;
	}

	.coords {
		font-variant-numeric: tabular-nums;
		color: var(--color-muted, #666);
	}
</style>
