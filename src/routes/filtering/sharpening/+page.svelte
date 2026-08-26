<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import BeforeAfterViewer from '$lib/components/image/BeforeAfterViewer.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { sharpen } from '$lib/image-processing/filtering/sharpening';

	let amount = $state(1);

	let processed = $derived(
		imageStore.current ? sharpen(imageStore.current.imageData, amount) : null
	);
</script>

<svelte:head>
	<title>Sharpening — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Sharpening</h1>
		<p>
			Filter sharpening memperkuat perbedaan antara pixel dan tetangganya, menegaskan tepi dan
			detail.
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
				<ParameterSlider
					label="Amount"
					bind:value={amount}
					min={0}
					max={3}
					step={0.1}
					defaultValue={1}
				/>
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
