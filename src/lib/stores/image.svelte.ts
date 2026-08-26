import type { LoadedImage } from '$lib/types/image';

let current = $state<LoadedImage | null>(null);

export const imageStore = {
	get current() {
		return current;
	},
	set(image: LoadedImage) {
		current = image;
	},
	clear() {
		current = null;
	}
};
