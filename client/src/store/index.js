export const store = {
  state: {
    user: null,
    dashboard: null,
    currentCategory: null
  },
  setUser (user) {
    this.state.user = user
  },
  removeUser () {
    this.state.user = null
  },
  setDashboard (value) {
    this.state.dashboard = value
  }
}
