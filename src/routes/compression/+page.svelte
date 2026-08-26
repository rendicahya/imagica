<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';
	import ImageUploader from '$lib/components/image/ImageUploader.svelte';
	import CanvasFrame from '$lib/components/image/CanvasFrame.svelte';
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { psnr } from '$lib/image-processing/metrics/psnr';

	let quality = $state(80);

	let originalSize = $state<number | null>(null);
	let compressedSize = $state<number | null>(null);
	let compressedImage = $state<ImageData | null>(null);
	let psnrValue = $state<number | null>(null);

	function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
		const canvas = document.createElement('canvas');
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		canvas.getContext('2d')?.putImageData(imageData, 0, 0);
		return canvas;
	}

	function canvasToBlob(canvas: HTMLCanvasElement, type: string, q?: number): Promise<Blob | null> {
		return new Promise((resolve) => canvas.toBlob(resolve, type, q));
	}

	$effect(() => {
		const image = imageStore.current;
		const q = quality;
		if (!image) return;

		let cancelled = false;

		(async () => {
			const canvas = imageDataToCanvas(image.imageData);

			const pngBlob = await canvasToBlob(canvas, 'image/png');
			const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', q / 100);
			if (cancelled || !jpegBlob) return;

			const bitmap = await createImageBitmap(jpegBlob);
			const decodeCanvas = document.createElement('canvas');
			decodeCanvas.width = bitmap.width;
			decodeCanvas.height = bitmap.height;
			const ctx = decodeCanvas.getContext('2d');
			ctx?.drawImage(bitmap, 0, 0);
			const decoded = ctx?.getImageData(0, 0, bitmap.width, bitmap.height);

			if (cancelled || !decoded) return;

			originalSize = pngBlob?.size ?? null;
			compressedSize = jpegBlob.size;
			compressedImage = decoded;
			psnrValue = psnr(image.imageData, decoded);
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Image Compression Explorer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>Image Compression Explorer</h1>
		<p>
			Kompresi JPEG membuang informasi untuk memperkecil ukuran file. Semakin rendah kualitas,
			semakin terlihat artefaknya.
		</p>
	</header>

	{#if !imageStore.current}
		<ImageUploader />
	{:else}
		{@const image = imageStore.current}
		<section class="workspace">
			<div class="images">
				<CanvasFrame imageData={image.imageData} caption="Original (PNG)" />
				{#if compressedImage}
					<CanvasFrame imageData={compressedImage} caption="Compressed (JPEG)" />
				{/if}
			</div>

			<aside class="side">
				<ParameterSlider
					label="JPEG Quality"
					bind:value={quality}
					min={1}
					max={100}
					defaultValue={80}
					unit="%"
				/>

				{#if originalSize !== null && compressedSize !== null && psnrValue !== null}
					<dl>
						<dt>Ukuran asli (PNG)</dt>
						<dd>{(originalSize / 1024).toFixed(1)} KB</dd>
						<dt>Ukuran terkompresi</dt>
						<dd>{(compressedSize / 1024).toFixed(1)} KB</dd>
						<dt>Rasio kompresi</dt>
						<dd>{(originalSize / compressedSize).toFixed(2)}×</dd>
						<dt>PSNR</dt>
						<dd>{Number.isFinite(psnrValue) ? `${psnrValue.toFixed(2)} dB` : '∞'}</dd>
					</dl>
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

	.images {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1rem;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	dl {
		display: grid;
		grid-template-columns: auto auto;
		column-gap: 0.75rem;
		font-variant-numeric: tabular-nums;
		margin: 0;
	}

	dt {
		color: var(--color-muted, #666);
	}

	dd {
		margin: 0;
	}

	@media (max-width: 768px) {
		.workspace {
			grid-template-columns: 1fr;
		}
	}
</style>
