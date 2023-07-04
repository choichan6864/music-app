export default function SignIn() {
    return <form method="post" action="/api/user/sign-in">
        <input name="id" type="text" placeholder="id"/>
        <input name="passwd" type="password" placeholder="password" />
        <input type="submit" />
    </form>
}