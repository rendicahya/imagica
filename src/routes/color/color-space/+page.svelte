<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import { extractChannels, type ColorSpace } from '$lib/image-processing/color/channels';

	let space = $state<ColorSpace>('rgb');

	let channels = $derived(
		imageStore.current ? extractChannels(imageStore.current.imageData, space) : []
	);

	const spaces: { value: ColorSpace; label: string }[] = [
		{ value: 'rgb', label: 'RGB' },
		{ value: 'hsv', label: 'HSV' },
		{ value: 'lab', label: 'Lab' },
		{ value: 'ycbcr', label: 'YCbCr' }
	];
</script>

<svelte:head>
	<title>Color Space Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Color Space Explorer</h1>
		<p>Gambar yang sama dapat direpresentasikan secara numerik dengan cara yang berbeda-beda.</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="tabs">
				{#each spaces as option (option.value)}
					<button
						type="button"
						class:active={space === option.value}
						onclick={() => (space = option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>

			<div class="original">
				<CanvasFrame imageData={image.imageData} caption="Original" />
			</div>

			<div class="channels">
				{#each channels as channel (channel.label)}
					<CanvasFrame imageData={channel.imageData} caption={channel.label} />
				{/each}
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
		gap: 1.5rem;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
	}

	.tabs button.active {
		background: var(--color-accent, #6366f1);
		color: white;
	}

	.original {
		max-width: 20rem;
	}

	.channels {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}
</style>
