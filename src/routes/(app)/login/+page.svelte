<script lang="ts">
	import { queryClient } from '../../+layout.svelte';
	import { useUser } from '../../../store';
	import { WSCS } from '../../../utilities/api';
	import type { PageData } from './$types';

	export let data: PageData;

	const { query: user, invalidate: invalidateUser } = useUser(data.api.baseUrl);

	const api = new WSCS(data.api.baseUrl);

	let email: string = '';
	let password: string = '';
</script>

{#if $user.isLoading || $user.isPending}
	<h1>Loading...</h1>
{:else if $user.isSuccess && $user.data.user}
	<h1>Already logged in: {$user.data.user.name || $user.data.user.email}</h1>
	<a href="/logout">Logout</a>
{:else if $user.isSuccess && !$user.data.user}
	<h1>Login</h1>

	<form
		on:submit={(event) => {
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

<a href="/signup">Sign up</a>
