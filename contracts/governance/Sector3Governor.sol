// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract Sector3Governor is GovernorVotes, GovernorVotesQuorumFraction, GovernorCountingSimple {
    constructor(IVotes _token)
        Governor("Sector#3 Governor")
        GovernorSettings(1 /* 1 block */, 50400 /* ~1 week */, 2049e15 /* 2.049 */)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(1)
    {}

    // The following functions are overrides required by Solidity.

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
