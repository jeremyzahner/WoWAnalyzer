import TALENTS from 'common/TALENTS/priest';

export const DISPERSION_BASE_CD = 90;
export const DISPERSION_UPTIME_MS = 6000;

export const SHADOW_WORD_DEATH_EXECUTE_RANGE = 0.2;

export const MINDBENDER_UPTIME_MS = 15000;

export const MS_BUFFER = 100;

export const SPIRIT_DAMAGE_MULTIPLIER = 1.15;
export const SPIRIT_INSANITY_GENERATION = 1;

export const TWIST_OF_FATE_INCREASE = 1.1;

export const VOID_TORRENT_MAX_TIME = 3000;
export const VOID_TORRENT_INSANITY_PER_SECOND = 20;
export const VOID_TORRENT_INSANITY_PER_TICK = 15;

export const VOID_FORM_ACTIVATORS = [TALENTS.VOID_ERUPTION_TALENT.id];

// Abilities that don't show waste in resource gain
export const SHADOW_SPELLS_WITHOUT_WASTE = [TALENTS.VOID_TORRENT_TALENT.id];
