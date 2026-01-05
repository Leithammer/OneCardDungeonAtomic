import _ from "/libs/atomic_/core.js";
import $ from "/libs/atomic_/shell.js";
import {reg} from "/libs/cmd.js";
import * as o from "/js/ocd.js";

const DieAssignTarget = Object.freeze({
  Movement:1,
  Attack:2,
  Defense:3
});

const $state = $.atom(o.init(1));

reg({$state});

$.swap($state, o.rollEnergyDice([2,3,4]));

$.swap($state, o.applyEnergyDieAssignment("attack", 0));   // 2
$.swap($state, o.applyEnergyDieAssignment("defense", 2));  // 4
$.swap($state, o.applyEnergyDieAssignment("movement", 1)); // 5

$.swap($state, o.moveAdventurer(0, 3))
$.swap($state, o.moveAdventurer(0, 2))
$.swap($state, o.moveAdventurer(4, 4))

