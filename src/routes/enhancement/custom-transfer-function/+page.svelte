<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import CurveEditor from '$lib/components/visualization/CurveEditor.svelte';
	import { curveToLut, type ControlPoint } from '$lib/image-processing/enhancement/custom-curve';
	import { applyLut } from '$lib/image-processing/enhancement/point-transform';

	let points = $state<ControlPoint[]>([
		{ x: 0, y: 0 },
		{ x: 255, y: 255 }
	]);

	let lut = $derived(curveToLut(points));
	let processed = $derived(imageStore.current ? applyLut(imageStore.current.imageData, lut) : null);

	function resetCurve() {
		points = [
			{ x: 0, y: 0 },
			{ x: 255, y: 255 }
		];
	}
</script>

<svelte:head>
	<title>Custom Transfer Function — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Custom Transfer Function</h1>
		<p>Gambar kurva pemetaan intensitas Anda sendiri, lalu lihat langsung efeknya pada gambar.</p>
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
				<CurveEditor bind:points />
				<button type="button" onclick={resetCurve}>Reset Kurva</button>
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
		grid-template-columns: 1fr 22rem;
		gap: 1.5rem;
		align-items: start;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
