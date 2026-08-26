<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import ImageViewer from '$lib/components/image/ImageViewer.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import KernelVisualizer from '$lib/components/visualization/KernelVisualizer.svelte';
	import { kernelPresets, type Kernel } from '$lib/image-processing/filtering/kernels';
	import {
		convolve,
		convolveAtPixel,
		type EdgeMode
	} from '$lib/image-processing/filtering/convolution';

	let presetName = $state<keyof typeof kernelPresets>('gaussianBlur');
	let edgeMode = $state<EdgeMode>('clamp');
	let selected = $state<{ x: number; y: number } | null>(null);

	let kernel = $derived<Kernel>(kernelPresets[presetName]);

	let processed = $derived(
		imageStore.current ? convolve(imageStore.current.imageData, kernel, edgeMode) : null
	);

	let trace = $derived(
		imageStore.current && selected
			? convolveAtPixel(imageStore.current.imageData, kernel, selected.x, selected.y, edgeMode)
			: null
	);
</script>

<svelte:head>
	<title>Convolution Playground — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Convolution Playground</h1>
		<p>
			Konvolusi menggeser sebuah kernel ke seluruh gambar: mengalikan nilai tetangga pixel dengan
			bobot kernel, lalu menjumlahkannya.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else if processed}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="main">
				<ImageViewer imageData={image.imageData} bind:selected />
				<CanvasFrame
					imageData={processed}
					caption="Hasil (klik gambar di atas untuk melihat perhitungan)"
				/>
			</div>

			<aside class="side">
				<label>
					Kernel
					<select bind:value={presetName}>
						{#each Object.keys(kernelPresets) as name (name)}
							<option value={name}>{name}</option>
						{/each}
					</select>
				</label>

				<label>
					Edge mode
					<select bind:value={edgeMode}>
						<option value="clamp">Clamp (ulangi tepi)</option>
						<option value="zero">Zero padding</option>
					</select>
				</label>

				<div>
					<h2>Kernel {kernel.size}×{kernel.size}</h2>
					<KernelVisualizer values={kernel.values} size={kernel.size} />
				</div>

				{#if trace && selected}
					<div class="trace">
						<h2>Perhitungan di ({selected.x}, {selected.y})</h2>
						<p class="hint">Menggunakan nilai channel Red sebagai contoh.</p>
						<KernelVisualizer values={trace.products} size={kernel.size} />
						<p class="sum">
							Sum = {trace.products.map((p) => p.toFixed(0)).join(' + ')} = {trace.sum.toFixed(0)}
						</p>
						<p class="sum">Output = Sum / divisor = {trace.result}</p>
					</div>
				{:else}
					<p class="hint">Klik pada gambar untuk melihat rincian perhitungan konvolusi.</p>
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
		grid-template-columns: 1fr 20rem;
		gap: 1.5rem;
		align-items: start;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.side label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.trace {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.sum {
		font-family: monospace;
		font-size: 0.8rem;
		margin: 0;
		word-break: break-word;
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
