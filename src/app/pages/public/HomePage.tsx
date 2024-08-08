import { FC } from 'react'
import routesPaths from 'core/routes/routesPaths'
import { Link } from 'react-router-dom'

const HomePage: FC = () => {
  return (
    <div>Home Page
      <Link to={`/${routesPaths.LOGIN}`}>Login</Link>
    </div>
  )
}

export default HomePage