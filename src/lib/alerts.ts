import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { useSettings } from './settings';

const STEP_SOUND = require('../../assets/sounds/etapa.wav');
const FINISH_SOUND = require('../../assets/sounds/fim.wav');

/** Sound cues for the timer and the brewing guide, honoring the user's toggle. */
export function useAlerts() {
  const { soundOn } = useSettings();
  const stepPlayer = useAudioPlayer(STEP_SOUND);
  const finishPlayer = useAudioPlayer(FINISH_SOUND);

  const fire = useCallback(
    (kind: 'step' | 'finish') => {
      if (!soundOn) return;
      const player = kind === 'step' ? stepPlayer : finishPlayer;
      player.seekTo(0).finally(() => player.play());
    },
    [soundOn, stepPlayer, finishPlayer],
  );

  return {
    alertStep: useCallback(() => fire('step'), [fire]),
    alertFinish: useCallback(() => fire('finish'), [fire]),
  };
}
