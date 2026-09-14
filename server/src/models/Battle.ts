import mongoose, { Schema, Document } from 'mongoose';

export interface IRound {
  roundNumber: number;
  action: 'ATTACK' | 'CRITICAL_HIT' | 'DODGE' | 'COUNTER' | 'BLOCK' | 'SPECIAL_ATTACK';
  attacker: 'playerOne' | 'playerTwo';
  damage: number;
  playerOneHp: number;
  playerTwoHp: number;
  description: string;
  isCritical: boolean;
  isDodge: boolean;
  isSpecial: boolean;
}

export interface IBattle extends Document {
  battleId: string;
  playerOneWallet: string;
  playerTwoWallet: string;
  playerOneWarrior: mongoose.Types.ObjectId;
  playerTwoWarrior: mongoose.Types.ObjectId;
  winner: string;
  loser: string;
  rounds: IRound[];
  battleSeed: string;
  battleLog: string[];
  playerOneScore: number;
  playerTwoScore: number;
  playerOneDamageDealt: number;
  playerTwoDamageDealt: number;
  playerOneCriticalHits: number;
  playerTwoCriticalHits: number;
  duration: number;
  isDemo: boolean;
  createdAt: Date;
}

const RoundSchema = new Schema<IRound>({
  roundNumber: { type: Number, required: true },
  action: {
    type: String,
    enum: ['ATTACK', 'CRITICAL_HIT', 'DODGE', 'COUNTER', 'BLOCK', 'SPECIAL_ATTACK'],
    required: true,
  },
  attacker: { type: String, enum: ['playerOne', 'playerTwo'], required: true },
  damage: { type: Number, default: 0 },
  playerOneHp: { type: Number, required: true },
  playerTwoHp: { type: Number, required: true },
  description: { type: String, required: true },
  isCritical: { type: Boolean, default: false },
  isDodge: { type: Boolean, default: false },
  isSpecial: { type: Boolean, default: false },
});

const BattleSchema = new Schema<IBattle>(
  {
    battleId: { type: String, required: true, unique: true, index: true },
    playerOneWallet: { type: String, required: true, lowercase: true, index: true },
    playerTwoWallet: { type: String, required: true, lowercase: true, index: true },
    playerOneWarrior: { type: Schema.Types.ObjectId, ref: 'Warrior', required: true },
    playerTwoWarrior: { type: Schema.Types.ObjectId, ref: 'Warrior', required: true },
    winner: { type: String, required: true, lowercase: true },
    loser: { type: String, required: true, lowercase: true },
    rounds: [RoundSchema],
    battleSeed: { type: String, required: true },
    battleLog: [{ type: String }],
    playerOneScore: { type: Number, default: 0 },
    playerTwoScore: { type: Number, default: 0 },
    playerOneDamageDealt: { type: Number, default: 0 },
    playerTwoDamageDealt: { type: Number, default: 0 },
    playerOneCriticalHits: { type: Number, default: 0 },
    playerTwoCriticalHits: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    isDemo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BattleSchema.index({ createdAt: -1 });
BattleSchema.index({ winner: 1, createdAt: -1 });

export const Battle = mongoose.model<IBattle>('Battle', BattleSchema);
