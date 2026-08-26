<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import {
		quantize,
		resample,
		type InterpolationMethod
	} from '$lib/image-processing/core/resample';

	let scalePercent = $state(25);
	let method = $state<InterpolationMethod>('bilinear');
	let bitDepth = $state(8);

	let downscaled = $derived.by(() => {
		const image = imageStore.current;
		if (!image) return null;

		const targetWidth = Math.max(1, Math.round((image.width * scalePercent) / 100));
		const targetHeight = Math.max(1, Math.round((image.height * scalePercent) / 100));
		return resample(image.imageData, targetWidth, targetHeight, method);
	});

	let upscaled = $derived(
		downscaled && imageStore.current
			? resample(downscaled, imageStore.current.width, imageStore.current.height, method)
			: null
	);

	let quantized = $derived(
		imageStore.current ? quantize(imageStore.current.imageData, Math.pow(2, bitDepth)) : null
	);
</script>

<svelte:head>
	<title>Resolution Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Resolution Explorer</h1>
		<p>
			Sampling menentukan berapa banyak titik yang mewakili gambar (resolusi). Quantization
			menentukan berapa banyak level intensitas yang tersedia (bit depth).
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else}
		{@const image = imageStore.current}
		<section class="section">
			<h2>Sampling &amp; Interpolasi</h2>
			<div class="controls">
				<ParameterSlider
					label="Skala"
					bind:value={scalePercent}
					min={5}
					max={100}
					defaultValue={25}
					unit="%"
				/>
				<div class="tabs">
					<button
						type="button"
						class:active={method === 'nearest'}
						onclick={() => (method = 'nearest')}>Nearest Neighbor</button
					>
					<button
						type="button"
						class:active={method === 'bilinear'}
						onclick={() => (method = 'bilinear')}>Bilinear</button
					>
					<button
						type="button"
						class:active={method === 'bicubic'}
						onclick={() => (method = 'bicubic')}>Bicubic</button
					>
				</div>
			</div>

			{#if downscaled && upscaled}
				<div class="images">
					<CanvasFrame
						imageData={image.imageData}
						caption="Original ({image.width}×{image.height})"
					/>
					<CanvasFrame
						imageData={downscaled}
						caption="Downscaled ({downscaled.width}×{downscaled.height})"
					/>
					<CanvasFrame imageData={upscaled} caption="Diperbesar Kembali" />
				</div>
			{/if}
		</section>

		<section class="section">
			<h2>Quantization (Bit Depth)</h2>
			<ParameterSlider label="Bit depth" bind:value={bitDepth} min={1} max={8} defaultValue={8} />
			<p class="hint">{Math.pow(2, bitDepth)} level intensitas per channel.</p>

			{#if quantized}
				<div class="images">
					<CanvasFrame imageData={image.imageData} caption="8-bit (256 level)" />
					<CanvasFrame
						imageData={quantized}
						caption="{bitDepth}-bit ({Math.pow(2, bitDepth)} level)"
					/>
				</div>
			{/if}
		</section>

		<button type="button" onclick={() => imageStore.clear()}>Ganti Gambar</button>
	{/if}
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 1.5rem;
		max-width: 72rem;
		margin: 0 auto;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: center;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tabs button.active {
		background: var(--color-accent, #6366f1);
		color: white;
	}

	.images {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}

	.hint {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0;
	}
</style>
