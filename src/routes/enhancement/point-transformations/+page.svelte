<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import TransferFunction from '$lib/components/visualization/TransferFunction.svelte';
	import {
		applyLut,
		brightnessContrastLut,
		gammaLut,
		negativeLut
	} from '$lib/image-processing/enhancement/point-transform';

	type TransformKind = 'brightness-contrast' | 'negative' | 'gamma';

	let kind = $state<TransformKind>('brightness-contrast');
	let brightness = $state(0);
	let contrast = $state(1);
	let gamma = $state(1);

	let lut = $derived(
		kind === 'negative'
			? negativeLut()
			: kind === 'gamma'
				? gammaLut(gamma)
				: brightnessContrastLut(contrast, brightness)
	);

	let processed = $derived(imageStore.current ? applyLut(imageStore.current.imageData, lut) : null);
</script>

<svelte:head>
	<title>Point Transformations — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Point Transformations</h1>
		<p>
			Setiap pixel diubah berdasarkan fungsi transformasi g(x) yang sama, terlepas dari posisinya.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if processed}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="main">
				<BeforeAfterViewer original={image.imageData} {processed} />
			</div>

			<aside class="side">
				<div class="tabs">
					<button
						type="button"
						class:active={kind === 'brightness-contrast'}
						onclick={() => (kind = 'brightness-contrast')}
					>
						Brightness / Contrast
					</button>
					<button
						type="button"
						class:active={kind === 'negative'}
						onclick={() => (kind = 'negative')}>Negative</button
					>
					<button type="button" class:active={kind === 'gamma'} onclick={() => (kind = 'gamma')}
						>Gamma</button
					>
				</div>

				{#if kind === 'brightness-contrast'}
					<ParameterSlider
						label="Brightness (β)"
						bind:value={brightness}
						min={-100}
						max={100}
						defaultValue={0}
					/>
					<ParameterSlider
						label="Contrast (α)"
						bind:value={contrast}
						min={0}
						max={3}
						step={0.05}
						defaultValue={1}
					/>
					<p class="formula">g(x, y) = αf(x, y) + β</p>
				{:else if kind === 'gamma'}
					<ParameterSlider
						label="Gamma (γ)"
						bind:value={gamma}
						min={0.1}
						max={5}
						step={0.05}
						defaultValue={1}
					/>
					<p class="formula">g(x, y) = 255 · (f(x, y) / 255)^(1/γ)</p>
				{:else}
					<p class="formula">g(x, y) = 255 − f(x, y)</p>
				{/if}

				<TransferFunction {lut} />

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
		gap: 1rem;
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

	.formula {
		font-family: monospace;
		color: var(--color-muted, #666);
		margin: 0;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
