<script lang="ts">
	import Button from './Button.svelte';

	let { value = $bindable(0), min = 0, max = 100 } = $props();
</script>

<div class="quantity">
	<label for="quantity">Quantity:</label>
	<div class="quantity__inner">
		<Button
			minimal
			onclick={() => {
				if (value > min) {
					value--;
				}
			}}>-</Button
		>
		<div class="quantity__input">
			<input type="number" name="quantity" bind:value />
		</div>
		<Button
			minimal
			onclick={() => {
				if (value < max) {
					value++;
				}
			}}>+</Button
		>
	</div>
</div>

<style lang="scss">
	.quantity {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		&__inner {
			display: flex;
			gap: 0.2rem;
		}

		&__input {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			border-bottom: solid 1px black;
		}

		:global(.button) {
			font-size: 1.2rem;
		}

		input {
			all: unset;
			width: 1.5rem;
		}

		/* For Chrome, Safari, Edge, Opera */
		input[type='number']::-webkit-inner-spin-button,
		input[type='number']::-webkit-outer-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		/* For Firefox */
		input[type='number'] {
			appearance: textfield;
			-moz-appearance: textfield;
		}
	}
</style>
