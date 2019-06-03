export default function({ store, redirect }) {
  if (!process.server) {
    if (!store.state.auth) {
      redirect('/login')
    }
  }
}
