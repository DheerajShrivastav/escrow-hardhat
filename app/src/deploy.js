import { ethers } from 'ethers'
import Escrow from './artifacts/contracts/Escrow.sol/Escrow.json' // Changed the import

export default async function deploy(signer, arbiter, beneficiary, value) {
  // The imported Escrow object should contain both 'abi' and 'bytecode' properties
  const contract = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  )
  const deployedContract = await contract.deploy(arbiter, beneficiary, {
    value,
  })

  await deployedContract.deployed() // Wait for the contract to be deployed

  return deployedContract
}
