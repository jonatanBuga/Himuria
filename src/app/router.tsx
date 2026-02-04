import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './Layout';

// Pages
import Landing from '../pages/Landing';
import AuthHub from '../pages/AuthHub';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Predictions from '../pages/Predictions';
import SeriesPrediction from '../pages/SeriesPrediction';
import ChampionPrediction from '../pages/ChampionPrediction';
import MVPPrediction from '../pages/MVPPrediction';
import Leaderboard from '../pages/Leaderboard';
import GameDetail from '../pages/GameDetail';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: <AuthHub />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/predictions',
        element: <Predictions />,
      },
      {
        path: '/predictions/series/:seriesId',
        element: <SeriesPrediction />,
      },
      {
        path: '/predictions/champion',
        element: <ChampionPrediction />,
      },
      {
        path: '/predictions/mvp',
        element: <MVPPrediction />,
      },
      {
        path: '/leaderboard',
        element: <Leaderboard />,
      },
      {
        path: '/game/:gameId',
        element: <GameDetail />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
