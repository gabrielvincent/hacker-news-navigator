let currentIndex = 0

const parentComments = Array.from(
  document.querySelectorAll('.comment-tree tr.athing.comtr td.ind[indent="0"]')
).map(td => td.closest('tr.athing.comtr'))

document.addEventListener('keydown', e => {
  if (
    document.activeElement.nodeName === 'INPUT' ||
    document.activeElement.nodeName === 'TEXTAREA'
  ) {
    return
  }

  if (e.key === 'ArrowLeft') {
    currentIndex = Math.max(0, currentIndex - 1)
  } else if (e.key === 'ArrowRight') {
    currentIndex = Math.min(parentComments.length - 1, currentIndex + 1)
  } else {
    return
  }

  parentComments[currentIndex].scrollIntoView({ behavior: 'smooth' })
})
