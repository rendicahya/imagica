<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { addGaussianNoise, addSaltAndPepperNoise } from '$lib/image-processing/restoration/noise';
	import { boxBlur, gaussianBlur, medianFilter } from '$lib/image-processing/filtering/smoothing';
	import { mse } from '$lib/image-processing/metrics/mse';
	import { psnr } from '$lib/image-processing/metrics/psnr';
	import { ssim } from '$lib/image-processing/metrics/ssim';

	type NoiseKind = 'gaussian' | 'salt-pepper';
	type FilterKind = 'mean' | 'gaussian' | 'median';

	let noiseKind = $state<NoiseKind>('salt-pepper');
	let noiseAmount = $state(10);
	let filterKind = $state<FilterKind>('median');
	let filterSize = $state(3);

	let degraded = $derived(
		imageStore.current
			? noiseKind === 'gaussian'
				? addGaussianNoise(imageStore.current.imageData, noiseAmount)
				: addSaltAndPepperNoise(imageStore.current.imageData, noiseAmount / 100)
			: null
	);

	let restored = $derived(
		degraded
			? filterKind === 'mean'
				? boxBlur(degraded, filterSize)
				: filterKind === 'gaussian'
					? gaussianBlur(degraded, filterSize, filterSize / 3)
					: medianFilter(degraded, filterSize)
			: null
	);

	let metrics = $derived(
		imageStore.current && restored
			? {
					mse: mse(imageStore.current.imageData, restored),
					psnr: psnr(imageStore.current.imageData, restored),
					ssim: ssim(imageStore.current.imageData, restored)
				}
			: null
	);
</script>

<svelte:head>
	<title>Image Restoration Lab — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Image Restoration Lab</h1>
		<p>
			Tambahkan derau ke gambar, lalu coba berbagai filter restorasi. Bandingkan hasilnya dengan
			metrik MSE, PSNR, dan SSIM — bukan langsung diberi tahu filter mana yang "terbaik".
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if degraded && restored && metrics}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original" />
				<CanvasFrame imageData={degraded} caption="Degraded" />
				<CanvasFrame imageData={restored} caption="Restored" />
			</div>

			<aside class="side">
				<div>
					<h2>Noise</h2>
					<div class="tabs">
						<button
							type="button"
							class:active={noiseKind === 'salt-pepper'}
							onclick={() => (noiseKind = 'salt-pepper')}>Salt &amp; Pepper</button
						>
						<button
							type="button"
							class:active={noiseKind === 'gaussian'}
							onclick={() => (noiseKind = 'gaussian')}>Gaussian</button
						>
					</div>
					<ParameterSlider
						label="Amount"
						bind:value={noiseAmount}
						min={1}
						max={50}
						defaultValue={10}
					/>
				</div>

				<div>
					<h2>Filter</h2>
					<div class="tabs">
						<button
							type="button"
							class:active={filterKind === 'mean'}
							onclick={() => (filterKind = 'mean')}>Mean</button
						>
						<button
							type="button"
							class:active={filterKind === 'gaussian'}
							onclick={() => (filterKind = 'gaussian')}>Gaussian</button
						>
						<button
							type="button"
							class:active={filterKind === 'median'}
							onclick={() => (filterKind = 'median')}>Median</button
						>
					</div>
					<ParameterSlider
						label="Ukuran kernel"
						bind:value={filterSize}
						min={3}
						max={9}
						step={2}
						defaultValue={3}
					/>
				</div>

				<div>
					<h2>Metrik</h2>
					<dl>
						<dt>MSE</dt>
						<dd>{metrics.mse.toFixed(2)}</dd>
						<dt>PSNR</dt>
						<dd>{Number.isFinite(metrics.psnr) ? `${metrics.psnr.toFixed(2)} dB` : '∞'}</dd>
						<dt>SSIM</dt>
						<dd>{metrics.ssim.toFixed(3)}</dd>
					</dl>
				</div>

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
		max-width: 78rem;
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
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.side h2 {
		font-size: 0.9rem;
		margin: 0 0 0.5rem;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.5rem;
	}

	.tabs button.active {
		background: var(--color-accent, #6366f1);
		color: white;
	}

	dl {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 0.75rem;
		font-variant-numeric: tabular-nums;
		margin: 0;
	}

	dt {
		color: var(--color-muted, #666);
	}

	dd {
		margin: 0;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
