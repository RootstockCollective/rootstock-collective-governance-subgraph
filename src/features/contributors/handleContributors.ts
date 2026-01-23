import { Transfer } from "../../../generated/OGContributorsRootstockCollective/OGContributorsRootstockCollective";
import { Address } from "@graphprotocol/graph-ts";
import { getOrCreateAccount } from "../../utils/helpers";
import { Contributor } from "../../../generated/schema";

const ZERO_ADDRESS = Address.zero()

export function handleNFTTransfer(event: Transfer): void {
  if (event.params.to.equals(ZERO_ADDRESS)) {
    let fromAcc = getOrCreateAccount(event.params.from)
    let contributor = Contributor.load(fromAcc.id)
    if (contributor != null) {
      contributor.nftId = null
      contributor.save()
    }
    return
  }

  let toAcc = getOrCreateAccount(event.params.to)
  let contributor = Contributor.load(toAcc.id)
  if (contributor == null) {
    contributor = new Contributor(toAcc.id)
    contributor.account = toAcc.id
  }

  contributor.nftId = event.params.tokenId
  contributor.createdAt = event.block.timestamp
  contributor.createdAtBlock = event.block.number
  contributor.save()
}