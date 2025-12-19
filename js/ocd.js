const DieAssignTarget = Object.freeze({
  Movement: "movement",
  Attack: "attack",
  Defense: "defense"
});

export function init(level) {
  return {
    dungeon: [
      ["EXIT", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
      ["WALL", "EMPTY", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "ENTER"]
    ],
    energyDicePool: [],
    energyAssignments: {
      movement: null,
      attack: null,
      defense: null
    },
    usedEnergyDiceIndexes: []
  };
}


export function rollEnergyDice(){
    const dice = [rollDie(6), rollDie(6), rollDie(6)];
    return function(state){
        return {...state, energyDicePool: dice
        }
    }
}

export function applyEnergyDieAssignment(target, dieIndex) {
  return function (state) {
    // guard: invalid target
    if (!(target in state.energyAssignments)) {
      throw new Error(`Invalid assignment target: ${target}`);
    }

    // guard: already assigned
    if (state.energyAssignments[target] !== null) {
      throw new Error(`${target} already assigned`);
    }

    // guard: invalid die index
    if (
      dieIndex < 0 ||
      dieIndex >= state.energyDicePool.length
    ) {
      throw new Error(`Invalid die index: ${dieIndex}`);
    }

    // guard: die already used
    if (state.usedEnergyDiceIndexes.includes(dieIndex)) {
      throw new Error(`Energy die ${dieIndex} already used`);
    }

    return {
      ...state,
      energyAssignments: {
        ...state.energyAssignments,
        [target]: state.energyDicePool[dieIndex]
      },
      usedEnergyDiceIndexes: [
        ...state.usedEnergyDiceIndexes,
        dieIndex
      ]
    };
  };
}


function rollDie(diemax) {
  const rndInt = Math.floor(Math.random() * diemax) + 1;
  return rndInt;
}
