export default async ctx => {
  if (localStorage.getItem('token')) {
    await ctx.store.dispatch('getMe', ctx).catch(() => localStorage.removeItem('token'))
  }
}
