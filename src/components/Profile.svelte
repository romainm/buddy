<script>
    import { auth, user, login } from "../stitch"
</script>

{#if $user}
    <div class="ui left labeled button" tabindex="0">
        <div class="ui image label">
            <img src={$user.profile.data.picture} alt="user avatar" />
            {$user.profile.data.name}
        </div>
        <button
            class="ui primary button"
            on:click={() => {
                auth.logout()
                user.set(null)
            }}>
            Logout
        </button>
    </div>
{:else}
    <button class="ui primary button" on:click={login}>Sign in</button>
{/if}
