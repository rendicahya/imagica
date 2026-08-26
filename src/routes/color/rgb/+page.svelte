<script lang="ts">
	import ParameterSlider from '$lib/components/controls/ParameterSlider.svelte';
	import { toHex } from '$lib/image-processing/core/pixel';

	let r = $state(124);
	let g = $state(80);
	let b = $state(200);
</script>

<svelte:head>
	<title>RGB Color Mixer — Imagica</title>
</svelte:head>

<article>
	<header>
		<h1>RGB Color Mixer</h1>
		<p>Warna digital dibentuk dengan mencampur cahaya merah, hijau, dan biru: R + G + B = Warna.</p>
	</header>

	<section class="workspace">
		<div class="controls">
			<ParameterSlider label="Red" bind:value={r} min={0} max={255} defaultValue={124} />
			<ParameterSlider label="Green" bind:value={g} min={0} max={255} defaultValue={80} />
			<ParameterSlider label="Blue" bind:value={b} min={0} max={255} defaultValue={200} />
		</div>

		<div class="preview">
			<div class="swatch" style:background-color="rgb({r} {g} {b})"></div>
			<dl>
				<dt>RGB</dt>
				<dd>R={r} G={g} B={b}</dd>
				<dt>Hex</dt>
				<dd>{toHex(r, g, b)}</dd>
			</dl>
		</div>
	</section>

	<section class="channels">
		<h2>Kontribusi Channel</h2>
		<div class="bars">
			<div class="bar-row">
				<span>R</span>
				<div class="bar-track"><div class="bar red" style:width="{(r / 255) * 100}%"></div></div>
			</div>
			<div class="bar-row">
				<span>G</span>
				<div class="bar-track"><div class="bar green" style:width="{(g / 255) * 100}%"></div></div>
			</div>
			<div class="bar-row">
				<span>B</span>
				<div class="bar-track"><div class="bar blue" style:width="{(b / 255) * 100}%"></div></div>
			</div>
		</div>
	</section>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		max-width: 48rem;
		margin: 0 auto;
	}

	.workspace {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.controls {
		flex: 1;
		min-width: 16rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.swatch {
		width: 8rem;
		height: 8rem;
		border-radius: 0.75rem;
		border: 1px solid var(--color-border, #ccc);
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

	.bars {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.bar-track {
		flex: 1;
		height: 0.75rem;
		background: var(--color-border, #eee);
		border-radius: 999px;
		overflow: hidden;
	}

	.bar {
		height: 100%;
	}

	.bar.red {
		background: #ef4444;
	}
	.bar.green {
		background: #22c55e;
	}
	.bar.blue {
		background: #3b82f6;
	}
</style>
