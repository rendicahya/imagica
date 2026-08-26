<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import HistogramViewer from '$lib/components/histogram/HistogramViewer.svelte';
	import { computeHistogram, highlightRange } from '$lib/image-processing/enhancement/histogram';

	let mode = $state<'gray' | 'rgb'>('gray');
	let rangeEnabled = $state(false);
	let rangeMin = $state(0);
	let rangeMax = $state(255);

	let histogram = $derived(
		imageStore.current ? computeHistogram(imageStore.current.imageData) : null
	);

	let displayed = $derived(
		imageStore.current
			? rangeEnabled
				? highlightRange(imageStore.current.imageData, rangeMin, rangeMax)
				: imageStore.current.imageData
			: null
	);
</script>

<svelte:head>
	<title>Histogram Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Histogram Explorer</h1>
		<p>Histogram menunjukkan bagaimana nilai intensitas tersebar di seluruh pixel gambar.</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if histogram && displayed}
		<section class="workspace">
			<div class="main">
				<CanvasFrame imageData={displayed} caption="Gambar" />
			</div>

			<aside class="side">
				<div class="tabs">
					<button type="button" class:active={mode === 'gray'} onclick={() => (mode = 'gray')}
						>Grayscale</button
					>
					<button type="button" class:active={mode === 'rgb'} onclick={() => (mode = 'rgb')}
						>RGB</button
					>
				</div>

				<HistogramViewer {histogram} {mode} range={rangeEnabled ? [rangeMin, rangeMax] : null} />

				<label class="checkbox">
					<input type="checkbox" bind:checked={rangeEnabled} />
					Pilih rentang intensitas
				</label>

				{#if rangeEnabled}
					<div class="range-controls">
						<label>
							Min <input type="range" min="0" max="255" bind:value={rangeMin} />
							{rangeMin}
						</label>
						<label>
							Max <input type="range" min="0" max="255" bind:value={rangeMax} />
							{rangeMax}
						</label>
					</div>
					<p class="hint">Pixel di luar rentang ini digelapkan pada gambar.</p>
				{/if}

				<button type="button" onclick={() => imageStore.clear()}>Ganti Gambar</button>
			</aside>
		</section>
	{/if}
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		max-width: 72rem;
		margin: 0 auto;
	}

	.workspace {
		display: grid;
		grid-template-columns: 1fr 20rem;
		gap: 1.5rem;
		align-items: start;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tabs button.active {
		background: var(--color-accent, #6366f1);
		color: white;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.range-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.range-controls label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-variant-numeric: tabular-nums;
	}

	.range-controls input {
		flex: 1;
	}

	.hint {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
