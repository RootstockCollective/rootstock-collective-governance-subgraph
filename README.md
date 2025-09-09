# Rootstock Collective Governance Subgraph

This subgraph indexes and organizes on-chain data for the **RootstockCollective DAO**, enabling efficient and structured access to critical DAO activity and governance data via **The Graph protocol**.  
It tracks proposals, votes, accounts, and lifecycle events, giving developers and DAO participants real-time insight into governance processes.

---

## Deployments

| Env Key                   | Deployment ID                                  | Environment | URL                                                                 |
|---------------------------|------------------------------------------------|-------------|---------------------------------------------------------------------|
| dev                       | QmZjtZXwUHjVw9pFbdDXZ7kDp3G8yY6fr7gNT6h8ZrcPki | Testnet     | https://thegraph.com/explorer/subgraphs/59ZBJoCuAmm6Y9Dh6hwJ4saaTri9czMkLMPaYvVDtSvo?view=About&chain=arbitrum-one |
| testnet                   | QmZjtZXwUHjVw9pFbdDXZ7kDp3G8yY6fr7gNT6h8ZrcPki | Testnet     | https://thegraph.com/explorer/subgraphs/52kAgmfknug5r2hGUoBD43V4mw7wfcsmwhUdekb9k85r?view=Query&chain=arbitrum-one |
| dao-qa                    | QmZjtZXwUHjVw9pFbdDXZ7kDp3G8yY6fr7gNT6h8ZrcPki | Testnet     | https://thegraph.com/explorer/subgraphs/3rDsXPBQ3jQriDbPu32UMtH8u4H9AQC4m9moGBe1y85r?view=Query&chain=arbitrum-one |
| release-candidate-testnet | QmQ3awLb8QCX2yj9KHQbo8Ke2nvhRgjjrd3N4jAjP7ACwK | Testnet     |https://thegraph.com/explorer/subgraphs/3qtTe471XUnApRatw2ayUw8obg6M3U9a5L37hRqyJPRB?view=Query&chain=arbitrum-one|
| release-candidate-mainnet | QmNph49E6kx53GfD5yVbX7Emq8SNfp5fdhQG1v9TTeqL3v | Mainnet     |https://thegraph.com/explorer/subgraphs/4N2Bz9wghp1pu1TrUup1ymSTFa6k1zHk9JLJ4F3Dup1H?view=Query&chain=arbitrum-one|
| mainnet                   | QmNph49E6kx53GfD5yVbX7Emq8SNfp5fdhQG1v9TTeqL3v | Mainnet     |https://thegraph.com/explorer/subgraphs/C9muK2hesS2V8ZpcR755wVfo9UUhfWSXaDhDKMkCNejP?view=Query&chain=arbitrum-one|

---

## 1. **Overview**

- **What is this subgraph?**
    - This subgraph indexes and organizes on-chain data for the RootstockCollective DAO, enabling efficient and structured access to critical DAO activity and governance data via The Graph protocol.
- **Purpose & Scope**
    - The primary purpose of this subgraph is to provide real-time, queryable access to data related to:
        - Governance proposals and voting outcomes
        - DAO token holders and delegations

## 2. Quick Start

### Install Dependencies

Ensure you have the following installed:
- **Node.js** (v22+ recommended)
- **npm**

Install project dependencies:
```bash
npm install
```

### Prepare Environment

Before generating types, you need to prepare the environment:
```bash
npm run prepare:<env>
```

