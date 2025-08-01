# ImpactBond Protocol

A decentralized impact finance platform that enables transparent, outcome-based funding for climate, social, and sustainability projects — powered entirely by smart contracts on the Stacks blockchain.

---

## Overview

**ImpactBond Protocol** utilizes 10 smart contracts to manage every phase of outcome-driven social finance: from launching tokenized impact bonds to verifying results and distributing returns — all on-chain.

1. **ImpactBondFactory Contract** – Deploys and tracks individual bond projects.  
2. **ImpactBond Contract** – Core logic for lifecycle of a specific impact bond.  
3. **TokenizedStake Contract** – Issues stake tokens to investors/donors in each bond.  
4. **OutcomeVerifier Contract** – Manages submission and validation of outcome proofs.  
5. **ImpactOracleRegistry Contract** – Registers trusted verifiers and oracles.  
6. **ImpactToken Contract** – Tokenized return-on-impact credits for investors.  
7. **ReputationSystem Contract** – Measures impact credibility of NGOs and verifiers.  
8. **GovernanceDAO Contract** – Allows stakeholders to vote on protocol upgrades.  
9. **DonationMatching Contract** – Handles quadratic funding and matched donations.  
10. **Treasury Contract** – Holds and routes capital for funding and payouts.

---

## Features

- **Outcome-based impact bonds** with conditional disbursement  
- **Tokenized contribution stakes** for traceable participation  
- **On-chain outcome verification** via registered oracles  
- **Reputation system** for NGOs, verifiers, and funders  
- **Return-on-impact tokens** that can be traded or redeemed  
- **DAO governance** for open protocol development  
- **Quadratic funding mechanisms** for donation boosts  
- **Treasury routing** with auditability and fund segregation  
- **Modular architecture** for scaling across regions and causes  
- **Fully on-chain verification and payout logic**

---

## Smart Contracts

### ImpactBondFactory Contract
- Deploys new `ImpactBond` instances  
- Tracks all deployed bonds  
- Allows NGOs to initialize new bond campaigns

### ImpactBond Contract
- Manages funding, escrow, verification, and payout flows  
- Links to outcome verifiers and tokenized stakes  
- Prevents fund misuse until results are verified

### TokenizedStake Contract
- Mints stake tokens (NFTs or fungibles) to contributors  
- Records individual contributions in each bond  
- Used for future returns or rewards

### OutcomeVerifier Contract
- Handles submission of impact verification  
- Verifies results through trusted oracles  
- Triggers payouts upon confirmation

### ImpactOracleRegistry Contract
- Whitelists verifiers and data sources  
- Reputation-based validator tracking  
- DAO-controlled registry

### ImpactToken Contract
- Represents return-on-impact credits (ERC20/SIP-010)  
- Tradable, redeemable, or burnable by stakeholders  
- Could be used for ESG reporting or carbon offset markets

### ReputationSystem Contract
- Tracks success/failure of NGOs and verifiers  
- Scores based on past bond results and governance participation  
- Used for filtering and risk adjustment

### GovernanceDAO Contract
- Stakeholder-driven decision making  
- Propose/approve updates, slashing verifiers, parameter changes  
- Token-based voting system

### DonationMatching Contract
- Enables quadratic funding and donation matching  
- Coordinates with external sponsors or treasuries  
- Encourages small-donor participation

### Treasury Contract
- Holds pooled capital, matching funds, and protocol reserves  
- Routes funding to the correct bond/project  
- Supports multi-contract fund distribution

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/impactbond-protocol.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract is modular but interconnected. A new impact project starts at the ImpactBondFactory, progresses through staking, verification, and outcome-based payout. Refer to each contract’s documentation for interaction details.

**Example workflows:**

- NGO → Deploys via factory → Receives funds → Outcome verified → Receives payout
- Donor → Contributes → Receives stake token → Gets impact token after success

## Testing

Smart contract tests are written in Clarity and use Clarinet’s testing framework:
```bash
npm test
```

**Mock tests include edge cases like:**

- Failed verifications
- Verifier misbehavior
- Partial project success

## License

MIT License