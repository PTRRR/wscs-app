<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';

	let { values = $bindable([0]), min = 0, max = 100, step = 1 } = $props();
</script>

<RangeSlider bind:values {min} {max} {step} pips springValues={{ stiffness: 1, damping: 1 }} />
