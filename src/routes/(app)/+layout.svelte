<script lang="ts">
	import { useUser } from '../../store';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const { query: user } = useUser(data.api.baseUrl);
</script>

<a href="/">Home</a>
<a href="/checkout">Checkout</a>
<a href="/login">Login</a>

{#if $user.isSuccess && $user.data.user}
	<a href="/logout">Logout</a>
{/if}
<slot />
