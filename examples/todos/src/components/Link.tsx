import React, {ReactNode} from 'react'

export type Props = {
  active: boolean
  children?: ReactNode
  onClick: () => void
}

const Link = ({active, children, onClick}: Props) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a // eslint-disable-line jsx-a11y/anchor-is-valid
      href='#'
      onClick={event => {
        event.preventDefault()
        onClick()
      }}
    >
      {children}
    </a>
  )
}

export default Link
