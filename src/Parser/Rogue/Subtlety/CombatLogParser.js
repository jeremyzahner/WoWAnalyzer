import CoreCombatLogParser from 'Parser/Core/CombatLogParser';

import DamageDone from 'Parser/Core/Modules/DamageDone';
import Abilities from './Modules/Features/Abilities';

import ShadowBladesUptime from "./Modules/Features/ShadowBladesUptime";
import SymbolsOfDeathUptime from "./Modules/Features/SymbolsOfDeathUptime";
import ComboPointDetails from './Modules/RogueCore/ComboPointDetails';
import ComboPointTracker from './Modules/RogueCore/ComboPointTracker';
import EnergyDetails from './Modules/RogueCore/EnergyDetails';
import EnergyTracker from './Modules/RogueCore/EnergyTracker';
import SymbolsDamageTracker from './Modules/RogueCore/SymbolsDamageTracker';
import DanceDamageTracker from './Modules/RogueCore/DanceDamageTracker';
import DarkShadowNightblade from './Modules/Talents/DarkShadow/DarkShadowNightblade';
import DarkShadowContribution from "./Modules/Talents/DarkShadow/DarkShadowContribution";
import DarkShadowEvis from "./Modules/Talents/DarkShadow/DarkShadowEvis";
import NightbladeDuringSymbols from './Modules/BaseRotation/NightbladeDuringSymbols';
import CastsInShadowDance from './Modules/BaseRotation/CastsInShadowDance';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    //Feature
    damageDone: [DamageDone, { showStatistic: true }],
    shadowBladesUptime : ShadowBladesUptime,
    abilities: Abilities,
    symbolsOfDeathUptime:  SymbolsOfDeathUptime,

    //Resource
    comboPointTracker: ComboPointTracker,
    comboPointDetails: ComboPointDetails,
    energyTracker: EnergyTracker,
    energyDetails: EnergyDetails,

    //Trackers
    symbolsDamageTracker: SymbolsDamageTracker,
    danceDamageTracker: DanceDamageTracker,

    //Casts
    nightbladeDuringSymbols: NightbladeDuringSymbols,
    castsInShadowDance: CastsInShadowDance,
    
    //Talents
    darkShadowContribution: DarkShadowContribution,
    darkShadowEvis: DarkShadowEvis,
    darkShadowNightblade: DarkShadowNightblade,
  };
}

export default CombatLogParser;
