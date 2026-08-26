<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import KernelVisualizer from '$lib/components/visualization/KernelVisualizer.svelte';
	import { kernelPresets } from '$lib/image-processing/filtering/kernels';
	import { convolveAsync } from '$lib/workers/processing-client';
	import { asyncResult } from '$lib/workers/async-result.svelte';

	function presetFor(size: number): number[] {
		if (size === 3) return [...kernelPresets.identity.values];
		return Array.from({ length: size * size }, (_, i) =>
			i === Math.floor((size * size) / 2) ? 1 : 0
		);
	}

	let size = $state(3);
	let values = $state<number[]>(presetFor(3));

	function setSize(newSize: number) {
		size = newSize;
		values = presetFor(newSize);
	}

	function applyPreset(name: keyof typeof kernelPresets) {
		const preset = kernelPresets[name];
		size = preset.size;
		values = [...preset.values];
	}

	let divisorInput = $derived(values.reduce((a, b) => a + b, 0));

	const processedResult = asyncResult(() =>
		imageStore.current
			? convolveAsync(imageStore.current.imageData, {
					size,
					values,
					divisor: divisorInput === 0 ? 1 : divisorInput
				})
			: null
	);
	let processed = $derived(processedResult.value);
</script>

<svelte:head>
	<title>Custom Kernel Designer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Custom Kernel Designer</h1>
		<p>Rancang kernel konvolusi Anda sendiri dan lihat efeknya secara langsung pada gambar.</p>
	</header>

	<section class="designer">
		<div class="controls">
			<label>
				Ukuran kernel
				<select value={size} onchange={(e) => setSize(Number(e.currentTarget.value))}>
					<option value={3}>3 × 3</option>
					<option value={5}>5 × 5</option>
					<option value={7}>7 × 7</option>
				</select>
			</label>

			<div class="presets">
				{#each Object.keys(kernelPresets) as name (name)}
					<button type="button" onclick={() => applyPreset(name as keyof typeof kernelPresets)}
						>{name}</button
					>
				{/each}
			</div>

			<KernelVisualizer bind:values {size} editable />

			<p class="hint">
				Divisor otomatis = jumlah semua bobot ({divisorInput === 0 ? 1 : divisorInput}).
			</p>
		</div>

		{#if !imageStore.current}
			<ImageUploader />
		{:else if processed}
			{@const image = imageStore.current}
			<div class="preview">
				<BeforeAfterViewer original={image.imageData} {processed} />
				<button type="button" onclick={() => imageStore.clear()}>Ganti Gambar</button>
			</div>
		{:else}
			<p class="hint">Memproses…</p>
		{/if}
	</section>
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

	.designer {
		display: grid;
		grid-template-columns: 20rem 1fr;
		gap: 1.5rem;
		align-items: start;
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.controls label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.presets button {
		font-size: 0.75rem;
	}

	.hint {
		font-size: 0.8rem;
		color: var(--color-muted, #666);
		margin: 0;
	}

	.preview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.designer {
			grid-template-columns: 1fr;
		}
	}
</style>
