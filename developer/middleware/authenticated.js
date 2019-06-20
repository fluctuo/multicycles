export default function({ store, redirect }) {
  if (!store.state.auth) {
    redirect('/login')
  }
}
