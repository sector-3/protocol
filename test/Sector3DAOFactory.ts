import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sector3DAOFactory", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    console.log('deployFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Sector3DAOFactory = await ethers.getContractFactory("Sector3DAOFactory");
    const sector3DAOFactory = await Sector3DAOFactory.deploy();

    return { sector3DAOFactory, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { sector3DAOFactory, owner } = await loadFixture(deployFixture);

      expect(await sector3DAOFactory.owner()).to.equal(owner.address);
    });
  });

  describe("DAOs", function () {
    it("deploy DAO", async function () {
      const { sector3DAOFactory, owner } = await loadFixture(deployFixture);

      let daos = await sector3DAOFactory.getDAOs();
      // console.log('daos:', daos);
      expect(daos.length).to.equal(0);

      await sector3DAOFactory.deployDAO("DAO #1", "Purpose #1", "0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1");
      daos = await sector3DAOFactory.getDAOs();
      console.log('daos:', daos);
      expect(daos.length).to.equal(1);

      const Sector3DAO = await ethers.getContractFactory("Sector3DAO");
      const sector3DAO = await Sector3DAO.attach(daos[0]);
      expect(await sector3DAO.owner()).to.equal(owner.address);

      await sector3DAOFactory.deployDAO("DAO #2", "Purpose #2", "0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1");
      daos = await sector3DAOFactory.getDAOs();
      // console.log('daos:', daos);
      expect(daos.length).to.equal(2);
    })
  })

  it("remove DAO - from array of 1", async function () {
    const { sector3DAOFactory } = await loadFixture(deployFixture);

    let daos = await sector3DAOFactory.getDAOs();
    // console.log('daos:', daos);
    expect(daos.length).to.equal(0);

    await sector3DAOFactory.deployDAO("DAO #1", "Purpose #1", "0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1");
    await sector3DAOFactory.deployDAO("DAO #2", "Purpose #2", "0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1");
    daos = await sector3DAOFactory.getDAOs();
    // console.log('daos:', daos);
    expect(daos.length).to.equal(2);

    await sector3DAOFactory.removeDAO(daos[0]); 
    const daosAfterRemoval = await sector3DAOFactory.getDAOs();
    // console.log('daosAfterRemoval:', daosAfterRemoval);
    expect(daosAfterRemoval.length).to.equal(1);
    expect(daosAfterRemoval[0]).to.equal(daos[1]);
  })

  it("remove DAO - from array of 2", async function () {
    const { sector3DAOFactory } = await loadFixture(deployFixture);

    let daos = await sector3DAOFactory.getDAOs();
    // console.log('daos:', daos);
    expect(daos.length).to.equal(0);

    await sector3DAOFactory.deployDAO("DAO #1", "Purpose #1", "0x610210AA5D51bf26CBce146A5992D2FEeBc27dB1");
    daos = await sector3DAOFactory.getDAOs();
    // console.log('daos:', daos);
    expect(daos.length).to.equal(1);

    await sector3DAOFactory.removeDAO(daos[0]); 
    const daosAfterRemoval = await sector3DAOFactory.getDAOs();
    // console.log('daosAfterRemoval:', daosAfterRemoval);
    expect(daosAfterRemoval.length).to.equal(0);
  })
});
