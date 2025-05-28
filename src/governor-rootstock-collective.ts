import {
  EIP712DomainChanged as EIP712DomainChangedEvent,
  GovernorRootstockCollective as GovernorContract,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalQueued as ProposalQueuedEvent,
  ProposalThresholdSet as ProposalThresholdSetEvent,
  QuorumNumeratorUpdated as QuorumNumeratorUpdatedEvent,
  TimelockChange as TimelockChangeEvent,
  Upgraded as UpgradedEvent,
  VoteCast as VoteCastEvent,
  VoteCastWithParams as VoteCastWithParamsEvent,
  VotingDelaySet as VotingDelaySetEvent,
  VotingPeriodSet as VotingPeriodSetEvent,
} from "../generated/GovernorRootstockCollective/GovernorRootstockCollective"
import {
  Account,
  EIP712DomainChanged,
  Initialized,
  OwnershipTransferred,
  Proposal,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  ProposalThresholdSet,
  QuorumNumeratorUpdated,
  TimelockChange,
  Upgraded,
  VoteCast,
  VoteCastWithParams,
  VotingDelaySet,
  VotingPeriodSet,
} from "../generated/schema"
import {BigInt, Bytes} from "@graphprotocol/graph-ts"
import {createEventID, getProposalStateName, incrementCounter, ProposalState} from "./utils/helpers"
import {Transfer} from "../generated/GovernorRootstockCollective/GovernorToken";

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent,
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
  let proposal = Proposal.load(event.params.proposalId.toHexString())!;
  proposal.state = getProposalStateName(ProposalState.Canceled);
  proposal.rawState = ProposalState.Canceled;
  let entity = new ProposalCanceled(createEventID(event))
  entity.proposal = proposal.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalCreated(event: ProposalCreatedEvent): void {
  let entity = new Proposal(event.params.proposalId.toHexString())

  let account = new Account(event.params.proposer.toHexString());
  account.save();

  entity.proposalId = event.params.proposalId
  entity.proposer = account.id
  entity.targets = changetype<Bytes[]>(event.params.targets)
  entity.values = event.params.values
  entity.signatures = event.params.signatures
  entity.calldatas = event.params.calldatas
  entity.voteStart = event.params.voteStart
  entity.voteEnd = event.params.voteEnd
  entity.description = event.params.description
  entity.createdAt = event.block.timestamp
  entity.createdAtBlock = event.block.number

  entity.votesFor = BigInt.fromI32(0)
  entity.votesAgainst = BigInt.fromI32(0)
  entity.votesAbstains = BigInt.fromI32(0)
  entity.votesTotal = BigInt.fromI32(0)
  entity.state = getProposalStateName(ProposalState.Pending);
  entity.rawState = ProposalState.Pending;


  let contract = GovernorContract.bind(event.address)
  entity.quorum = contract.quorum(event.block.number.minus(BigInt.fromI32(1)))
  entity.save()

  let proposalEvent = new ProposalCreated(createEventID(event));
  proposalEvent.proposal = entity.id;
  proposalEvent.blockNumber = event.block.number
  proposalEvent.blockTimestamp = event.block.timestamp
  proposalEvent.transactionHash = event.transaction.hash
  
  proposalEvent.save();
  incrementCounter("proposals");

}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let proposal = Proposal.load(event.params.proposalId.toHexString())!;
  proposal.state = getProposalStateName(ProposalState.Executed);
  proposal.rawState = ProposalState.Executed;
  proposal.save();

  let entity = new ProposalExecuted(createEventID(event))
  entity.proposal = proposal.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
  let proposal = Proposal.load(event.params.proposalId.toHexString())!;
  proposal.state = getProposalStateName(ProposalState.Queued);
  proposal.rawState = ProposalState.Queued;
  proposal.save();

  let entity = new ProposalQueued(createEventID(event))
  entity.proposal = proposal.id
  entity.etaSeconds = event.params.etaSeconds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProposalThresholdSet(
  event: ProposalThresholdSetEvent,
): void {
  let entity = new ProposalThresholdSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldProposalThreshold = event.params.oldProposalThreshold
  entity.newProposalThreshold = event.params.newProposalThreshold

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuorumNumeratorUpdated(
  event: QuorumNumeratorUpdatedEvent,
): void {
  let entity = new QuorumNumeratorUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldQuorumNumerator = event.params.oldQuorumNumerator
  entity.newQuorumNumerator = event.params.newQuorumNumerator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTimelockChange(event: TimelockChangeEvent): void {
  let entity = new TimelockChange(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldTimelock = event.params.oldTimelock
  entity.newTimelock = event.params.newTimelock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  
  let account = new Account(event.params.voter.toHexString());
  account.save();

  let proposal = Proposal.load(event.params.proposalId.toHexString())!;

  entity.voter = account.id;
  entity.proposal = proposal.id
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // 0 = against, 1 = forVotes, 2 = abstain  
  if (event.params.support == 1) {      
    proposal.votesFor = proposal.votesFor.plus(entity.weight)
  }
  else if (event.params.support == 0) {
    proposal.votesAgainst = proposal.votesAgainst.plus(entity.weight)
  } else {      
    proposal.votesAbstains = proposal.votesAbstains.plus(entity.weight)
  }
  proposal.votesTotal = proposal.votesTotal.plus(BigInt.fromI32(1));
  proposal.state = getProposalStateName(ProposalState.Active);
  proposal.rawState = ProposalState.Active;
  proposal.save();  
}

export function handleVoteCastWithParams(event: VoteCastWithParamsEvent): void {
  let entity = new VoteCastWithParams(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voter = event.params.voter
  entity.proposalId = event.params.proposalId
  entity.support = event.params.support
  entity.weight = event.params.weight
  entity.reason = event.params.reason
  entity.params = event.params.params

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVotingDelaySet(event: VotingDelaySetEvent): void {
  let entity = new VotingDelaySet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldVotingDelay = event.params.oldVotingDelay
  entity.newVotingDelay = event.params.newVotingDelay

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVotingPeriodSet(event: VotingPeriodSetEvent): void {
  let entity = new VotingPeriodSet(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldVotingPeriod = event.params.oldVotingPeriod
  entity.newVotingPeriod = event.params.newVotingPeriod

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferEvent(event: Transfer): void {

}