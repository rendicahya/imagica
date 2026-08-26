<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { sobel, gradientToImage } from '$lib/image-processing/edge/sobel';
	import { prewitt } from '$lib/image-processing/edge/prewitt';
	import { roberts } from '$lib/image-processing/edge/roberts';
	import { laplacian } from '$lib/image-processing/edge/laplacian';
	import { canny } from '$lib/image-processing/edge/canny';

	type Method = 'roberts' | 'prewitt' | 'sobel' | 'laplacian' | 'canny';

	let method = $state<Method>('sobel');
	let lowThreshold = $state(30);
	let highThreshold = $state(80);

	let gradientResult = $derived(
		imageStore.current && (method === 'sobel' || method === 'prewitt')
			? method === 'sobel'
				? sobel(imageStore.current.imageData)
				: prewitt(imageStore.current.imageData)
			: null
	);

	let result = $derived.by(() => {
		const image = imageStore.current;
		if (!image) return null;

		switch (method) {
			case 'roberts':
				return roberts(image.imageData);
			case 'laplacian':
				return laplacian(image.imageData);
			case 'canny':
				return canny(image.imageData, { lowThreshold, highThreshold });
			case 'sobel':
			case 'prewitt':
				return gradientResult?.magnitude ?? null;
		}
	});
</script>

<svelte:head>
	<title>Edge Detection Lab — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Edge Detection Lab</h1>
		<p>
			Tepi terjadi di mana intensitas pixel berubah drastis. Operator gradien mendeteksi perubahan
			ini.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if result}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original" />
				<CanvasFrame imageData={result} caption="Edges" />

				{#if gradientResult}
					<CanvasFrame
						imageData={gradientToImage(gradientResult.gx, image.width, image.height)}
						caption="Gx"
					/>
					<CanvasFrame
						imageData={gradientToImage(gradientResult.gy, image.width, image.height)}
						caption="Gy"
					/>
				{/if}
			</div>

			<aside class="side">
				<div class="tabs">
					<button
						type="button"
						class:active={method === 'roberts'}
						onclick={() => (method = 'roberts')}>Roberts</button
					>
					<button
						type="button"
						class:active={method === 'prewitt'}
						onclick={() => (method = 'prewitt')}>Prewitt</button
					>
					<button type="button" class:active={method === 'sobel'} onclick={() => (method = 'sobel')}
						>Sobel</button
					>
					<button
						type="button"
						class:active={method === 'laplacian'}
						onclick={() => (method = 'laplacian')}>Laplacian</button
					>
					<button type="button" class:active={method === 'canny'} onclick={() => (method = 'canny')}
						>Canny</button
					>
				</div>

				{#if method === 'canny'}
					<ParameterSlider
						label="Low threshold"
						bind:value={lowThreshold}
						min={0}
						max={255}
						defaultValue={30}
					/>
					<ParameterSlider
						label="High threshold"
						bind:value={highThreshold}
						min={0}
						max={255}
						defaultValue={80}
					/>
				{/if}

				{#if gradientResult}
					<p class="hint">Gradient magnitude = √(Gx² + Gy²)</p>
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
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
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
