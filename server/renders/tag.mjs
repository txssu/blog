export default function render (tag, parentTagId) {
  const data = {
    id: tag.id,
    title: tag.title
  }
  if (tag.ChildrenTags) {
    data.ChildrenTags = tag.ChildrenTags.map(render)
  }
  if (tag.ParentTag) {
    data.ParentTag = render(tag.ParentTag)
  }

  if (parentTagId && tag.parentTagId) {
    data.parentTagId = tag.parentTagId
  }

  return data
}