Replace <env> with the env key (see [Deployments](#deployments) section for available options).
### Generate Types
```bash
npm run codegen
```

### Build the Subgraph
```bash
npm run build
```


This will compile the subgraph and get it ready for deployment.

## 3. Deployment

To deploy your subgraph to The Graph, you first need to authenticate:

```bash
graph auth <auth-key>
```

Where <auth-key> is your key provided by The Graph.

Then deploy the subgraph:

```bash
graph deploy:<env>
```
Replace <env> with the env key (see [Deployments](#deployments) section for available options).


## 4. **Subgraph Structure**

### 📁 Directory Layout

```
.
├── abis/                   # ABI files for smart contracts
├── mappings/               # TypeScript handlers for processing events
├── schema.graphql          # GraphQL schema defining indexed entities
├── subgraph.template.yaml  # Template manifest file defining the subgraph config
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── generated/              # Auto-generated types (after codegen)

```

- **Key Files Explained** (e.g., `schema.graphql`, `subgraph.yaml`, `mapping.ts`)

  ### `subgraph.template.yaml`

    - The template **manifest** file that tells The Graph:
        - Which network the subgraph is for
        - Which contracts to listen to
        - From which block to start
        - Which events should trigger handlers
        - Any dynamic templates in use

  ### `schema.graphql`

    - Defines the **data model** for your subgraph.
    - Entities (e.g., `Proposal`, `VoteCast`) are stored and queried from The Graph node.
    - Fields define the shape of the data and relationships between entities.

  ### `mappings/`

    - Contains the **event handler functions** (written in AssemblyScript, a TypeScript subset).
    - Each function maps incoming blockchain events to entity updates.

  ### `abis/`

    - Contains the **contract ABI JSON files**.
    - Required for decoding on-chain event and function data in mappings.

  ### `generated/`

    - Contains **generated TypeScript types** for entities and contract bindings.
    - Auto-generated using `graph codegen` based on your schema and ABIs.
    - **Codebase Conventions** (naming, modularity, etc.)

## 5. **Query Examples**

### Proposals
- **List Proposals**

```graphql
{
  proposals(orderDirection: desc, orderBy: createdAt) {
    id
    proposalId
    proposer {
      id
    }
    targets
    description
    votesFor
    votesAgainst
    votesAbstains
    voteEnd
    voteStart
    quorum
    createdAt
    createdAtBlock
    description
    signatures
    values
    calldatas
    state
    rawState
  },
  counters {
    id
    count
  }
}
```

- **Pagination**

```graphql
{
  proposals(first:100, skip:100, orderDirection: desc, orderBy: createdAt) {
    id
    proposalId
    proposer {
      id
    }
    targets
    description
    votesFor
    votesAgainst
    votesAbstains
    voteEnd
    voteStart
    quorum
    createdAt
    createdAtBlock
    description
    signatures
    values
    calldatas
    state
    rawState
  },
  counters {
    id
    count
  }
}
```

Get the newest proposals

```graphql
{
  proposals(first: 5, orderDirection: desc, orderBy: createdAt) {
    proposalId
    proposer {
      id
    }
    targets
    state
    voteEnd
    voteStart
    values
    votesAbstains
    votesAgainst
    votesFor
    description
    createdAt
    events {
      ... on ProposalCanceled {
        id
      }
      ... on ProposalCreated {
        id
      }
      ... on ProposalExecuted {
        id
        transactionHash
      }
      ... on ProposalQueued {
        id
      }
    }
  }
}
```

Get the executed proposals

```graphql
{
  proposals(
    first: 5
    orderDirection: desc
    orderBy: createdAt
    where: {state: Executed}
  ) {
    proposalId
    proposer {
      id
    }
    targets
    state
    voteEnd
    voteStart
    values
    votesAbstains
    votesAgainst
    votesFor
    description
    createdAt
    events {
      ... on ProposalCanceled {
        id
      }
      ... on ProposalCreated {
        id
      }
      ... on ProposalExecuted {
        id
        transactionHash
      }
      ... on ProposalQueued {
        id
      }
    }
  }
}
```

Retrieve the most voted proposal

```graphql
{
  proposals(orderDirection: desc, orderBy: votesFor, where: {}, first: 1) {
    proposalId
    proposer {
      id
    }
    targets
    state
    voteEnd
    voteStart
    values
    votesAbstains
    votesAgainst
    votesFor
    description
    createdAt
    events {
      ... on ProposalCanceled {
        id
      }
      ... on ProposalCreated {
        id
      }
      ... on ProposalExecuted {
        id
        transactionHash
      }
      ... on ProposalQueued {
        id
      }
    }
  }
}
```

Get the proposer of the proposal

```graphql
{
  proposals(first: 1, where: {proposalId: "PROPOSAL_ID"}) {
    proposalId
    description
    proposer {
      id
    }
  }
}
```

Get a list of all voters for a proposal
```graphql
{
  proposals(first: 1, where: {proposalId: "PROPOSAL_ID"}) {
    proposalId
    votes {
      voter {
        id
      }
    }
  }
}
```


### Proposers

Retrieve proposals by account (*Proposers*)

```graphql
{
  accounts(where: {Proposals_: {description_not: "null"}}) {
    id
    Proposals {
      proposalId
    }
  }
}
```

### Voters

Retrieve the votes by account

```graphql
{
  accounts {
    id
    VoteCasts {
      proposal {
        proposalId
      }
    }
  }
}
```

Counters will return the total of proposal under id `proposals`

### 6. **Known Issues / Limitations**

**Is there a limit to how many objects The Graph can return per query?**

By default, query responses are limited to 100 items per collection. If you want to receive more, you can go up to 1000 items per collection and beyond that, you can paginate with:

`*someCollection*(first: 1000, skip: <number>) { ... }`

**Mismatch in `state` Field Data?**

The `state` field in this subgraph does **not** reflect an on-chain stored value. Instead, proposal states such as `Active`, `Pending`, `Succeeded`, and `Defeated` are **dynamically calculated** by a smart contract function (commonly `state()` or `getProposalState()`), based on the current block number, voting timelines, and vote counts.

In the subgraph, we store the `state` field as a snapshot at the time of certain events (e.g., `ProposalCreated`, `VoteCast`, `ProposalExecuted`). Because the true state is **derived on-chain at runtime**, this can lead to mismatches in specific cases — particularly for intermediate, **time-sensitive states** like:

- `Pending`
- `Active`
- `Succeeded`
- `Defeated`

These states change automatically based on time or block progression and **are not emitted as on-chain events**, making it difficult for the subgraph to update them with perfect accuracy unless additional logic is implemented.

Other states such as `Executed`, `Canceled`, or `Vetoed` are **final** and are typically triggered by specific events, so they are easier to track accurately in the subgraph.