import { Component, State } from '@stencil/core';
import { Character, Combat } from '../../interfaces';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @State() character: Character = {
    level: 1,
    equipmentBonus: 0
  };

  @State() combat: Combat = {
    combatTotal: 0,
    combatVisible: false
  };

  constructor() {
    this.loadCharacter();
  }

  private loadCharacter() {
    this.character.level = +localStorage.getItem('charLevel') || 0;
    this.character.equipmentBonus = +localStorage.getItem('charEquip') || 0;
  }

  combatScoreMessage() {
    const score = this.combat.combatTotal;

    if(score < -50) return 'This was probably overkill.';
    if(score < -40) return 'RIP.';
    if(score < -30) return 'Your friends are jerks.';
    if(score < -20) return 'This is barely salvageable.';

    if(score > 100) return 'Cheater.';

    if(score >  50) return 'If you don\'t win, you\'re bad.';
    if(score >  40) return 'Wow!';
    if(score >  30) return 'You\'ve gotta be paying your friends.';
    if(score >  20) return 'Good luck!';
  }

  renderCombat() {
    if(!this.combat.combatVisible) return [];

    return [
      <div margin-top>

        <h2>Total Score</h2>

        <div>
          { this.character.equipmentBonus + this.character.level } (base) 
          { this.combat.combatTotal >= 0 ? ' +' : ' -' } { Math.abs(this.combat.combatTotal) } = 
          <strong>{ ' ' + (this.character.equipmentBonus + this.character.level + this.combat.combatTotal) }</strong>
        </div>

        <h2>Combat Modifier</h2>

        <ion-button margin-right onClick={() => this.modCombat(-20)}>
          -20
        </ion-button>
        <ion-button margin-right onClick={() => this.modCombat(-10)}>
          -10
        </ion-button>
        <ion-button margin-right onClick={() => this.modCombat(-5)}>
          -5
        </ion-button>
        <ion-button margin-right onClick={() => this.modCombat(-1)}>
          -1
        </ion-button>

        <span margin-horizontal padding-horizontal>{ this.combat.combatTotal }</span>

        <ion-button margin-left onClick={() => this.modCombat(1)}>
          +1
        </ion-button>
        <ion-button margin-left onClick={() => this.modCombat(5)}>
          +5
        </ion-button>
        <ion-button margin-left onClick={() => this.modCombat(10)}>
          +10
        </ion-button>
        <ion-button margin-left onClick={() => this.modCombat(20)}>
          +20
        </ion-button>
      </div>,

      <div margin-top>
        <em>{ this.combatScoreMessage() }</em>
      </div>
    ];
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Munchcalc</ion-title>

          <ion-buttons slot="end">
            <ion-button onClick={() => this.resetStats()} color="danger">Reset Stats</ion-button>
          </ion-buttons>

        </ion-toolbar>
      </ion-header>,

      <ion-content padding text-center>
        <h2>
          <ion-label>Level</ion-label>
        </h2>

        <div margin-top>
          <ion-button margin-right onClick={() => this.modLevel(-1)}>
            -1
          </ion-button>

          <span margin-horizontal padding-horizontal>{ this.character.level }</span>

          <ion-button margin-left onClick={() => this.modLevel(1)}>
            +1
          </ion-button>
        </div>

        <h2>
          <ion-label>Equipment</ion-label>
        </h2>

        <div margin-top>
          <ion-button margin-right onClick={() => this.modEquipment(-10)}>
            -10
          </ion-button>
          <ion-button margin-right onClick={() => this.modEquipment(-5)}>
            -5
          </ion-button>
          <ion-button margin-right onClick={() => this.modEquipment(-1)}>
            -1
          </ion-button>

          <span margin-horizontal padding-horizontal>{ this.character.equipmentBonus }</span>

          <ion-button margin-left onClick={() => this.modEquipment(1)}>
            +1
          </ion-button>
          <ion-button margin-left onClick={() => this.modEquipment(5)}>
            +5
          </ion-button>
          <ion-button margin-left onClick={() => this.modEquipment(10)}>
            +10
          </ion-button>
        </div>

        <h2>
          <ion-label>Combat</ion-label>
        </h2>

        <div>
          <ion-button onClick={() => this.toggleCombatVisibility(true)}>
            Begin Combat
          </ion-button>

          <ion-button margin-horizontal onClick={() => this.toggleCombatVisibility(false)}>
            Close Combat
          </ion-button>

          <ion-button onClick={() => this.resetCombat()}>
            Reset Combat
          </ion-button>
        </div>

        { this.renderCombat() }

      </ion-content>
    ];
  }

  // UI UPDATE FUNCTIONS
  private updateCombat(): void {
    this.combat = { ...this.combat };
  }

  private saveStats(): void {
    this.character = { ...this.character };
    localStorage.setItem('charLevel', '' + this.character.level);
    localStorage.setItem('charEquip', '' + this.character.equipmentBonus);
  }

  // CHARACTER FUNCTIONS
  resetStats(): void {
    this.character.level = 0;
    this.character.equipmentBonus = 0;
    
    this.saveStats();
  }

  modLevel(mod: number): void {
    this.character.level = Math.max(1, this.character.level + mod);
    this.saveStats();
  }

  modEquipment(mod: number): void {
    this.character.equipmentBonus = Math.max(0, this.character.equipmentBonus + mod);
    this.saveStats();
  }

  // COMBAT FUNCTIONS
  toggleCombatVisibility(isShown: boolean): void {
    this.combat.combatVisible = isShown;
    this.updateCombat();
  }

  modCombat(mod: number): void {
    this.combat.combatTotal += mod;
    this.updateCombat();
  }

  resetCombat(): void {
    this.combat.combatTotal = 0;
    this.updateCombat();
  }
}
