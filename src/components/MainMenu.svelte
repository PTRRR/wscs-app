<script lang="ts">
	import { goto } from '$app/navigation';
	import { useLocalCart, useUser } from '../store';
	import LoadingBar from './LoadingBar.svelte';
	let searchValue = $state<string>('');
	let searchDebounceTimeout: NodeJS.Timeout | undefined = undefined;

	const props: { baseUrl: string } = $props();
	const { cart } = useLocalCart();
	const { query: user } = useUser(props.baseUrl);

	const cartTotalItems = $derived($cart.items.reduce((acc, it) => (acc += it.quantity), 0));
	const isUserLoggedIn = $derived(Boolean($user.data?.user));
</script>

<svelte:head>
	<script
		type="text/javascript"
		src="https://player.radioking.io/scripts/iframe.bundle.js"
		defer
		async
	></script>
</svelte:head>

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
			<!-- <iframe
				src="https://player.radioking.io/music-4-hikers/?c=%23FFFFFF&c2=%232F3542"
				style="border-radius: 5px; width: 100%; height: 50%; "
				frameborder="0"
			></iframe> -->
			<iframe
				src="https://player.radioking.io/music-4-hikers/?c=%23FFFFFF&c2=%232F3542&f=h&i=0&p=2&s=0&li=2&plc=NaN&h=10&l=10"
				style="border-radius: 0px;"
				frameBorder="0"
			></iframe>
		</div>
	</div>
</header>

{#if $cart.items.length > 0}
	<div class="main-menu__sub-section">
		{#if $user.isFetched}
			<a href="/cart">Cart ({cartTotalItems})</a>
			{#if isUserLoggedIn}
				<a href={`${props.baseUrl}/api/checkout-session`} data-sveltekit-reload>Checkout</a>
			{:else}
				<a href="/checkout/login">Checkout</a>
			{/if}
		{:else}
			<span>Loading...</span>
		{/if}
	</div>
{/if}

<style lang="scss">
	.main-menu {
		$iframe-height: 145px;
		$iframe-width: 1000px;
		$iframe-scale: 0.8;

		position: relative;
		z-index: 100;
		display: flex;
		background-color: white;
		flex-direction: column;

		&__main-section {
			display: flex;
			border-bottom: solid var(--light-gray) 1px;
			height: #{$iframe-height * $iframe-scale - 5px};
		}

		&__sub-section {
			position: sticky;
			top: 0;
			background-color: white;
			z-index: 1000;
			display: flex;
			justify-content: flex-end;
			border-bottom: solid var(--light-gray) 1px;
			padding: 0.5rem var(--main-padding);
			gap: 1rem;
		}

		&__section {
			display: flex;
			padding: var(--main-padding) 0;
			justify-content: center;
			align-items: center;
			height: 100%;
			min-width: #{310 * $iframe-scale}px;

			& + & {
				border-left: solid 1px var(--light-gray);
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
			padding: 0;
			overflow: hidden;
			position: relative;

			iframe {
				position: absolute;
				width: #{$iframe-width};
				height: #{$iframe-height};
				border: none;
				border-radius: 0;
				top: 50%;
				left: #{$iframe-width * (1 - $iframe-scale) * -0.5};
				transform: translate(0%, -50%) scale(#{$iframe-scale});
			}
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

		input {
			font-family: inherit;
			font-size: 1rem;
			padding: 1rem;
			border-radius: 5px;
			border: solid 1px var(--light-gray);
			text-transform: uppercase;

			&:focus {
				outline: none;
			}
		}

		@media screen and (max-width: 1000px) {
			&__main-section {
				height: 60px;
			}

			&__section {
				& + & {
					border-left: none;
				}
			}

			&__title {
				padding: 0 calc(var(--main-padding) * 0.5);
			}

			&__search,
			&__radio {
				display: none;
			}
		}
	}
</style>
