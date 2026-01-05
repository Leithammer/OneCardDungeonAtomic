const DieAssignTarget = Object.freeze({
  Movement: "movement",
  Attack: "attack",
  Defense: "defense",
});

export function init(level) {
  return {
    dungeon: [
      ["EMPTY", "EMPTY", "EMPTY", "MONSTER", "EXIT"],
      ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "MONSTER"],
      ["EMPTY", "WALL", "EMPTY", "WALL", "EMPTY"],
      ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ],
    energyDicePool: [],
    energyAssignments: {
      movement: null,
      attack: null,
      defense: null,
    },
    adventurer: {
      x: 0,
      y: 4,
      remainingspeed: 2,
      health: 6,
      movement: 2,
      attack: 1,
      defense: 1,
      range: 1,
    },
    usedEnergyDiceIndexes: [],
  };
}

export function rollEnergyDice(dicePool) {
  if (!dicePool) {
    dicePool = [rollDie(6), rollDie(6), rollDie(6)];
  }
  return function (state) {
    return {
      ...state,
      energyDicePool: dicePool,
    };
  };
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
    if (dieIndex < 0 || dieIndex >= state.energyDicePool.length) {
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
        [target]: state.energyDicePool[dieIndex],
      },
      usedEnergyDiceIndexes: [...state.usedEnergyDiceIndexes, dieIndex],
    };
  };
}

export function moveAdventurer(x, y) {
  return function (state) {
    if (!isEnergyDieAssignmentComplete) {
      return state;
    }
    const cost = movementCost(state.adventurer.x, state.adventurer.y, x, y);
    if (cost === Infinity) return state;
    if (cost > state.adventurer.remainingspeed) return state;
    if (isWall(x, y)) return state;
    if (monsterAt( x, y)) return state;
    return {
      ...state,
      adventurer: {
        ...state.adventurer,
        x: x,
        y: y,
      },
    };
  };
}

function isEnergyDieAssignmentComplete() {
  return function (state) {
    return state.usedEnergyDiceIndexes.length === 3;
  };
}

function rollDie(diemax) {
  const rndInt = Math.floor(Math.random() * diemax) + 1;
  return rndInt;
}

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

function isWall(x, y) {
  return function (state) {
    if (x > 4 || y > 4) {
      return true;
    } else {
      return state.dungeon[x][y] === "WALL";
    }
  };
}
function monsterAt(x, y) {
  return function (state) {
    if (x > 4 || y > 4) {
      return true;
    } else {
      return state.dungeon[x][y] === "MONSTER";
    }
  };
}
