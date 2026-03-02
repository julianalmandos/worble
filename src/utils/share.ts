const isMobile = () => {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return regex.test(navigator.userAgent)
}

export const share = (message: string) => {
  const shareData = {
    title: 'Worble',
    text: message,
  }

  if (isMobile() && navigator.share) {
    navigator.share(shareData)
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message)
  }
}
