import React from 'react';
import SPELLS from 'common/SPELLS';
import Analyzer, { Options } from 'parser/core/Analyzer';
import Events, { RemoveBuffEvent, FightEndEvent } from 'parser/core/Events';
import Statistic from 'parser/ui/Statistic';
import { SpellLink } from 'interface';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import { formatNumber, formatPercentage, formatDuration } from 'common/format';
import EventHistory from 'parser/shared/modules/EventHistory';
import FilteredActiveTime from 'parser/shared/modules/FilteredActiveTime';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import { When, ThresholdStyle } from 'parser/core/ParseResults';
import { SELECTED_PLAYER } from 'parser/core/EventFilter';
import { Trans } from '@lingui/macro';

import CombustionPreCastDelay from './CombustionPreCastDelay';


class CombustionActiveTime extends Analyzer {
  static dependencies = {
    eventHistory: EventHistory,
    filteredActiveTime: FilteredActiveTime,
    abilityTracker: AbilityTracker,
    combustionPreCastDelay: CombustionPreCastDelay,
  };
  protected eventHistory!: EventHistory;
  protected filteredActiveTime!: FilteredActiveTime;
  protected abilityTracker!: AbilityTracker;
  protected combustionPreCastDelay!: CombustionPreCastDelay;

  activeTime = 0;
  combustionCasts: number[] = [];

  constructor(options: Options) {
    super(options);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.COMBUSTION), this.onCombustionRemoved);
    this.addEventListener(Events.fightend, this.onFinished);
  }

  onCombustionRemoved(event: RemoveBuffEvent) {
    const buffApplied = this.eventHistory.last(1, undefined, Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.COMBUSTION))[0].timestamp;
    const uptime = this.filteredActiveTime.getActiveTime(buffApplied, event.timestamp)
    this.combustionCasts[buffApplied] = uptime / (event.timestamp - buffApplied);
    this.activeTime += uptime;
  }

  onFinished(event: FightEndEvent) {
    if (this.selectedCombatant.hasBuff(SPELLS.COMBUSTION.id)) {
      const buffApplied = this.eventHistory.last(1, undefined, Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.COMBUSTION))[0].timestamp;
      const uptime = this.filteredActiveTime.getActiveTime(buffApplied, event.timestamp)
      this.combustionCasts[buffApplied] = uptime / (event.timestamp - buffApplied);
      this.activeTime += uptime;
    }
  }

  get buffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.COMBUSTION.id);
  }

  get percentActiveTime() {
    return (this.activeTime / this.buffUptime) || 0;
  }

  get downtimeSeconds() {
    return (this.buffUptime - this.activeTime) / 1000;
  }

  get averageDowntime() {
    return this.downtimeSeconds / this.abilityTracker.getAbility(SPELLS.COMBUSTION.id).casts;
  }

  get combustionActiveTimeThresholds() {
    return {
      actual: this.percentActiveTime,
      isLessThan: {
        minor: 0.95,
        average: 0.90,
        major: 0.80,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.combustionActiveTimeThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>You spent {formatNumber(this.downtimeSeconds)} seconds ({formatNumber(this.averageDowntime)}s per cast) not casting anything while <SpellLink id={SPELLS.COMBUSTION.id} /> was active. Because a large portion of your damage comes from Combustion, you should ensure that you are getting the most out of it every time it is cast. While sometimes this is out of your control (you got targeted by a mechanic at the worst possible time), you should try to minimize that risk by casting <SpellLink id={SPELLS.COMBUSTION.id} /> when you are at a low risk of being interrupted or when the target is vulnerable.</>)
          .icon(SPELLS.COMBUSTION.icon)
          .actual(<Trans id="mage.frost.suggestions.combustion.combustionActiveTime">{formatPercentage(this.percentActiveTime)}% Active Time during Combustion</Trans>)
          .recommended(`${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(30)}
        size="flexible"
        tooltip={(
          <>
            When using Combustion, you should ensure you are getting the most out of it by using every second of the cooldown as any time spent not casting anything is lost damage. While sometimes this will be out of your control due to boss mechanics, you should try to minimize that risk by using your cooldowns when you are least likely to get interrupted or the boss is vulnerable. <br /><br />Additionally, it is recommended that you minimize the delay from the time you activate Combustion until your pre-cast (the spell you were casting when you activated Combustion) finishes, to ensure you do not miss out on a GCD during Combustion while waiting for that pre-cast to finish. The recommendation (and the value that SimC/RaidBots uses) is to activate Combustion with 0.7 seconds or less remaining in your pre-cast, but if you do not want to adjust your gameplay or cannot accomplish this due to latency/ping issues then you can use the values below to tell RaidBots to adjust the delay that it uses to provide more accurate sims. To do this, enter "apl_variable.combustion_cast_remains=value" in the Custom APL section in Raid Bots (where "value" is the delay in seconds ... i.e. 1.1 or 0.9).
          </>
        )}
        dropdown={(
          <>
            <table className="table table-condensed">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Timestamp</th>
                <th style={{ textAlign: 'left' }}>Active Time</th>
                <th style={{ textAlign: 'left' }}>Delay</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.combustionPreCastDelay.combustionCasts).map((cast) => (
                <tr key={cast}>
                  <th style={{ textAlign: 'left' }}>{formatDuration((Number(cast) - this.owner.fight.start_time) / 1000)}</th>
                  <th style={{ textAlign: 'left' }}>{formatPercentage(this.combustionCasts[Number(cast)])}</th>
                  <td style={{ textAlign: 'left' }}>{(this.combustionPreCastDelay.combustionCasts[Number(cast)] / 1000).toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      >
        <BoringSpellValueText spell={SPELLS.COMBUSTION}>
          {formatPercentage(this.percentActiveTime)}% <small>Combustion Active Time</small><br />
          {this.combustionPreCastDelay.averageCastDelay.toFixed(2)}s <small>Avg. Pre-Cast Delay</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default CombustionActiveTime;
