import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sector3DAO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    console.log('deployFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Sector3DAO = await ethers.getContractFactory("Sector3DAO");
    const sector3DAO = await Sector3DAO.deploy("Name Value", "Purpose Value", "0x942d6e75465C3c248Eb8775472c853d2b56139fE");

    return { sector3DAO, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right version", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      expect(await sector3DAO.version()).to.equal(1);
    });

    it("Should set the right owner", async function () {
      const { sector3DAO, owner, otherAccount } = await loadFixture(deployFixture);

      expect(await sector3DAO.owner()).to.equal(owner.address);

      await sector3DAO.setOwner(otherAccount.address);
      expect(await sector3DAO.owner()).to.equal(otherAccount.address);
    });

    it("Should set the right DAO name", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      expect(await sector3DAO.name()).to.equal("Name Value");

      await sector3DAO.setName("New Name");
      expect(await sector3DAO.name()).to.equal("New Name");
    });

    it("Should set the right DAO purpose", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      expect(await sector3DAO.purpose()).to.equal("Purpose Value");

      await sector3DAO.setPurpose("New Purpose");
      expect(await sector3DAO.purpose()).to.equal("New Purpose");
    });

    it("Should set the right DAO token", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      expect(await sector3DAO.token()).to.equal("0x942d6e75465C3c248Eb8775472c853d2b56139fE");

      await sector3DAO.setToken(ethers.constants.AddressZero);
      expect(await sector3DAO.token()).to.equal(ethers.constants.AddressZero);
    });
  });

  describe("Priorities", function () {
    it("deploy priority", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      let priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(0);

      await expect(sector3DAO.deployPriority('Priority #1', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 7, (2.049 * 1e18).toString(), ethers.constants.AddressZero))
        .to.emit(sector3DAO, "PriorityDeployed");
      priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(1);

      await expect(sector3DAO.deployPriority('Priority #2', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 14, (4.098 * 1e18).toString(), ethers.constants.AddressZero))
        .to.emit(sector3DAO, "PriorityDeployed");
      priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(2);
    })

    it("remove priority - from array of 1", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      await sector3DAO.deployPriority('Priority #1', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 7, (2.049 * 1e18).toString(), ethers.constants.AddressZero);
      let priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(1);

      await sector3DAO.removePriority(priorities[0]);
      const prioritiesAfterRemoval = await sector3DAO.getPriorities();
      // console.log('prioritiesAfterRemoval:', prioritiesAfterRemoval);
      expect(prioritiesAfterRemoval.length).to.equal(0);
    })

    it("remove priority - from array of 2", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      await sector3DAO.deployPriority('Priority #1', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 7, (2.049 * 1e18).toString(), ethers.constants.AddressZero);
      await sector3DAO.deployPriority('Priority #2', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 14, (4.098 * 1e18).toString(), ethers.constants.AddressZero);
      let priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(2);

      await sector3DAO.removePriority(priorities[0]);
      const prioritiesAfterRemoval = await sector3DAO.getPriorities();
      // console.log('prioritiesAfterRemoval:', prioritiesAfterRemoval);
      expect(prioritiesAfterRemoval.length).to.equal(1);
      expect(prioritiesAfterRemoval[0]).to.equal(priorities[1]);
    })

    it("remove priority, then deploy priority", async function () {
      const { sector3DAO } = await loadFixture(deployFixture);

      await sector3DAO.deployPriority('Priority #1', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 7, (2.049 * 1e18).toString(), ethers.constants.AddressZero);
      await sector3DAO.deployPriority('Priority #2', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 14, (4.098 * 1e18).toString(), ethers.constants.AddressZero);
      let priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(2);

      await sector3DAO.removePriority(priorities[0]);
      const prioritiesAfterRemoval = await sector3DAO.getPriorities();
      // console.log('prioritiesAfterRemoval:', prioritiesAfterRemoval);
      expect(prioritiesAfterRemoval.length).to.equal(1);
      expect(prioritiesAfterRemoval[0]).to.equal(priorities[1]);

      await sector3DAO.deployPriority('Priority #3', '0x942d6e75465C3c248Eb8775472c853d2b56139fE', 21, (6.147 * 1e18).toString(), ethers.constants.AddressZero);
      priorities = await sector3DAO.getPriorities();
      // console.log('priorities:', priorities);
      expect(priorities.length).to.equal(2);
    })
  })
});
