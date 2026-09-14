import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SolanaProvider } from './context/SolanaProvider';
import { GameProvider } from './context/GameContext';
import Layout from './layouts/Layout';
import LoadingScreen from './components/shared/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const ArenaPage = lazy(() => import('./pages/ArenaPage'));
const WarriorPage = lazy(() => import('./pages/WarriorPage'));
const BattlePage = lazy(() => import('./pages/BattlePage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const ShareBattlePage = lazy(() => import('./pages/ShareBattlePage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <SolanaProvider>
      <GameProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen message="LOADING ARENA..." />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/arena" element={<ArenaPage />} />
                <Route path="/warrior/:wallet" element={<WarriorPage />} />
                <Route path="/battles/:battleId" element={<BattlePage />} />
                <Route path="/share/battle/:battleId" element={<ShareBattlePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GameProvider>
    </SolanaProvider>
  );
}

export default App;
