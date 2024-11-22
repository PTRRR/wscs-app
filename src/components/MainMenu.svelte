<script lang="ts">
	import { goto } from '$app/navigation';
	let searchValue = $state<string>('');
	let searchDebounceTimeout: NodeJS.Timeout | undefined = undefined;
</script>

<header class="main-menu">
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
					goto(`/search?q=${searchValue}`, { keepFocus: true });
				}, 200);
			}}
			onkeydown={(event) => {
				if (event.key === 'Enter') {
					goto(`/search?q=${searchValue}`, { keepFocus: true });
				}
			}}
		/>
	</div>
	<div class="main-menu__section main-menu__title">
		<a href="/">Words, Sounds, Colors & Shapes</a>
	</div>
	<div class="main-menu__section main-menu__radio">
		<!-- svelte-ignore a11y_missing_attribute -->
		<iframe
			src="https://player.radioking.io/music-4-hikers/?c=%23FFFFFF&c2=%232F3542"
			style="border-radius: 5px; width: 100%; height: 100px; "
			frameborder="0"
		></iframe>
	</div>
</header>

<style lang="scss">
	.main-menu {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		border-bottom: solid black 1px;
		background-color: white;

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
		}
	}
</style>
