import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sector3DAO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    console.log('deployOneYearLockFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Sector3DAO = await ethers.getContractFactory("Sector3DAO");
    const sector3DAO = await Sector3DAO.deploy("Name Value", "Purpose Value", "0x942d6e75465C3c248Eb8775472c853d2b56139fE");

    return { sector3DAO, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right version", async function () {
      const { sector3DAO } = await loadFixture(deployOneYearLockFixture);

      expect(await sector3DAO.version()).to.equal(3);
    });

    it("Should set the right owner", async function () {
      const { sector3DAO, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await sector3DAO.owner()).to.equal(owner.address);
    });

    it("Should set the right DAO name", async function () {
      const { sector3DAO } = await loadFixture(deployOneYearLockFixture);

      expect(await sector3DAO.name()).to.equal("Name Value");
    });

    it("Should set the right DAO purpose", async function () {
      const { sector3DAO } = await loadFixture(deployOneYearLockFixture);

      expect(await sector3DAO.purpose()).to.equal("Purpose Value");
    });
  });
});
