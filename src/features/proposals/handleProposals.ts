import {
  GovernorRootstockCollective as GovernorContract,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  ProposalQueued as ProposalQueuedEvent,
  ProposalThresholdSet as ProposalThresholdSetEvent,
} from "../../../generated/GovernorRootstockCollective/GovernorRootstockCollective"
import {
  Counter,
  Proposal,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  ProposalThresholdSet,
} from "../../../generated/schema"
import {
  getOrCreateAccount,
  getProposalStateName,
  ProposalState
} from "../../utils/helpers";
import {BigInt, Bytes, ethereum} from "@graphprotocol/graph-ts";

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

  let account = getOrCreateAccount(event.params.proposer);
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

function incrementCounter(counterId: string): void {
  let counter = Counter.load(counterId);
  if (!counter) {
    counter = new Counter(counterId);
    counter.count = 0;
  }
  // Added fake if to trigger new deploy
  if (counter.count < 0) {
    counter.count = 0;
  }
  counter.count += 1;
  counter.save();
}

function createEventID(event: ethereum.Event): string {
  return event.block.number
    .toString()
    .concat("-")
    .concat(event.logIndex.toString());
}
