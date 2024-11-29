<script lang="ts">
	let {
		value = undefined,
		checked = $bindable(false),
		label,
		onchange = undefined
	}: {
		value?: string | number;
		checked?: boolean;
		label?: string | number;
		onchange?: (props: { value?: string | number; checked: boolean }) => void;
	} = $props();

	export const getValue = () => value;
	export const isChecked = () => checked;
	export const setChecked = (value: boolean) => {
		checked = value;
	};
</script>

<label class="checkbox">
	<input
		type="checkbox"
		bind:checked
		onchange={() =>
			onchange?.({
				checked,
				value
			})}
	/>
	<span class="checkbox__custom"></span>
	{#if typeof label !== 'undefined'}
		<span class="checkbox__label">{label}</span>
	{/if}
</label>

<style lang="scss">
	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		cursor: pointer;
		user-select: none;

		input[type='checkbox'] {
			position: absolute;
			opacity: 0;
			width: 0;
			height: 0;
		}

		&__custom {
			display: inline-block;
			width: 1rem;
			height: 1rem;
			border: 1px solid var(--light-gray);
			position: relative;
			transition: all 0.2s ease;
		}

		input:checked + &__custom::after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: black;
		}

		&__label {
			transform: translate(0, 15%);
		}
	}
</style>
