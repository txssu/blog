export default function render (tag) {
  const data = simpleRender(tag)
  if (tag.parentTagId) {
    data.parentTagId = tag.parentTagId
  }
  if (tag.ChildrenTags) {
    data.ChildrenTags = tag.ChildrenTags.map(simpleRender)
  }
  return data
}

function simpleRender (tag) {
  return {
    id: tag.id,
    title: tag.title
  }
}
