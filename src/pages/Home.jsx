import { useEffect, useRef, useState } from 'react';

import HeroSection from '../components/HeroSection.jsx';
import LetterSection from '../components/LetterSection.jsx';
import GratitudeSection from '../components/GratitudeSection.jsx';
import PromiseSection from '../components/PromiseSection.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import MessageLinks from '../components/MessageLinks.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import LoveJourneyModal from '../components/LoveJourneyModal.jsx';

function Home() {
  const audioPlayerRef = useRef(null);
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const stageAudioTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const status = window.sessionStorage.getItem('loveJourneyStatus');
    if (status !== 'completed') {
      setIsJourneyOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isJourneyOpen) {
      stageAudioTriggeredRef.current = false;
    }
  }, [isJourneyOpen]);

  const handleJourneyComplete = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loveJourneyStatus', 'completed');
    }
    setIsJourneyOpen(false);
    stageAudioTriggeredRef.current = true;

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          audioPlayerRef.current?.play?.();
        }, 260);
      });
    } else {
      audioPlayerRef.current?.play?.();
    }
  };

  const handleJourneyDismiss = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('loveJourneyStatus', 'dismissed');
    }
    setIsJourneyOpen(false);
  };

  const handleStageChange = (stageIndex) => {
    if (stageIndex >= 8 && !stageAudioTriggeredRef.current) {
      stageAudioTriggeredRef.current = true;
      audioPlayerRef.current?.play?.();
    }
  };

  return (
    <div className="home-page">
      <LoveJourneyModal
        isOpen={isJourneyOpen}
        onDismiss={handleJourneyDismiss}
        onComplete={handleJourneyComplete}
        onStageChange={handleStageChange}
      />
      <HeroSection />
      <AudioPlayer
        ref={audioPlayerRef}
        trackTitle="Love for You"
        note="Our soundtrack starts playing from chapter seven and keeps singing once you finish the 10 stages."
      />
      <StatusPanel />
      <LetterSection />
      <GratitudeSection />
      <PromiseSection />
      <MessageLinks />
    </div>
  );
}

export default Home;

