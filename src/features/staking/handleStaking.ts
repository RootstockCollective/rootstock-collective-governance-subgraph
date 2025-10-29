import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Transfer, StRIFToken } from "../../../generated/StRIFToken/StRIFToken"
import { getOrCreateAccount } from "../../utils/helpers"
import { StakingHistory } from "../../../generated/schema"

// Zero address constant for mint/burn detection
const ZERO_ADDRESS = Address.zero()

/**
 * Handles Transfer events from StRIFToken contract
 * Tracks staking (mint from 0x0) and unstaking (burn to 0x0) operations
 */
export function handleTransfer(event: Transfer): void {
  const from = event.params.from
  const to = event.params.to
  const value = event.params.value

  // Determine if this is a stake or unstake operation
  let actionType: string | null = null
  let userAddress: Address | null = null

  if (from.equals(ZERO_ADDRESS)) {
    // Mint operation = STAKE
    actionType = "STAKE"
    userAddress = to
  } else if (to.equals(ZERO_ADDRESS)) {
    // Burn operation = UNSTAKE
    actionType = "UNSTAKE"
    userAddress = from
  } else {
    // Regular transfer between users - ignore
    return
  }

  // Get or create the user account
  const account = getOrCreateAccount(userAddress)

  // Create unique ID from transaction hash and log index
  const id = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString())

  // Create new StakingHistory entity
  const stakingHistory = new StakingHistory(id)
  stakingHistory.user = account.id
  stakingHistory.action = actionType
  stakingHistory.amount = value
  stakingHistory.timestamp = event.block.timestamp
  stakingHistory.blockNumber = event.block.number
  stakingHistory.transactionHash = event.transaction.hash

  // Get current balance from contract
  const contract = StRIFToken.bind(event.address)
  const balanceResult = contract.try_balanceOf(userAddress)

  if (balanceResult.reverted) {
    // If balance call fails, use 0 as fallback
    stakingHistory.balance = BigInt.fromI32(0)
  } else {
    stakingHistory.balance = balanceResult.value
  }

  // Save the entity
  stakingHistory.save()
}
