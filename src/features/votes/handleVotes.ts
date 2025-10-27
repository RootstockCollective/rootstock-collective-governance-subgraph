import {
  VoteCast as VoteCastEvent,
  VoteCastWithParams as VoteCastWithParamsEvent, VotingDelaySet as VotingDelaySetEvent,
  VotingPeriodSet as VotingPeriodSetEvent
} from "../../../generated/GovernorRootstockCollective/GovernorRootstockCollective";
import {Proposal, VoteCast, VoteCastWithParams, VotingDelaySet, VotingPeriodSet} from "../../../generated/schema";
import {getOrCreateAccount, getProposalStateName, ProposalState} from "../../utils/helpers";
import {BigInt} from "@graphprotocol/graph-ts";

export function handleVoteCast(event: VoteCastEvent): void {
  let entity = new VoteCast(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  let account = getOrCreateAccount(event.params.voter);
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