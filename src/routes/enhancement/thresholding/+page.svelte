<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import HistogramViewer from '$lib/components/histogram/HistogramViewer.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { computeHistogram } from '$lib/image-processing/enhancement/histogram';
	import { adaptiveThreshold, globalThreshold } from '$lib/image-processing/enhancement/threshold';

	let mode = $state<'global' | 'adaptive'>('global');
	let level = $state(128);
	let blockSize = $state(11);
	let c = $state(5);

	let histogram = $derived(
		imageStore.current ? computeHistogram(imageStore.current.imageData) : null
	);

	let result = $derived(
		imageStore.current
			? mode === 'global'
				? globalThreshold(imageStore.current.imageData, level)
				: adaptiveThreshold(imageStore.current.imageData, blockSize, c)
			: null
	);
</script>

<svelte:head>
	<title>Thresholding — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Thresholding</h1>
		<p>
			Ubah gambar menjadi biner: setiap pixel menjadi hitam atau putih berdasarkan ambang batas.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if result && histogram}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original" />
				<CanvasFrame imageData={result} caption="Binary" />
			</div>

			<aside class="side">
				<div class="tabs">
					<button type="button" class:active={mode === 'global'} onclick={() => (mode = 'global')}
						>Global</button
					>
					<button
						type="button"
						class:active={mode === 'adaptive'}
						onclick={() => (mode = 'adaptive')}>Adaptive</button
					>
				</div>

				{#if mode === 'global'}
					<ParameterSlider
						label="Threshold"
						bind:value={level}
						min={0}
						max={255}
						defaultValue={128}
					/>
					<HistogramViewer {histogram} mode="gray" range={[level, 255]} />
				{:else}
					<ParameterSlider
						label="Block Size"
						bind:value={blockSize}
						min={3}
						max={51}
						step={2}
						defaultValue={11}
					/>
					<ParameterSlider label="C (bias)" bind:value={c} min={-20} max={20} defaultValue={5} />
					<p class="hint">
						Threshold dihitung ulang untuk tiap pixel dari rata-rata lokal di sekitarnya.
					</p>
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
		grid-template-columns: 1fr 18rem;
		gap: 1.5rem;
		align-items: start;
	}

	.images {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
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

	.hint {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
		.images {
			grid-template-columns: 1fr;
		}
	}
</style>
