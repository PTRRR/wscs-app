<script lang="ts">
	import { goto } from '$app/navigation';
	import { useLocalCart } from '../store';
	import LoadingBar from './LoadingBar.svelte';
	let searchValue = $state<string>('');
	let searchDebounceTimeout: NodeJS.Timeout | undefined = undefined;

	const { cart } = useLocalCart();

	const cartTotalItems = $derived($cart.items.reduce((acc, it) => (acc += it.quantity), 0));
</script>

<LoadingBar />

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
</header>

{#if $cart.items.length > 0}
	<div class="main-menu__sub-section">
		<a href="/cart">Cart ({cartTotalItems})</a>
		<a href="/checkout">Checkout</a>
	</div>
{/if}

<style lang="scss">
	.main-menu {
		position: relative;
		z-index: 100;
		display: flex;
		background-color: white;
		flex-direction: column;

		&__main-section {
			display: flex;
			border-bottom: solid black 1px;
		}

		&__sub-section {
			position: sticky;
			top: 0;
			background-color: white;
			z-index: 1000;
			display: flex;
			justify-content: flex-end;
			border-bottom: solid black 1px;
			padding: 0.5rem var(--main-padding);
			gap: 1rem;
		}

		&__section {
			display: flex;
			padding: var(--main-padding) 0;
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
			padding: var(--main-padding);
		}

		&__radio {
			display: flex;
			justify-content: flex-end;
		}

		&__title {
			flex: 1 1 auto;
			text-align: center;
			padding: 0 2rem;
			user-select: none;

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

		@media screen and (max-width: 1000px) {
			&__section {
				& + & {
					border-left: none;
				}
			}

			&__title {
				padding: 0 var(--main-padding);
			}

			&__search,
			&__radio {
				display: none;
			}
		}
	}
</style>
