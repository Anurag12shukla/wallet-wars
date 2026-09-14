import axios from 'axios';
import { ethers } from 'ethers';

const API_URL = 'http://localhost:5001/api';

async function runTest() {
  try {
    console.log('1. Checking Health...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('Health:', health.data.success);

    // Generate random Robinhood testnet EVM wallets
    const wallet1 = ethers.Wallet.createRandom().address;
    console.log(`\nRobinhood EVM Wallet 1: ${wallet1}`);

    const wallet2 = ethers.Wallet.createRandom().address;
    console.log(`Robinhood EVM Wallet 2: ${wallet2}`);

    console.log('\n2. Scanning Wallet 1 (Generating Warrior)...');
    const scan1 = await axios.post(`${API_URL}/wallet/scan`, { walletAddress: wallet1 });
    console.log(`Generated: ${scan1.data.data.warrior.name} (Level ${scan1.data.data.warrior.level})`);

    console.log('\n3. Scanning Wallet 2 (Generating Warrior)...');
    const scan2 = await axios.post(`${API_URL}/wallet/scan`, { walletAddress: wallet2 });
    console.log(`Generated: ${scan2.data.data.warrior.name} (Level ${scan2.data.data.warrior.level})`);

    console.log('\n4. Fetching Leaderboard...');
    const leaderboard = await axios.get(`${API_URL}/leaderboard`);
    console.log(`Leaderboard has ${leaderboard.data.data.length} entries`);

    console.log('\n5. Executing Battle...');
    const battle = await axios.post(`${API_URL}/battles/execute`, {
      challengerAddress: wallet1,
      targetAddress: wallet2
    });
    console.log(`Battle Success: ${battle.data.success}`);
    console.log(`Winner: ${battle.data.data.winnerAddress}`);
    console.log(`Rounds: ${battle.data.data.log.length}`);

    console.log('\n6. Fetching Stats...');
    const stats = await axios.get(`${API_URL}/stats`);
    console.log(`Total Warriors: ${stats.data.data.totalWarriors}`);
    console.log(`Total Battles: ${stats.data.data.totalBattles}`);

    console.log('\n✅ ALL INTEGRATION TESTS PASSED');
  } catch (error: any) {
    console.error('\n❌ TEST FAILED');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

runTest();
