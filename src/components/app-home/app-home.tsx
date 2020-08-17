import { h, Component, State } from '@stencil/core';
import { Character, Combat, Slot } from '../../interfaces';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  buttons = ['Head', 'Torso', 'Feet', 'Hand', 'Other'];

  @State() character: Character = {
    level: 1,
    equipmentBonus: 0,
    items: []
  };

  @State() combat: Combat = {
    combatTotal: 0,
    combatVisible: false
  };

  constructor() {
    this.loadCharacter();
  }

  private loadCharacter() {
    this.character.level = +localStorage.getItem('charLevel') || 1;
    this.character.equipmentBonus = +localStorage.getItem('charEquip') || 0;
    this.character.items = JSON.parse(localStorage.getItem('charItems')) || [];
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
      <div class="ion-margin-top">

        <h3>Total Combat Score</h3>

        <div>
          { this.totalScore } (base)
          { this.combat.combatTotal >= 0 ? ' +' : ' -' } { Math.abs(this.combat.combatTotal) } =
          <strong>{ ' ' + (this.totalScore + this.combat.combatTotal) }</strong>
        </div>

        <h2>Combat Modifier</h2>

        <div class="row">
          <span class="col left">
            <ion-button class="ion-margin-right" onClick={() => this.modCombat(-20)}>
              -20
            </ion-button>
            <ion-button class="ion-margin-right" onClick={() => this.modCombat(-10)}>
              -10
            </ion-button>
            <ion-button class="ion-margin-right" onClick={() => this.modCombat(-5)}>
              -5
            </ion-button>
            <ion-button class="ion-margin-right" onClick={() => this.modCombat(-1)}>
              -1
            </ion-button>
          </span>

          <span class="col center ion-margin-horizontal ion-padding-horizontal">{ this.combat.combatTotal }</span>

          <span class="col right">
            <ion-button class="ion-margin-left" onClick={() => this.modCombat(1)}>
              +1
            </ion-button>
            <ion-button class="ion-margin-left" onClick={() => this.modCombat(5)}>
              +5
            </ion-button>
            <ion-button class="ion-margin-left" onClick={() => this.modCombat(10)}>
              +10
            </ion-button>
            <ion-button class="ion-margin-left" onClick={() => this.modCombat(20)}>
              +20
            </ion-button>
          </span>
        </div>
      </div>,

      <div class="ion-margin-top">
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

      <ion-content class="ion-padding ion-text-center">
        <div class="hr"></div>
        <h2>Character</h2>
        <div class="hr"></div>

        <h3>
          <ion-label>Level</ion-label>
        </h3>

        <div class="row ion-margin-top">
          <span class="col left">
            <ion-button class="ion-margin-right" onClick={() => this.modLevel(-1)}>
              -1
            </ion-button>
          </span>

          <span class="col center ion-margin-horizontal ion-padding-horizontal">{ this.character.level }</span>

          <span class="col right">
            <ion-button class="ion-margin-left" onClick={() => this.modLevel(1)}>
              +1
            </ion-button>
          </span>
        </div>

        <h3>
          <ion-label>Items</ion-label>
        </h3>

        <div>
          { this.buttons.map(button => {
            return <ion-button color="medium" onClick={() => this.addItem(button)}>+ {button}</ion-button>;
          }) }
        </div>

        { this.character.items.map((item, index) => {
          return <div class="item ion-margin-vertical">
            <span class="slot ion-margin-right">{ item.slot }</span>

            <span class="row ion-margin-horizontal">
              <span class="col left">
                <ion-button onClick={() => this.updateItemScore(index, -1)}>
                  -1
                </ion-button>
              </span>

              <span class="col center score ion-margin-horizontal">{ item.score }</span>

              <span class="col right">
                <ion-button onClick={() => this.updateItemScore(index, 1)}>
                  +1
                </ion-button>
              </span>
            </span>

            <span class="ion-margin-left">
              <ion-button color="danger" onClick={() => this.removeItem(index)}>
                <ion-icon name="close"></ion-icon>
              </ion-button>
            </span>
          </div>;
        }) }

        <h3>
          <ion-label>Extra Item Score</ion-label>
        </h3>

        <div class="row ion-margin-top">
          <span class="col left">
            <ion-button class="ion-margin-right" onClick={() => this.modEquipment(-10)}>
              -10
            </ion-button>
            <ion-button class="ion-margin-right" onClick={() => this.modEquipment(-5)}>
              -5
            </ion-button>
            <ion-button class="ion-margin-right" onClick={() => this.modEquipment(-1)}>
              -1
            </ion-button>
          </span>

          <span class="col center ion-margin-horizontal ion-padding-horizontal">{ this.character.equipmentBonus }</span>

          <span class="col right">
            <ion-button class="ion-margin-left" onClick={() => this.modEquipment(1)}>
              +1
            </ion-button>
            <ion-button class="ion-margin-left" onClick={() => this.modEquipment(5)}>
              +5
            </ion-button>
            <ion-button class="ion-margin-left" onClick={() => this.modEquipment(10)}>
              +10
            </ion-button>
          </span>
        </div>

        <h4>Total Item Score</h4>

        { this.character.level } (level) + { this.totalItemScore } (gear) + { this.character.equipmentBonus } (items) =
        <strong> { this.totalScore }</strong>

        { this.character.items.map(item => {
          <span>{ item.slot }</span>
        }) }

        <div class="hr"></div>
        <h2>
          <ion-label>Combat</ion-label>
        </h2>
        <div class="hr"></div>

        <div>
          <ion-button color="medium" onClick={() => this.toggleCombatVisibility(!this.combat.combatVisible)}>
            Toggle Combat
          </ion-button>

          <ion-button color="medium" onClick={() => this.resetCombat()}>
            Reset Combat
          </ion-button>
        </div>

        { this.renderCombat() }

      </ion-content>
    ];
  }

  get totalScore(): number {
    return this.totalItemScore + this.character.equipmentBonus + this.character.level;
  }

  get totalItemScore(): number {
    return this.character.items.reduce((prev, { score, mod }) => {
      return prev + score + mod;
    }, 0);
  }

  // UI UPDATE FUNCTIONS
  private updateCombat(): void {
    this.combat = { ...this.combat };
  }

  private saveStats(): void {
    this.character = { ...this.character };
    localStorage.setItem('charLevel', '' + this.character.level);
    localStorage.setItem('charEquip', '' + this.character.equipmentBonus);
    localStorage.setItem('charItems', JSON.stringify(this.character.items));
  }

  // CHARACTER FUNCTIONS
  resetStats(): void {
    this.character.level = 1;
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

  addItem(itemSlot: string): void {
    this.character.items.push({
      slot: itemSlot as Slot,
      score: 0,
      mod: 0
    });
    this.saveStats();
  }

  removeItem(index: number): void {
    this.character.items.splice(index, 1);
    this.saveStats();
  }

  updateItemScore(index: number, mod: number): void {
    this.character.items[index].score += mod;
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
