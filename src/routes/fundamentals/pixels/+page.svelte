<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import ImageViewer from '$lib/components/image/ImageViewer.svelte';
	import PixelInspector from '$lib/components/image/PixelInspector.svelte';
	import PixelGrid from '$lib/components/visualization/PixelGrid.svelte';

	let selected = $state<{ x: number; y: number } | null>(null);
</script>

<svelte:head>
	<title>Pixel Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Pixel Explorer</h1>
		<p>
			Sebuah gambar digital sebenarnya adalah kumpulan angka. Unggah gambar, lalu klik pixel mana
			pun untuk melihat nilai numeriknya secara langsung.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="main">
				<ImageViewer imageData={image.imageData} bind:selected />
			</div>

			<aside class="side">
				<PixelInspector imageData={image.imageData} position={selected} />

				{#if selected}
					<div>
						<h2>Tetangga Pixel</h2>
						<PixelGrid imageData={image.imageData} center={selected} />
					</div>
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
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
