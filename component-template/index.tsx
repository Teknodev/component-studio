import React from 'react'
import './styles.css'

interface Props {
  title?: string
  description?: string
}

const MyComponent: React.FC<Props> = ({
  title = 'Hello Component',
  description = 'This is a custom component built with Component Studio.'
}) => {
  return (
    <section className="my-component">
      <div className="my-component__content">
        <h2 className="my-component__title">{title}</h2>
        <p className="my-component__description">{description}</p>
        <button className="my-component__button">Get Started</button>
      </div>
    </section>
  )
}

export default MyComponent
