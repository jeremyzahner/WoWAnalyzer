import React from 'react';

import SpellLink from 'common/SpellLink'; 
import Wrapper from 'common/Wrapper';

import SPELLS from 'common/SPELLS';
import DanceDamageTracker from './../../RogueCore/DanceDamageTracker';
import DarkShadow from './DarkShadow';


class DarkShadowNightblade extends DarkShadow {
  static dependencies = {
    danceDamageTracker: DanceDamageTracker,
  };

  suggestions(when) {
    const nightblade = this.danceDamageTracker.getAbility(SPELLS.NIGHTBLADE.id).casts;
    when(nightblade).isGreaterThan(0)
    .addSuggestion((suggest, actual, recommended) => {
      return suggest(<Wrapper>Do not cast <SpellLink id={SPELLS.NIGHTBLADE.id} /> during <SpellLink id={SPELLS.SHADOW_DANCE.id} /> when you are using <SpellLink id={SPELLS.DARK_SHADOW_TALENT.id} />. </Wrapper>)
        .icon(SPELLS.NIGHTBLADE.icon)
        .actual(`You cast Nightblade ${nightblade} times during Shadow Dance.`)
        .recommended(`0 is recommend.`)
        .major(0.5);
    });
  }
}

export default DarkShadowNightblade;
