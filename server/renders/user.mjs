function render (user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    createdAt: user.createdAt,
    isAdmin: user.admin,
    isEditor: user.editor
  }
}

export default render
