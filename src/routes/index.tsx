import { createBrowserRouter } from 'react-router-dom'
import { NotFound } from '../components/notFound'
import HomePage from '../pages/homePage'
import { routePaths } from '../config'
import Maps from '../pages/maps'
import { DriverRegistrationPage } from '../pages/driverRegistration'
import DriverProfile from '../pages/profile'
import DriverLogin from '../pages/driverLogin'

// import { routePaths } from '../config'
// import Maps from '../maps'
// import HomePage from '../pages/homePage'
// import UserRegistration from '../pages/userRegistration'
// import UserLogin from '../pages/UserLogin'
// import  { DriverRegistrationPage } from '../pages/driverRegistration'
// import { DriverLoginPage } from '../pages/driverLogin'
// import Location from '../locations'
// import UserProfile from '../pages/profile'
// import { DriverProfilePage } from '../pages/driverProfile'
export const router = createBrowserRouter([
    {
        path: routePaths.home,
        element: <HomePage/>,
        // children: [
        //     {
        //         path: getAppRoutePath(APPS.MAPS, 'maps'),
        //         element: <Maps />,
        //     },
          
        // ],
    },
    {
        path:routePaths.maps,
        element: <Maps />
    },
    {
        path:routePaths.driverRegistration,
        element: <DriverRegistrationPage/>
    },
    // {
    //     path:routePaths.userLogin,
    //     element: <UserLogin/>
    // },
    {
        path:routePaths.driverRegistration,
        element: <DriverRegistrationPage/>
    },
    {
        path:routePaths.driverProfile,
        element: <DriverProfile/>
    },
    {
        path:routePaths.driverLogin,
        element: <DriverLogin/>
    },

    // {
    //     path:routePaths.location,
    //     element: <Location/>
    // },
    // {
    //     path:routePaths.profile,
    //     element: <DriverProfile/>
    // },
    {
        path: '*',
        element: <NotFound />,
    },
])
if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose())
}