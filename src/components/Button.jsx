import { Link } from 'react-router-dom'
import './Button.css'

export default function Button({
  variant = 'primary',
  type = 'button',
  icon: Icon,
  to,
  children,
  className = '',
  ...rest
}) {
  const classes = `btn btn-${variant} ${className}`.trim()
  const content = (
    <>
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}