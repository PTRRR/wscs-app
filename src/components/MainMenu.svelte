<script lang="ts">
	import { goto } from '$app/navigation';
	import { useLocalCart } from '../store';
	let searchValue = $state<string>('');
	let searchDebounceTimeout: NodeJS.Timeout | undefined = undefined;

	const { cart } = useLocalCart();

	const cartTotalItems = $derived($cart.items.reduce((acc, it) => (acc += it.quantity), 0));
</script>

<header class="main-menu">
	<div class="main-menu__main-section">
		<div class="main-menu__section main-menu__search">
			<input
				type="text"
				placeholder="search"
				bind:value={searchValue}
				oninput={() => {
					if (searchDebounceTimeout) {
						clearTimeout(searchDebounceTimeout);
					}
					searchDebounceTimeout = setTimeout(() => {
						goto(`/search?q=${searchValue}`, { keepFocus: true, replaceState: true });
					}, 200);
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter') {
						goto(`/search?q=${searchValue}`, { keepFocus: true, replaceState: true });
					}
				}}
			/>
		</div>
		<div class="main-menu__section main-menu__title">
			<a href="/">
				<img src="/wscs.svg" alt="" />
			</a>
		</div>
		<div class="main-menu__section main-menu__radio">
			<!-- svelte-ignore a11y_missing_attribute -->
			<iframe
				src="https://player.radioking.io/music-4-hikers/?c=%23FFFFFF&c2=%232F3542"
				style="border-radius: 5px; width: 100%; height: 100px; "
				frameborder="0"
			></iframe>
		</div>
	</div>
	{#if $cart.items.length > 0}
		<div class="main-menu__sub-section">
			<a href="/cart">Cart ({cartTotalItems})</a>
			<a href="/checkout">Checkout</a>
		</div>
	{/if}
</header>

<style lang="scss">
	.main-menu {
		position: sticky;
		top: -141px;
		z-index: 100;
		display: flex;
		background-color: white;
		flex-direction: column;

		&__main-section {
			display: flex;
			border-bottom: solid black 1px;
		}

		&__sub-section {
			display: flex;
			justify-content: flex-end;
			border-bottom: solid black 1px;
			padding: 0.5rem 2rem;
			gap: 1rem;
		}

		&__section {
			display: flex;
			padding: 20px 0;
			justify-content: center;
			align-items: center;

			& + & {
				border-left: solid 1px black;
			}
		}

		&__search,
		&__radio {
			flex: 0 0 auto;
			width: 20%;
			padding: 20px;
		}

		&__radio {
			display: flex;
			justify-content: flex-end;
		}

		&__title {
			flex: 1 1 auto;
			text-align: center;
			padding: 0 2rem;

			a {
				display: block;
				width: 100%;
				height: 100%;
			}

			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
