<script lang="ts">
</script>

<div class="main-menu">
	<div class="main-menu__section main-menu__search">
		<input type="text" value="search" />
	</div>
	<div class="main-menu__section main-menu__title">
		<a href="/">Words, Sounds, Colors & Shapes</a>
	</div>
	<div class="main-menu__section main-menu__radio">radio</div>
</div>

<style lang="scss">
	.main-menu {
		position: sticky;
		top: 0;
		display: flex;
		border-bottom: solid black 1px;
		background-color: white;

		&__section {
			padding: 20px 0;

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
