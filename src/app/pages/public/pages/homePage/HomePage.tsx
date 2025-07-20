import { FC } from 'react'
import { Link } from 'react-router'
import PublicNavigationLocation from 'core/navigation/PublicNavigationLocation'
import mapPathService from 'app/shared/services/mapPathService'

const HomePage: FC = () => {
  return (
    <div>Home Page
      <Link to={mapPathService.mapToBrowserPath(PublicNavigationLocation.LOGIN)}>Login</Link>
    </div>
  )
}

export default HomePage