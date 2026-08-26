<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import TransferFunction from '$lib/components/visualization/TransferFunction.svelte';
	import { equalizeHistogram } from '$lib/image-processing/enhancement/equalization';

	let stepMode = $state(false);

	let result = $derived(
		imageStore.current ? equalizeHistogram(imageStore.current.imageData) : null
	);

	function toPath(values: number[], height: number): string {
		const max = Math.max(...values, 1e-9);
		return `M${values.map((v, i) => `${i},${height - (v / max) * height}`).join(' L')}`;
	}
</script>

<svelte:head>
	<title>Histogram Equalization — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Histogram Equalization</h1>
		<p>
			Meratakan distribusi intensitas agar kontras gambar meningkat, menggunakan fungsi distribusi
			kumulatif (CDF).
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if result}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original" />
				<CanvasFrame imageData={result.image} caption="Equalized" />
			</div>

			<label class="checkbox">
				<input type="checkbox" bind:checked={stepMode} />
				Mode langkah demi langkah
			</label>

			{#if stepMode}
				<div class="steps">
					<div class="step">
						<h2>Histogram</h2>
						<svg viewBox="0 0 256 100" preserveAspectRatio="none" class="chart">
							<path d="{toPath(result.histogram, 100)} L256,100 L0,100 Z" class="fill" />
						</svg>
					</div>
					<div class="step">
						<h2>PDF</h2>
						<svg viewBox="0 0 256 100" preserveAspectRatio="none" class="chart">
							<path d="{toPath(result.pdf, 100)} L256,100 L0,100 Z" class="fill" />
						</svg>
					</div>
					<div class="step">
						<h2>CDF</h2>
						<svg viewBox="0 0 256 100" preserveAspectRatio="none" class="chart">
							<path d={toPath(result.cdf, 100)} class="line" />
						</svg>
					</div>
					<div class="step">
						<h2>Intensity Mapping</h2>
						<TransferFunction lut={result.mapping} />
					</div>
				</div>
			{/if}

			<button type="button" onclick={() => imageStore.clear()}>Ganti Gambar</button>
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
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.images {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}

	.step h2 {
		font-size: 0.9rem;
		margin: 0 0 0.25rem;
	}

	.chart {
		width: 100%;
		height: 6rem;
		background: var(--color-surface, #fafafa);
		border: 1px solid var(--color-border, #ccc);
	}

	.fill {
		fill: var(--color-accent, #6366f1);
		opacity: 0.6;
	}

	.line {
		fill: none;
		stroke: var(--color-accent, #6366f1);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}

	@media (max-width: 768px) {
		.images {
			grid-template-columns: 1fr;
		}
	}
</style>
