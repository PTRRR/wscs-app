<script lang="ts">
	import { useUser } from '../../store';

	const { query: user } = useUser();
</script>

<a href="/">Home</a>
<a href="/login">Login</a>

{#if $user.isSuccess && $user.data.user}
	<a href="/logout">Logout</a>
{/if}
<slot />
