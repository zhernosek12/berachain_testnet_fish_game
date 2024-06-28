// Imports
// ========================================================
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

// Tests
// ========================================================
describe("BeraFishGame", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("BeraFishGame", [
      1719727361,
    ]);
    const publicClient = await hre.viem.getPublicClient();

    return {
      owner,
      otherAccount,
      publicClient,
      contract,
    };
  }

  /**
   *
   */
  describe("Deployment", function () {
    /**
     *
     */
    it("Should deploy with original message", async function () {
      // Setup
      const { contract } = await loadFixture(deployFixture);

      // Init
      const newEndDate = 1719566423n;
      await contract.write.updateEndDate([newEndDate]);

      // Init + Expectations
      const endDate = await contract.read.getEndDate();
      expect(endDate).to.equal(newEndDate);
    });
  });
});