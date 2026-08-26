<script lang="ts">
	interface Props {
		values: number[];
		size: number;
		editable?: boolean;
	}

	let { values = $bindable(), size, editable = false }: Props = $props();
</script>

<div class="kernel" style:grid-template-columns="repeat({size}, 2.75rem)">
	{#each values as value, index (index)}
		{#if editable}
			<input type="number" bind:value={values[index]} step="0.1" />
		{:else}
			<div class="cell">{value}</div>
		{/if}
	{/each}
</div>

<style>
	.kernel {
		display: grid;
		gap: 2px;
	}

	.kernel input,
	.cell {
		width: 2.75rem;
		height: 2.75rem;
		text-align: center;
		border: 1px solid var(--color-border, #999);
		font-variant-numeric: tabular-nums;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.kernel input {
		padding: 0;
		font: inherit;
	}
</style>
