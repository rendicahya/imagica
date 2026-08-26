<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { boxBlurAsync, gaussianBlurAsync } from '$lib/workers/processing-client';
	import { asyncResult } from '$lib/workers/async-result.svelte';

	let method = $state<'box' | 'gaussian'>('gaussian');
	let size = $state(5);
	let sigma = $state(1.5);

	const processedResult = asyncResult(() =>
		imageStore.current
			? method === 'box'
				? boxBlurAsync(imageStore.current.imageData, size)
				: gaussianBlurAsync(imageStore.current.imageData, size, sigma)
			: null
	);
	let processed = $derived(processedResult.value);
</script>

<svelte:head>
	<title>Smoothing — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Smoothing</h1>
		<p>
			Filter smoothing meratakan nilai pixel dengan tetangganya untuk mengurangi noise dan detail
			tajam.
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
					<button type="button" class:active={method === 'box'} onclick={() => (method = 'box')}
						>Box Blur</button
					>
					<button
						type="button"
						class:active={method === 'gaussian'}
						onclick={() => (method = 'gaussian')}>Gaussian Blur</button
					>
				</div>

				<ParameterSlider
					label="Ukuran kernel"
					bind:value={size}
					min={3}
					max={15}
					step={2}
					defaultValue={5}
				/>

				{#if method === 'gaussian'}
					<ParameterSlider
						label="Sigma"
						bind:value={sigma}
						min={0.3}
						max={6}
						step={0.1}
						defaultValue={1.5}
					/>
				{/if}

				<button type="button" onclick={() => imageStore.clear()}>Ganti Gambar</button>
			</aside>
		</section>
	{:else}
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

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
	}
</style>
