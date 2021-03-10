import React from 'react';
import { formatPercentage } from 'common/format';
import { SpellLink } from 'interface';
import { SpellIcon } from 'interface';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import BoringValueText from 'parser/ui/BoringValueText';
import Statistic from 'parser/ui/Statistic';
import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import SPELLS from 'common/SPELLS';
import { t } from '@lingui/macro';

class Moonfire extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  suggestions(when) {
    const moonfireUptimePercentage = this.enemies.getBuffUptime(SPELLS.MOONFIRE_BEAR.id) / this.owner.fightDuration;

    when(moonfireUptimePercentage).isLessThan(0.95)
      .addSuggestion((suggest, actual, recommended) => suggest(<span> Your <SpellLink id={SPELLS.MOONFIRE_BEAR.id} /> uptime was {formatPercentage(moonfireUptimePercentage)}%, unless you have extended periods of downtime it should be near 100%.</span>)
        .icon(SPELLS.MOONFIRE_BEAR.icon)
        .actual(t({
      id: "druid.guardian.suggestions.moonfire.uptime",
      message: `${formatPercentage(moonfireUptimePercentage)}% uptime`
    }))
        .recommended(`${Math.round(formatPercentage(recommended))}% is recommended`)
        .regular(recommended - 0.05).major(recommended - 0.15));
  }

  statistic() {
    const moonfireUptimePercentage = this.enemies.getBuffUptime(SPELLS.MOONFIRE_BEAR.id) / this.owner.fightDuration;

    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(12)}
        size="flexible"
        tooltip={<>Your <strong>Moonfire</strong> uptime is <strong>{`${formatPercentage(moonfireUptimePercentage)}%`}</strong></>}
      >         
        <BoringValueText label={<><SpellIcon id={SPELLS.MOONFIRE_BEAR.id} /> Moonfire uptime </>} >           
              {`${formatPercentage(moonfireUptimePercentage)}%`}          
        </BoringValueText>
      </Statistic>
    );
  }
}

export default Moonfire;
