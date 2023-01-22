let currentIndex = null

const parentComments = Array.from(
  document.querySelectorAll('.comment-tree tr.athing.comtr td.ind[indent="0"]')
).map(td => td.closest('tr.athing.comtr'))

function updateCurrentIndex() {
  const currentScroll = window.scrollY
  const currentComment = parentComments.find(
    comment => comment.offsetTop >= currentScroll
  )
  currentIndex = parentComments.indexOf(currentComment)
}

function onScrollEnd(callback, refresh = 66) {
  if (!callback || typeof callback !== 'function') return

  let timeout

  window.addEventListener(
    'wheel',
    function () {
      window.clearTimeout(timeout)
      timeout = setTimeout(callback, refresh)
    },
    false
  )
}

document.addEventListener('keydown', e => {
  let timeout
  if (
    document.activeElement.nodeName === 'INPUT' ||
    document.activeElement.nodeName === 'TEXTAREA'
  ) {
    return
  }

  if (e.key === 'ArrowUp' || e.key == 'ArrowDown') {
    window.clearTimeout(timeout)
    timeout = setTimeout(updateCurrentIndex, 66)
  }

  if (e.key === 'ArrowLeft') {
    if (currentIndex == null) return
    currentIndex = Math.max(0, currentIndex - 1)
  } else if (e.key === 'ArrowRight') {
    if (currentIndex == null) currentIndex = 0
    else currentIndex = Math.min(parentComments.length - 1, currentIndex + 1)
  } else {
    return
  }

  parentComments[currentIndex].scrollIntoView({ behavior: 'smooth' })
})

onScrollEnd(updateCurrentIndex)
