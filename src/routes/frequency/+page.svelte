<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import {
		applyFrequencyFilter,
		dft2d,
		fieldToGrayscaleImage,
		fftShift,
		grayscaleField,
		idft2d,
		magnitudeSpectrumImage,
		type FilterKind
	} from '$lib/image-processing/frequency/fourier';

	const MAX_SIZE = 96;

	function downscale(imageData: ImageData, maxSize: number): ImageData {
		if (imageData.width <= maxSize && imageData.height <= maxSize) return imageData;

		const scale = maxSize / Math.max(imageData.width, imageData.height);
		const width = Math.max(1, Math.round(imageData.width * scale));
		const height = Math.max(1, Math.round(imageData.height * scale));

		const source = document.createElement('canvas');
		source.width = imageData.width;
		source.height = imageData.height;
		source.getContext('2d')?.putImageData(imageData, 0, 0);

		const target = document.createElement('canvas');
		target.width = width;
		target.height = height;
		const ctx = target.getContext('2d');
		ctx?.drawImage(source, 0, 0, width, height);

		return ctx?.getImageData(0, 0, width, height) ?? imageData;
	}

	let filterKind = $state<FilterKind>('low-pass');
	let innerRadius = $state(5);
	let outerRadius = $state(20);

	let small = $derived(
		imageStore.current ? downscale(imageStore.current.imageData, MAX_SIZE) : null
	);

	let spectrum = $derived(small ? dft2d(grayscaleField(small), small.width, small.height) : null);

	let spectrumImage = $derived(spectrum ? magnitudeSpectrumImage(fftShift(spectrum)) : null);

	let filteredSpectrum = $derived(
		spectrum ? applyFrequencyFilter(spectrum, filterKind, innerRadius, outerRadius) : null
	);

	let filteredSpectrumImage = $derived(
		filteredSpectrum ? magnitudeSpectrumImage(fftShift(filteredSpectrum)) : null
	);

	let output = $derived(
		filteredSpectrum && small
			? fieldToGrayscaleImage(idft2d(filteredSpectrum), small.width, small.height)
			: null
	);
</script>

<svelte:head>
	<title>Frequency Domain Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Frequency Domain Explorer</h1>
		<p>
			Setiap gambar dapat diurai menjadi kombinasi gelombang berfrekuensi berbeda. Gambar diperkecil
			menjadi maksimal {MAX_SIZE}px agar transformasi tetap responsif.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if small && spectrumImage && filteredSpectrumImage && output}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={small} caption="Spatial Domain" />
				<CanvasFrame imageData={spectrumImage} caption="Frequency Spectrum" />
				<CanvasFrame imageData={filteredSpectrumImage} caption="Filtered Spectrum" />
				<CanvasFrame imageData={output} caption="Output (Inverse Transform)" />
			</div>

			<aside class="side">
				<div class="tabs">
					<button
						type="button"
						class:active={filterKind === 'low-pass'}
						onclick={() => (filterKind = 'low-pass')}>Low-pass</button
					>
					<button
						type="button"
						class:active={filterKind === 'high-pass'}
						onclick={() => (filterKind = 'high-pass')}>High-pass</button
					>
					<button
						type="button"
						class:active={filterKind === 'band-pass'}
						onclick={() => (filterKind = 'band-pass')}>Band-pass</button
					>
				</div>

				{#if filterKind !== 'low-pass'}
					<ParameterSlider
						label="Inner radius"
						bind:value={innerRadius}
						min={0}
						max={MAX_SIZE / 2}
						defaultValue={5}
					/>
				{/if}
				{#if filterKind !== 'high-pass'}
					<ParameterSlider
						label="Outer radius"
						bind:value={outerRadius}
						min={1}
						max={MAX_SIZE / 2}
						defaultValue={20}
					/>
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
		max-width: 78rem;
		margin: 0 auto;
	}

	.workspace {
		display: grid;
		grid-template-columns: 1fr 16rem;
		gap: 1.5rem;
		align-items: start;
	}

	.images {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 1rem;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tabs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tabs button.active {
		background: var(--color-accent, #6366f1);
		color: white;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
