<script lang="ts">
	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		step?: number;
		defaultValue?: number;
		unit?: string;
	}

	let { label, value = $bindable(), min, max, step = 1, defaultValue, unit = '' }: Props = $props();

	let id = $derived(`slider-${label.replace(/\s+/g, '-').toLowerCase()}`);
</script>

<div class="parameter">
	<div class="row">
		<label for={id}>{label}</label>
		<span class="value">{value}{unit}</span>
	</div>

	<div class="row">
		<input {id} type="range" {min} {max} {step} bind:value />
		{#if defaultValue !== undefined}
			<button type="button" onclick={() => (value = defaultValue as number)}>Reset</button>
		{/if}
	</div>
</div>

<style>
	.parameter {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	label {
		flex: 1;
	}

	.value {
		font-variant-numeric: tabular-nums;
		color: var(--color-muted, #666);
	}

	input[type='range'] {
		flex: 1;
	}

	button {
		font-size: 0.75rem;
		padding: 0.15rem 0.5rem;
	}
</style>
