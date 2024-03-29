import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Sector3DAOPriority", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWeeklyFixture() {
    console.log('deployWeeklyFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, user1] = await ethers.getSigners();
    console.log('owner.address:', owner.address);
    console.log('otherAccount.address:', otherAccount.address);
    console.log('user1.address:', user1.address);
    
    const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
    const dao = "0x96Bf89193E2A07720e42bA3AD736128a45537e63";  // Sector#3
    const title = "Priority Title";
    const SECTOR3 = await ethers.getContractFactory("SECTOR3");
    const rewardToken = await SECTOR3.deploy();
    const epochDurationInDays = 7;  // Weekly
    const epochBudget = (2.049 * 1e18).toString();  // 2.049
    const gatingNFT = ethers.constants.AddressZero;
    const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken.address, epochDurationInDays, epochBudget, gatingNFT);

    return { sector3DAOPriority, owner, otherAccount, user1, rewardToken };
  }

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployBiweeklyFixture() {
    console.log('deployBiweeklyFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('owner.address:', owner.address);
    // console.log('otherAccount.address:', otherAccount.address);

    const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
    const dao = "0x96Bf89193E2A07720e42bA3AD736128a45537e63";  // Sector#3
    const title = "Priority Title";
    const SECTOR3 = await ethers.getContractFactory("SECTOR3");
    const rewardToken = await SECTOR3.deploy();
    const epochDurationInDays = 14;  // Biweekly
    const epochBudget = (2.049 * 1e18).toString();  // 2.049
    const gatingNFT = ethers.constants.AddressZero;
    const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken.address, epochDurationInDays, epochBudget, gatingNFT);

    return { sector3DAOPriority, owner, otherAccount, rewardToken };
  }

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMonthlyFixture() {
    console.log('deployMonthlyFixture')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('owner.address:', owner.address);
    // console.log('otherAccount.address:', otherAccount.address);

    const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
    const dao = "0x96Bf89193E2A07720e42bA3AD736128a45537e63";  // Sector#3
    const title = "Priority Title";
    const SECTOR3 = await ethers.getContractFactory("SECTOR3");
    const rewardToken = await SECTOR3.deploy();
    const epochDurationInDays = 28;  // Monthly
    const epochBudget = (2.049 * 1e18).toString();  // 2.049
    const gatingNFT = ethers.constants.AddressZero;
    const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken.address, epochDurationInDays, epochBudget, gatingNFT);

    return { sector3DAOPriority, owner, otherAccount, rewardToken };
  }


  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWeeklyFixtureWithNFTGating() {
    console.log('deployWeeklyFixtureWithNFTGating')

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('owner.address:', owner.address);
    // console.log('otherAccount.address:', otherAccount.address);
    
    const Sector3DAOPriority = await ethers.getContractFactory("Sector3DAOPriority");
    const dao = "0x96Bf89193E2A07720e42bA3AD736128a45537e63";  // Sector#3
    const title = "Priority Title";
    const SECTOR3 = await ethers.getContractFactory("SECTOR3");
    const rewardToken = await SECTOR3.deploy();
    const epochDurationInDays = 7;  // Weekly
    const epochBudget = (2.049 * 1e18).toString();  // 2.049
    const S3DOVE = await ethers.getContractFactory("S3DOVE");
    const gatingNFT = await S3DOVE.deploy();
    const sector3DAOPriority = await Sector3DAOPriority.deploy(dao, title, rewardToken.address, epochDurationInDays, epochBudget, gatingNFT.address);

    return { sector3DAOPriority, owner, otherAccount, rewardToken, gatingNFT };
  }

  
  describe("Deployment", function() {
    it("Should set the right DAO address", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.dao()).to.equal("0x96Bf89193E2A07720e42bA3AD736128a45537e63");
    });

    it("Should set the right title", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.title()).to.equal("Priority Title");
    });

    it("Should set the right reward token address", async function() {
      const { sector3DAOPriority, rewardToken } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.rewardToken()).to.equal(rewardToken.address);
    });

    it("Deployer account should have the right reward token balance", async function() {
      const { owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      expect(await rewardToken.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("2049"));
    });

    it("Should set the right epoch duration - 7 days", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.epochDuration()).to.equal(7);
    });

    it("Should set the right epoch duration - 14 days", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      expect(await sector3DAOPriority.epochDuration()).to.equal(14);
    });

    it("Should set the right epoch duration - 28 days", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      expect(await sector3DAOPriority.epochDuration()).to.equal(28);
    });

    it("Should set the right epoch budget", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.epochBudget()).to.equal(ethers.utils.parseUnits("2.049"));
    });
  });

  
  describe("getEpochNumber - weekly fixture", async function() {
    it("Should return #1 immediately after deployment", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #2 after 1 week", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(2);
    });
  });

  
  describe("getEpochNumber - biweekly fixture", async function() {
    it("Should return #1 immediately after deployment", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #1 after 1 week", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #2 after 2 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      // Increase the time by 2 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 2 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 2 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(2);
    });

    it("Should return #2 after 3 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      // Increase the time by 3 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 3 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 3 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(2);
    });

    it("Should return #3 after 4 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployBiweeklyFixture);

      // Increase the time by 4 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 4 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 4 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(3);
    });
  });

  
  describe("getEpochNumber - monthly fixture", async function() {
    it("Should return #1 immediately after deployment", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #1 after 1 week", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #1 after 2 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      // Increase the time by 2 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 2 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 2 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #1 after 3 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      // Increase the time by 3 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 3 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 3 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(1);
    });

    it("Should return #2 after 4 weeks", async function() {
      const { sector3DAOPriority } = await loadFixture(deployMonthlyFixture);

      // Increase the time by 4 weeks
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 4 * 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 4 weeks later:", await time.latest());

      expect(await sector3DAOPriority.getEpochNumber()).to.equal(2);
    });
  });

  
  describe("addContribution", async function() {
    it("getContributions - length should be zero immediately after deployment", async function() {
      const { sector3DAOPriority } = await loadFixture(deployWeeklyFixture);
      
      const contributions = await sector3DAOPriority.getContributions()
      expect(contributions.length).to.equal(0);
    });

    it("getContributions - length should be 1 after first addition", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      const tx = await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );
      // console.log("tx:", tx);

      const contributions = await sector3DAOPriority.getContributions()
      expect(contributions.length).to.equal(1);
    });

    it("getContributions - length should be 2 after second addition", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      const contributions = await sector3DAOPriority.getContributions()
      expect(contributions.length).to.equal(2);
    });

    it("addContribution", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      const contributions = await sector3DAOPriority.getContributions();
      const contribution = contributions[0];
      // console.log("contribution:", contribution);

      expect(contribution.epochNumber).to.equal(1);
      expect(contribution.contributor).to.equal(owner.address);
      expect(contribution.description).to.equal("Description (test)");
      expect(contribution.hoursSpent).to.equal(10);
      expect(contribution.alignmentPercentage).to.equal(60);
    });

    it("addContribution - 2nd epoch", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      const contributions = await sector3DAOPriority.getContributions();
      const contribution = contributions[0];
      // console.log("contribution:", contribution);

      expect(contribution.epochNumber).to.equal(2);
      expect(contribution.contributor).to.equal(owner.address);
      expect(contribution.description).to.equal("Description (test)");
      expect(contribution.hoursSpent).to.equal(10);
      expect(contribution.alignmentPercentage).to.equal(60);
    });

    it("addContribution - 2nd epoch, 2nd contribution", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      await sector3DAOPriority.addContribution(
        "Description 2 (test)",
        "https://github.com/sector-3",
        12,
        80
      );

      const contributions = await sector3DAOPriority.getContributions();
      const contribution1 = contributions[0];
      // console.log("contribution1:", contribution1);

      expect(contribution1.epochNumber).to.equal(2);
      expect(contribution1.contributor).to.equal(owner.address);
      expect(contribution1.description).to.equal("Description (test)");
      expect(contribution1.hoursSpent).to.equal(10);
      expect(contribution1.alignmentPercentage).to.equal(60);

      const contribution2 = contributions[1];
      // console.log("contribution2:", contribution2);

      expect(contribution2.epochNumber).to.equal(2);
      expect(contribution2.contributor).to.equal(owner.address);
      expect(contribution2.description).to.equal("Description 2 (test)");
      expect(contribution2.hoursSpent).to.equal(12);
      expect(contribution2.alignmentPercentage).to.equal(80);
    });
  });


  describe("NFT gating - addContribution", async function() {
    it("should fail if NFT gating", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixtureWithNFTGating);

      await expect(sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      )).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "NoGatingNFTOwnership"
      )
    });

    it("should succeed if NFT gating and account is NFT owner", async function() {
      const { sector3DAOPriority, owner, gatingNFT } = await loadFixture(deployWeeklyFixtureWithNFTGating);
      
      await gatingNFT.safeMint(owner.address);
      
      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        10,
        60
      );

      const contributions = await sector3DAOPriority.getContributions()
      expect(contributions.length).to.equal(1);
    });
  });

  
  describe("getAllocationPercentage", async function() {
    it("Should be 100% if one contributor", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description (test)",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits('100'));
    });

    it("Should be 50% if two contributors", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits('50'));
    });

    it("two contributors - 20%/80% alignmentPercentage - same hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        1,
        20
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        1,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits('20'));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits('80'));
    });

    it("two contributors - 0%/100% alignmentPercentage - same hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        1,
        0
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        1,
        100
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits('0'));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits("100"));
    });

    it("two contributors - 100%/0% alignmentPercentage - same hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        1,
        100
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        1,
        0
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits("100"));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits('0'));
    });

    it("two contributors - 0%/0% alignmentPercentage - same hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        1,
        0
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        1,
        0
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits('0'));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits('0'));
    });

    it("two contributors - 20%/80% alignmentPercentage - 8/2 hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        8,
        20
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        2,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits("50"));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits("50"));
    });

    it("two contributors - 20%/80% alignmentPercentage - 1/3 hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        1,
        20
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        3,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Expect 20/260 = 7.692307692307692307% and 240/260 = 92.307692307692307692%
      const epochNumber1 = 1;
      const allocationPercentageOwner = await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address);
      console.log('allocationPercentageOwner:', allocationPercentageOwner);
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits("7.692307692307692307"));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits("92.307692307692307692"));
    });

    it("three contributors - 20%/100%/100% alignmentPercentage - 3/3/6 hoursSpent", async function() {
      const { sector3DAOPriority, owner, otherAccount, user1 } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        3,
        20
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        3,
        100
      );

      await sector3DAOPriority.connect(user1).addContribution(
        "Description #3",
        "https://github.com/sector-3",
        6,
        100
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Expect 60/960 = 6.25%, 300/960 = 31.25%, 600/960 = 62.5%
      const epochNumber1 = 1;
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, owner.address))
        .to.equal(ethers.utils.parseUnits("6.25"));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, otherAccount.address))
        .to.equal(ethers.utils.parseUnits("31.25"));
      expect(await sector3DAOPriority.getAllocationPercentage(epochNumber1, user1.address))
        .to.equal(ethers.utils.parseUnits("62.5"));
    });
  });

  
  describe("getEpochReward", async function() {
    it("Should be 2.049 if one contributor", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      const epochNumber = 1;
      const epochReward = await sector3DAOPriority.getEpochReward(epochNumber, owner.address);
      // console.log("epochReward:", epochReward);
      
      expect(epochReward).to.equal(ethers.utils.parseUnits("2.049"));
    });

    it("Should be 1.0245 if two contributors", async function() {
      const { sector3DAOPriority, owner, otherAccount } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      const epochNumber = 1;
      const epochReward = await sector3DAOPriority.getEpochReward(epochNumber, owner.address);
      // console.log("epochReward:", epochReward);
      
      expect(epochReward).to.equal(ethers.utils.parseUnits("1.0245"));
    });
  });


  describe("claimReward", async function() {
    it("Should revert if epoch not yet ended", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      const epochNumber = 1;
      await expect(sector3DAOPriority.claimReward(1)).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "EpochNotYetEnded"
      );
    });

    it("Should revert if the epoch has not yet been funded", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      await expect(sector3DAOPriority.claimReward(epochNumber1)).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "EpochNotYetFunded"
      );

      await sector3DAOPriority.addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract (for the first epoch)
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Attempt to claim rewards for the second epoch
      const epochNumber2 = 2;
      await expect(sector3DAOPriority.claimReward(epochNumber2)).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "EpochNotYetFunded"
      );
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));
    });

    it("Should revert if the account made no contributions during the epoch", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      const epochNumber = 1;
      await expect(sector3DAOPriority.claimReward(epochNumber)).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "NoRewardForEpoch"
      );
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));
    });

    it("Claim 100%", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward
      const epochNumber = 1;
      await sector3DAOPriority.claimReward(epochNumber);
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("0"));
    });

    it("Claim 50%", async function() {
      const { sector3DAOPriority, owner, otherAccount, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward (owner account)
      const epochNumber = 1;
      await sector3DAOPriority.claimReward(epochNumber);
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("1.0245"));

      // Claim reward (other account)
      expect(await rewardToken.balanceOf(otherAccount.address)).to.equal(0);
      await sector3DAOPriority.connect(otherAccount).claimReward(epochNumber);
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(0);
      expect(await rewardToken.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseUnits("1.0245"));
    });

    it("Claim 50% - should revert if claimed twice for the same epoch", async function() {
      const { sector3DAOPriority, owner, otherAccount, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description #1",
        "https://github.com/sector-3",
        5,
        60
      );

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description #2",
        "https://github.com/sector-3",
        5,
        60
      );

      // Increase the time by 1 week
      // console.log("Current time:", await time.latest());
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);
      // console.log("Time 1 week later:", await time.latest());

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward (owner account)
      const epochNumber = 1;
      await sector3DAOPriority.claimReward(epochNumber);
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("1.0245"));

      // Claim reward twice (owner account)
      await expect(sector3DAOPriority.claimReward(epochNumber)).to.be.revertedWithCustomError(
        sector3DAOPriority,
        "RewardAlreadyClaimed"
      );
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("1.0245"));
    });
  });


  describe("isRewardClaimed", async function() {
    it("epoch #1 - 0 contributions", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber = 1;
      expect(await sector3DAOPriority.isRewardClaimed(epochNumber, owner.address)).to.equal(false);
    });

    it("epoch #1 - 0 claims", async function() {
      const { sector3DAOPriority, owner } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber = 1;
      expect(await sector3DAOPriority.isRewardClaimed(epochNumber, owner.address)).to.equal(false);
    });

    it("epoch #1 - 1 claim", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward (owner account)
      const epochNumber1 = 1;
      await sector3DAOPriority.claimReward(epochNumber1);

      expect(await sector3DAOPriority.isRewardClaimed(epochNumber1, owner.address)).to.equal(true);
    });

    it("epoch #2 - 0 claims", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward (owner account)
      const epochNumber1 = 1;
      await sector3DAOPriority.claimReward(epochNumber1);

      expect(await sector3DAOPriority.isRewardClaimed(epochNumber1, owner.address)).to.equal(true);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isRewardClaimed(epochNumber2, owner.address)).to.equal(false);
    });

    it("epoch #1 - 1 claim by another account", async function() {
      const { sector3DAOPriority, owner, otherAccount, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.connect(otherAccount).addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Claim reward (other account)
      const epochNumber1 = 1;
      await sector3DAOPriority.connect(otherAccount).claimReward(epochNumber1);

      expect(await sector3DAOPriority.isRewardClaimed(epochNumber1, owner.address)).to.equal(false);
      expect(await sector3DAOPriority.isRewardClaimed(epochNumber1, otherAccount.address)).to.equal(true);
    });
  });


  describe("isEpochFunded", async function() {
    it("1st epoch without contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      // Expect false because no contributions were made
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
    });

    it("1st and 2nd epoch without contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(0)).to.equal(false);

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);
      
      expect(await sector3DAOPriority.isEpochFunded(0)).to.equal(false);
      expect(await sector3DAOPriority.isEpochFunded(1)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));
      
      expect(await sector3DAOPriority.isEpochFunded(0)).to.equal(false);
      expect(await sector3DAOPriority.isEpochFunded(1)).to.equal(false);
    });

    it("1st epoch with contributions, 2nd epoch without contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.098"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);
    });

    it("1st epoch with contributions, 2nd with contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.098"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(true);
    });

    it("1st epoch without contributions, 2nd with contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(true);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.098"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(true);
    });

    it("pre-funded - 1st epoch without contributions, 2nd with contributions", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("4.098"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.098"));

      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );

      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(true);
    });

    it("1st epoch - edge cases", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);
      
      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );
        
      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.048"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.048"));

      const epochNumber = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("0.001"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber)).to.equal(true);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("0.001"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.050"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber)).to.equal(true);
    });

    it("2nd epoch - edge cases", async function() {
      const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);
      
      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );
        
      // Increase the time by 1 week
      const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
      await time.increase(ONE_WEEK_IN_SECONDS);

      await sector3DAOPriority.addContribution(
        "Description",
        "https://github.com/sector-3",
        8,
        80
      );
        
      // Increase the time by 1 week
      await time.increase(ONE_WEEK_IN_SECONDS);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.048"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.048"));

      const epochNumber1 = 1;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(false);
      const epochNumber2 = 2;
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("0.001"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("0.001"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.050"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.047"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.097"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(false);

      // Transfer funding to the contract
      await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("0.001"));
      expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("4.098"));

      expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
      expect(await sector3DAOPriority.isEpochFunded(epochNumber2)).to.equal(true);
    });
  });

  it("1st epoch with contributions, after 100% claimed", async function() {
    const { sector3DAOPriority, owner, rewardToken } = await loadFixture(deployWeeklyFixture);

    await sector3DAOPriority.addContribution(
      "Description",
      "https://github.com/sector-3",
      8,
      80
    );

    // Increase the time by 1 week
    const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
    await time.increase(ONE_WEEK_IN_SECONDS);

    // Transfer funding to the contract
    await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
    expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

    const epochNumber1 = 1;
    expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
    expect(await sector3DAOPriority.claimsBalance()).to.equal(0);

    await sector3DAOPriority.claimReward(epochNumber1);

    expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
    expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(0);
    expect(await sector3DAOPriority.claimsBalance()).to.equal(ethers.utils.parseUnits("2.049"));
  });

  it("1st epoch with contributions, after 50% claimed", async function() {
    const { sector3DAOPriority, owner, otherAccount, rewardToken } = await loadFixture(deployWeeklyFixture);

    await sector3DAOPriority.addContribution(
      "Description",
      "https://github.com/sector-3",
      8,
      80
    );

    await sector3DAOPriority.connect(otherAccount).addContribution(
      "Description (other account)",
      "https://github.com/sector-3",
      8,
      80
    );

    // Increase the time by 1 week
    const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
    await time.increase(ONE_WEEK_IN_SECONDS);

    // Transfer funding to the contract
    await rewardToken.transfer(sector3DAOPriority.address, ethers.utils.parseUnits("2.049"));
    expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("2.049"));

    const epochNumber1 = 1;
    expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
    expect(await sector3DAOPriority.claimsBalance()).to.equal(0);

    await sector3DAOPriority.claimReward(epochNumber1);

    expect(await sector3DAOPriority.isEpochFunded(epochNumber1)).to.equal(true);
    expect(await rewardToken.balanceOf(sector3DAOPriority.address)).to.equal(ethers.utils.parseUnits("1.0245"));
    expect(await sector3DAOPriority.claimsBalance()).to.equal(ethers.utils.parseUnits("1.0245"));
  });
});
