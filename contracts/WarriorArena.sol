// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WarriorArena
 * @dev On-chain warrior registry and combat outcome certification on Robinhood Network (Chain ID 46630).
 */
contract WarriorArena {
    struct WarriorProfile {
        string name;
        string archetype;
        string rarity;
        uint256 level;
        uint256 xp;
        uint256 hp;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 luck;
        uint256 wins;
        uint256 losses;
        uint256 winStreak;
        bool exists;
    }

    struct BattleRecord {
        bytes32 battleId;
        address challenger;
        address opponent;
        address winner;
        uint256 rounds;
        uint256 xpAwarded;
        uint256 timestamp;
    }

    address public owner;
    uint256 public totalWarriors;
    uint256 public totalBattles;

    mapping(address => WarriorProfile) public warriors;
    mapping(bytes32 => BattleRecord) public battles;
    address[] public warriorDirectory;

    event WarriorSummoned(
        address indexed owner,
        string name,
        string archetype,
        string rarity,
        uint256 level
    );

    event BattleRecorded(
        bytes32 indexed battleId,
        address indexed challenger,
        address indexed opponent,
        address winner,
        uint256 xpAwarded,
        uint256 timestamp
    );

    event LevelUp(
        address indexed warrior,
        uint256 newLevel,
        uint256 totalXp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "WarriorArena: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Register or update a warrior's on-chain presence on Robinhood Testnet.
     */
    function registerWarrior(
        string memory name,
        string memory archetype,
        string memory rarity,
        uint256 hp,
        uint256 attack,
        uint256 defense,
        uint256 speed,
        uint256 luck
    ) external {
        WarriorProfile storage w = warriors[msg.sender];

        if (!w.exists) {
            w.exists = true;
            w.level = 1;
            w.xp = 0;
            w.wins = 0;
            w.losses = 0;
            w.winStreak = 0;
            totalWarriors++;
            warriorDirectory.push(msg.sender);
        }

        w.name = name;
        w.archetype = archetype;
        w.rarity = rarity;
        w.hp = hp;
        w.attack = attack;
        w.defense = defense;
        w.speed = speed;
        w.luck = luck;

        emit WarriorSummoned(msg.sender, name, archetype, rarity, w.level);
    }

    /**
     * @notice Records an authenticated battle result between two warriors.
     */
    function recordBattle(
        bytes32 battleId,
        address challenger,
        address opponent,
        address winner,
        uint256 rounds,
        uint256 xpAwarded
    ) external {
        require(msg.sender == owner || msg.sender == challenger, "Unauthorized");
        require(battles[battleId].timestamp == 0, "Battle already recorded");

        battles[battleId] = BattleRecord({
            battleId: battleId,
            challenger: challenger,
            opponent: opponent,
            winner: winner,
            rounds: rounds,
            xpAwarded: xpAwarded,
            timestamp: block.timestamp
        });

        totalBattles++;

        // Update winner stats
        if (warriors[winner].exists) {
            warriors[winner].wins++;
            warriors[winner].winStreak++;
            warriors[winner].xp += xpAwarded;

            // Check level up (every 500 XP = 1 level)
            uint256 calculatedLevel = 1 + (warriors[winner].xp / 500);
            if (calculatedLevel > warriors[winner].level) {
                warriors[winner].level = calculatedLevel;
                emit LevelUp(winner, calculatedLevel, warriors[winner].xp);
            }
        }

        // Update loser stats
        address loser = (winner == challenger) ? opponent : challenger;
        if (warriors[loser].exists) {
            warriors[loser].losses++;
            warriors[loser].winStreak = 0;
            warriors[loser].xp += 50; // Consolation XP
        }

        emit BattleRecorded(battleId, challenger, opponent, winner, xpAwarded, block.timestamp);
    }

    /**
     * @notice Get warrior profile and combat stats.
     */
    function getWarrior(address account) external view returns (WarriorProfile memory) {
        require(warriors[account].exists, "Warrior does not exist");
        return warriors[account];
    }

    /**
     * @notice Returns total registered warriors in the directory.
     */
    function getDirectoryCount() external view returns (uint256) {
        return warriorDirectory.length;
    }
}
