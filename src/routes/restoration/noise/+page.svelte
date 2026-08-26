<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import {
		addGaussianNoise,
		addSaltAndPepperNoise,
		addSpeckleNoise,
		motionBlurKernel
	} from '$lib/image-processing/restoration/noise';
	import { gaussianBlur } from '$lib/image-processing/filtering/smoothing';
	import { convolve } from '$lib/image-processing/filtering/convolution';

	type Kind = 'gaussian' | 'salt-pepper' | 'speckle' | 'gaussian-blur' | 'motion-blur';

	let kind = $state<Kind>('gaussian');
	let amount = $state(25);
	let angle = $state(0);

	let degraded = $derived.by(() => {
		const image = imageStore.current;
		if (!image) return null;

		switch (kind) {
			case 'gaussian':
				return addGaussianNoise(image.imageData, amount);
			case 'salt-pepper':
				return addSaltAndPepperNoise(image.imageData, amount / 100);
			case 'speckle':
				return addSpeckleNoise(image.imageData, amount / 100);
			case 'gaussian-blur':
				return gaussianBlur(image.imageData, 9, amount / 10);
			case 'motion-blur':
				return convolve(image.imageData, motionBlurKernel(15, angle));
		}
	});
</script>

<svelte:head>
	<title>Noise Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Noise Explorer</h1>
		<p>Gambar di dunia nyata jarang sempurna. Coba tambahkan berbagai jenis derau dan degradasi.</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if degraded}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="main">
				<BeforeAfterViewer original={image.imageData} processed={degraded} />
			</div>
			<aside class="side">
				<div class="tabs">
					<button
						type="button"
						class:active={kind === 'gaussian'}
						onclick={() => (kind = 'gaussian')}>Gaussian Noise</button
					>
					<button
						type="button"
						class:active={kind === 'salt-pepper'}
						onclick={() => (kind = 'salt-pepper')}>Salt &amp; Pepper</button
					>
					<button type="button" class:active={kind === 'speckle'} onclick={() => (kind = 'speckle')}
						>Speckle</button
					>
					<button
						type="button"
						class:active={kind === 'gaussian-blur'}
						onclick={() => (kind = 'gaussian-blur')}>Gaussian Blur</button
					>
					<button
						type="button"
						class:active={kind === 'motion-blur'}
						onclick={() => (kind = 'motion-blur')}>Motion Blur</button
					>
				</div>

				{#if kind === 'gaussian' || kind === 'gaussian-blur'}
					<ParameterSlider label="Amount" bind:value={amount} min={1} max={100} defaultValue={25} />
				{:else if kind === 'salt-pepper' || kind === 'speckle'}
					<ParameterSlider
						label="Amount (%)"
						bind:value={amount}
						min={1}
						max={100}
						defaultValue={25}
					/>
				{:else}
					<ParameterSlider
						label="Angle"
						bind:value={angle}
						min={0}
						max={180}
						defaultValue={0}
						unit="°"
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
		max-width: 72rem;
		margin: 0 auto;
	}

	.workspace {
		display: grid;
		grid-template-columns: 1fr 18rem;
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
