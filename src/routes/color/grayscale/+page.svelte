<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { toGrayscaleImage, type GrayscaleMethod } from '$lib/image-processing/color/grayscale';

	let method = $state<GrayscaleMethod>('luminosity');
	let a = $state(0.33);
	let b = $state(0.33);
	let c = $state(0.34);

	let result = $derived(
		imageStore.current ? toGrayscaleImage(imageStore.current.imageData, method, { a, b, c }) : null
	);

	const methods: { value: GrayscaleMethod; label: string; formula: string }[] = [
		{ value: 'average', label: 'Average', formula: '(R + G + B) / 3' },
		{ value: 'lightness', label: 'Lightness', formula: '(max(R,G,B) + min(R,G,B)) / 2' },
		{ value: 'luminosity', label: 'Luminosity', formula: '0.21R + 0.72G + 0.07B' },
		{ value: 'custom', label: 'Custom', formula: 'aR + bG + cB' }
	];
</script>

<svelte:head>
	<title>Grayscale Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Grayscale Explorer</h1>
		<p>
			Ada lebih dari satu cara mengubah warna menjadi skala abu-abu — masing-masing memberi bobot
			berbeda ke tiap channel.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="tabs">
				{#each methods as option (option.value)}
					<button
						type="button"
						class:active={method === option.value}
						onclick={() => (method = option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>

			<p class="formula">Gray = {methods.find((m) => m.value === method)?.formula}</p>

			{#if method === 'custom'}
				<div class="controls">
					<ParameterSlider
						label="a"
						bind:value={a}
						min={-1}
						max={1}
						step={0.01}
						defaultValue={0.33}
					/>
					<ParameterSlider
						label="b"
						bind:value={b}
						min={-1}
						max={1}
						step={0.01}
						defaultValue={0.33}
					/>
					<ParameterSlider
						label="c"
						bind:value={c}
						min={-1}
						max={1}
						step={0.01}
						defaultValue={0.34}
					/>
				</div>
			{/if}

			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original" />
				{#if result}
					<CanvasFrame imageData={result} caption="Grayscale" />
				{/if}
			</div>

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
		max-width: 60rem;
		margin: 0 auto;
	}

	.workspace {
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

	.formula {
		font-family: monospace;
		color: var(--color-muted, #666);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 24rem;
	}

	.images {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1rem;
	}
</style>
