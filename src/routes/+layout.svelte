<script lang="ts">
	import { onMount } from 'svelte';
	import { useCart, useUser } from '../store';
	import type { LayoutData } from './$types';
	import { WSCS } from '../utilities/api';

	export let data: LayoutData;

	useCart();
	const { user } = useUser();

	onMount(() => {
		const api = new WSCS(data.api.baseUrl, data.api.token);
		api.me().then((res) => user.set(res.user));
	});
</script>

<a href="/">Home</a>
<a href="/login">Login</a>
<slot />
