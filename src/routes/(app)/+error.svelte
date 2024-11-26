<script lang="ts">
	import { page } from '$app/stores';

	console.log($page);
</script>

<div class="error">
	<h4>Error</h4>
	<p>{$page.error?.message || 'Unknown error'}</p>
	<a href="/">Home</a>
</div>

<style lang="scss">
	:global(body) {
		display: flex;
		flex-direction: column;
		min-height: 100vh !important;
	}

	.error {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1 1 auto;

		h4 {
			font-size: 2rem;
		}

		h4,
		p {
			margin: 0;
		}

		a {
			margin-top: 2rem;
		}
	}
</style>
