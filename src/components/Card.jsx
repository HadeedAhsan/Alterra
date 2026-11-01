import './Card.css'

export default function Card({
  as: Tag = 'div',
  accent,
  children,
  className = '',
  ...rest
}) {
  const accentClass = accent ? `card-${accent}` : ''
  return (
    <Tag className={`card ${accentClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}