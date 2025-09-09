import {getOrCreateAccount} from "./utils/helpers";
import {DelegateChanged, DelegateVotesChanged} from "../generated/StRIFToken/StRIFToken";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export function handleDelegateChanged(event: DelegateChanged): void {
  let delegator = getOrCreateAccount(event.params.delegator)
  let toDelegate = event.params.toDelegate.toHexString()

  // Update delegator's delegate reference
  if (toDelegate != ZERO_ADDRESS) {
    let toAcc = getOrCreateAccount(event.params.toDelegate)
    delegator.delegate = toAcc.id
  } else {
    delegator.delegate = null
  }

  delegator.save()
}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {
  let delegate = getOrCreateAccount(event.params.delegate)
  delegate.delegatedVotes = event.params.newVotes
  delegate.save()
}