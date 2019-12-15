<script>
    export let user
</script>

<img src={user.profile.data.picture} width="30" alt="user avatar" />
<span>{user.profile.data.name}!</span>
