<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { addSaltAndPepperNoise } from '$lib/image-processing/restoration/noise';
	import { psnr } from '$lib/image-processing/metrics/psnr';
	import { ssim } from '$lib/image-processing/metrics/ssim';
	import {
		boxBlurAsync,
		gaussianBlurAsync,
		medianFilterAsync
	} from '$lib/workers/processing-client';
	import { asyncResult } from '$lib/workers/async-result.svelte';

	type FilterKind = 'mean' | 'gaussian' | 'median';

	let degraded = $state<ImageData | null>(null);
	let filterKind = $state<FilterKind>('mean');
	let filterSize = $state(3);
	let revealed = $state(false);

	$effect(() => {
		const image = imageStore.current;
		if (image && !degraded) {
			degraded = addSaltAndPepperNoise(image.imageData, 0.12);
		}
	});

	const restoredResult = asyncResult(() =>
		degraded
			? filterKind === 'mean'
				? boxBlurAsync(degraded, filterSize)
				: filterKind === 'gaussian'
					? gaussianBlurAsync(degraded, filterSize, filterSize / 3)
					: medianFilterAsync(degraded, filterSize)
			: null
	);
	let restored = $derived(restoredResult.value);

	let score = $derived(
		imageStore.current && restored && revealed
			? {
					psnr: psnr(imageStore.current.imageData, restored),
					ssim: ssim(imageStore.current.imageData, restored)
				}
			: null
	);

	function reset() {
		imageStore.clear();
		degraded = null;
		revealed = false;
	}
</script>

<svelte:head>
	<title>Challenges — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Challenge: Bersihkan Noise, Pertahankan Detail</h1>
		<p>
			Gambar berikut sudah terkena <em>salt-and-pepper noise</em>. Pilih filter dan parameter yang
			menurut Anda paling baik membersihkan noise tanpa terlalu mengaburkan detail penting.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if degraded && restored}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={degraded} caption="Gambar Bermasalah" />
				<CanvasFrame imageData={restored} caption="Hasil Anda" />
			</div>

			<aside class="side">
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

				{#if !revealed}
					<button type="button" onclick={() => (revealed = true)}>Cek Hasil</button>
				{:else if score}
					<div class="score">
						<h2>Skor</h2>
						<dl>
							<dt>PSNR</dt>
							<dd>
								{Number.isFinite(score.psnr) ? `${score.psnr.toFixed(2)} dB` : '∞'} (lebih tinggi lebih
								baik)
							</dd>
							<dt>SSIM</dt>
							<dd>{score.ssim.toFixed(3)} (mendekati 1 lebih baik)</dd>
						</dl>
						<CanvasFrame imageData={image.imageData} caption="Gambar Asli" />
					</div>
				{/if}

				<button type="button" onclick={reset}>Coba Gambar Lain</button>
			</aside>
		</section>
	{:else if degraded}
		<p class="hint">Memproses…</p>
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

	.score {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border, #ccc);
		border-radius: 0.5rem;
	}

	dl {
		display: grid;
		grid-template-columns: auto 1fr;
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
