<script lang="ts">
	import { getPixel, isInBounds, toHex } from '$lib/image-processing/core/pixel';

	interface Props {
		imageData: ImageData;
		center: { x: number; y: number };
		mode?: '4' | '8';
	}

	let { imageData, center, mode = $bindable('8') }: Props = $props();

	const includedIn4 = new Set(['0,-1', '-1,0', '0,0', '1,0', '0,1']);

	let cells = $derived(
		Array.from({ length: 3 }, (_, row) =>
			Array.from({ length: 3 }, (_, col) => {
				const dx = col - 1;
				const dy = row - 1;
				const x = center.x + dx;
				const y = center.y + dy;
				const isCenter = dx === 0 && dy === 0;
				const active = isCenter || mode === '8' || includedIn4.has(`${dx},${dy}`);

				return {
					x,
					y,
					isCenter,
					active,
					pixel: isInBounds(imageData, x, y) ? getPixel(imageData, x, y) : null
				};
			})
		)
	);
</script>

<div class="grid-wrap">
	<div class="mode-toggle">
		<label><input type="radio" bind:group={mode} value="4" /> 4-neighborhood</label>
		<label><input type="radio" bind:group={mode} value="8" /> 8-neighborhood</label>
	</div>

	<div class="grid">
		{#each cells as row, rowIndex (rowIndex)}
			{#each row as cell (cell.x + ',' + cell.y)}
				<div
					class="cell"
					class:center={cell.isCenter}
					class:inactive={!cell.active}
					style:background-color={cell.pixel
						? `rgb(${cell.pixel.r} ${cell.pixel.g} ${cell.pixel.b})`
						: 'transparent'}
					title={cell.pixel ? toHex(cell.pixel.r, cell.pixel.g, cell.pixel.b) : 'di luar batas'}
				>
					{#if cell.pixel}
						<span class="label">({cell.x},{cell.y})</span>
					{/if}
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.grid-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mode-toggle {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 3rem);
		grid-template-rows: repeat(3, 3rem);
		gap: 2px;
	}

	.cell {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		border: 1px solid var(--color-border, #999);
		font-size: 0.6rem;
		color: white;
		text-shadow: 0 0 2px black;
	}

	.cell.center {
		border: 2px solid var(--color-accent, #6366f1);
	}

	.cell.inactive {
		opacity: 0.25;
	}
</style>
