const DieAssignTarget = Object.freeze({
  Movement: "movement",
  Attack: "attack",
  Defense: "defense"
});

export function init(level) {
  return {
    dungeon: [
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EXIT"],
      ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
      ["EMPTY", "WALL", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"]
    ],
    energyDicePool: [],
    energyAssignments: {
      movement: null,
      attack: null,
      defense: null
    },
    adventurer: {
      x: 0,
      y: 4,
      health: 6,

    },
    usedEnergyDiceIndexes: []
  };
}


export function rollEnergyDice() {
  const dice = [rollDie(6), rollDie(6), rollDie(6)];
  return function (state) {
    return {
      ...state, energyDicePool: dice
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

export function moveAdventurer(adventurer, x, y) {
  return function (state) {
    const cost = movementCost(adventurer.x, adventurer.y, x, y);
    if (cost === Infinity) return state;
    // if (cost > state.adventurer.remaining.speed) return state;
    if (isWall(state.dungeon, x, y)) return state;
    // if (monsterAt(state.monsters, to.x, to.y)) return state;
      return {
        ...state,
        adventurer: {
          ...state.adventurer,
          x: x,
          y: y,
        }
      }
  }
};
function movementCost(fromX, fromY, toX, toY) {
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  if (dx === 0 && dy === 0) return Infinity;
  if (dx > 1 || dy > 1) return Infinity;

  // orthogonal
  if (dx + dy === 1) return 2;

  // diagonal
  if (dx === 1 && dy === 1) return 3;

  return Infinity;
}
function isWall(dungeon, x, y) {
  if (x > 4 || y > 4) {
    return true;
  } else {
    return dungeon[x][y] === "WALL";
  }
}