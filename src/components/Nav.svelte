<script>
    import { link, location } from "svelte-spa-router"
    import { auth, user, login } from "../stitch"
    import Profile from "./Profile.svelte"
</script>

<style>

</style>

<div class="ui huge menu">
    <div class="header item">Buddy</div>
    <a class="item" class:active={$location === '/'} href="/" use:link>
        transactions
    </a>
    <a
        class="item"
        class:active={$location === '/budgets'}
        href="/budgets"
        use:link>
        budgets
    </a>
    <a
        class="item"
        class:active={$location === '/reports'}
        href="/reports"
        use:link>
        reports
    </a>
    <a
        class="item"
        class:active={$location === '/import'}
        href="/import"
        use:link>
        import
    </a>
    <div class="right menu">
        <Profile />
    </div>
</div>
