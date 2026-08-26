<script lang="ts">
	import { imageStore } from '$lib/stores/image.svelte';

	let isDragging = $state(false);
	let error = $state<string | null>(null);
	let fileInput: HTMLInputElement;

	async function loadFile(file: File) {
		if (!file.type.startsWith('image/')) {
			error = 'File yang dipilih bukan gambar.';
			return;
		}

		error = null;

		const url = URL.createObjectURL(file);
		const element = new Image();

		try {
			await new Promise<void>((resolve, reject) => {
				element.onload = () => resolve();
				element.onerror = () => reject(new Error('Gagal memuat gambar.'));
				element.src = url;
			});

			const canvas = document.createElement('canvas');
			canvas.width = element.naturalWidth;
			canvas.height = element.naturalHeight;

			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Canvas 2D context tidak tersedia.');

			ctx.drawImage(element, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			imageStore.set({
				imageData,
				width: canvas.width,
				height: canvas.height,
				name: file.name
			});
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat gambar.';
		} finally {
			URL.revokeObjectURL(url);
		}
	}

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) loadFile(file);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) loadFile(file);
	}
</script>

<div
	class="uploader"
	class:dragging={isDragging}
	role="button"
	tabindex="0"
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => (isDragging = false)}
	ondrop={handleDrop}
	onclick={() => fileInput.click()}
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.click()}
>
	<p>Seret &amp; lepas gambar di sini, atau klik untuk memilih file</p>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		onchange={handleInputChange}
		class="visually-hidden"
	/>
</div>

{#if error}
	<p class="error" role="alert">{error}</p>
{/if}

<style>
	.uploader {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem;
		border: 2px dashed var(--color-border, #999);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.uploader:hover,
	.uploader:focus-visible,
	.uploader.dragging {
		border-color: var(--color-accent, #6366f1);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.error {
		color: var(--color-error, #dc2626);
		margin-top: 0.5rem;
	}
</style>
