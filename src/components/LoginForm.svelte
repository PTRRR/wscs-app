<script lang="ts">
	import { queryClient } from '../routes/+layout.svelte';
	import { useUser } from '../store';
	import { WSCS } from '../utilities/api';

	const props: { baseUrl: string; onlogin?: () => void } = $props();
	const { baseUrl, onlogin } = props;

	const { query: user, invalidate: invalidateUser } = useUser(baseUrl);

	const api = new WSCS(baseUrl);

	let email: string = $state('');
	let password: string = $state('');

	$effect(() => {
		if ($user.isSuccess && $user.data.user) {
			onlogin?.();
		}
	});
</script>

<div class="login-form">
	{#if $user.isLoading || $user.isPending}
		<h1>Loading...</h1>
	{:else if $user.isSuccess && $user.data.user}
		<h1>Already logged in: {$user.data.user.name || $user.data.user.email}</h1>
		<a href="/logout">Logout</a>
	{:else if $user.isSuccess && !$user.data.user}
		<form
			onsubmit={(event) => {
				event.preventDefault();
				api
					.login({
						email,
						password
					})
					.finally(() => invalidateUser(queryClient));
			}}
		>
			<input type="email" placeholder="email" bind:value={email} />
			<input type="password" placeholder="password" bind:value={password} />
			<button type="submit">Submit</button>
		</form>
	{/if}

	<a href="/checkout/signup">Sign up</a>
</div>
