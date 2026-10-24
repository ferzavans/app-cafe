import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MethodId } from '../data/methods';
import { CUSTOM_GRINDER_ID, customGrinder, getGrinder, type CustomClicks, type Grinder } from '../data/grinders';

/** The user's favorite version of a method's recipe. */
export type SavedRecipe = {
  coffeeG: number;
  ratio: number;
  /** Grinder clicks (or dial position) that worked. */
  clicks?: number;
  /** Total time of the timed steps, in seconds; the guide stretches its steps to match. */
  timeSec?: number;
  notes?: string;
};

type Settings = {
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  /** The grinder the user picked in the grind guide, if any. */
  grinder: Grinder | undefined;
  setGrinderId: (id: string | null) => void;
  customClicks: CustomClicks;
  setCustomClicks: (clicks: CustomClicks) => void;
  savedRecipes: Partial<Record<MethodId, SavedRecipe>>;
  saveRecipe: (id: MethodId, recipe: SavedRecipe | null) => void;
};

const SettingsContext = createContext<Settings | null>(null);

const GRINDER_KEY = 'grinderId';
const CUSTOM_KEY = 'customClicks';
const RECIPES_KEY = 'savedRecipes';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(true);
  const [grinderId, setGrinderIdState] = useState<string | null>(null);
  const [customClicks, setCustomClicksState] = useState<CustomClicks>({});
  const [savedRecipes, setSavedRecipes] = useState<Partial<Record<MethodId, SavedRecipe>>>({});

  // Grinder choice and saved recipes survive app restarts; storage errors just fall back to defaults.
  useEffect(() => {
    AsyncStorage.multiGet([GRINDER_KEY, CUSTOM_KEY, RECIPES_KEY])
      .then(([[, id], [, custom], [, recipes]]) => {
        if (id) setGrinderIdState(id);
        if (custom) setCustomClicksState(JSON.parse(custom));
        if (recipes) setSavedRecipes(JSON.parse(recipes));
      })
      .catch(() => {});
  }, []);

  const value = useMemo(() => {
    const setGrinderId = (id: string | null) => {
      setGrinderIdState(id);
      (id ? AsyncStorage.setItem(GRINDER_KEY, id) : AsyncStorage.removeItem(GRINDER_KEY)).catch(() => {});
    };
    const setCustomClicks = (clicks: CustomClicks) => {
      setCustomClicksState(clicks);
      AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(clicks)).catch(() => {});
    };
    const saveRecipe = (id: MethodId, recipe: SavedRecipe | null) => {
      const next = { ...savedRecipes };
      if (recipe) next[id] = recipe;
      else delete next[id];
      setSavedRecipes(next);
      AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next)).catch(() => {});
    };
    const grinder = grinderId === CUSTOM_GRINDER_ID ? customGrinder(customClicks) : getGrinder(grinderId);
    return {
      soundOn,
      setSoundOn,
      grinder,
      setGrinderId,
      customClicks,
      setCustomClicks,
      savedRecipes,
      saveRecipe,
    };
  }, [soundOn, grinderId, customClicks, savedRecipes]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
