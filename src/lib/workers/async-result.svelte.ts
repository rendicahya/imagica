// Runs `compute` inside an effect so it re-triggers whenever the reactive state it reads changes,
// tracks in-flight requests so a stale response never overwrites a newer one, and exposes the
// latest resolved value plus a `pending` flag for a "processing…" indicator.
export function asyncResult<T>(compute: () => Promise<T> | null) {
	let value = $state<T | null>(null);
	let pending = $state(false);

	$effect(() => {
		const promise = compute();

		if (!promise) {
			value = null;
			pending = false;
			return;
		}

		pending = true;
		let cancelled = false;

		promise.then((result) => {
			if (cancelled) return;
			value = result;
			pending = false;
		});

		return () => {
			cancelled = true;
		};
	});

	return {
		get value() {
			return value;
		},
		get pending() {
			return pending;
		}
	};
}
