import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import deploy from './deploy'
import Escrow from './Escrow'
import axios from 'axios'

const provider = new ethers.providers.Web3Provider(window.ethereum)

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve()
  await approveTxn.wait()
}

function App() {
  const [escrows, setEscrows] = useState([])
  const [account, setAccount] = useState()
  const [signer, setSigner] = useState()

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', [])

      setAccount(accounts[0])
      setSigner(provider.getSigner())
    }

    getAccounts()
  }, [account])

  useEffect(() => {
    async function getExistingContracts() {
      try {
        const response = await axios.get('http://localhost:5000/')
        console.log(response.data) // This should contain the existing contracts
        setEscrows( response.data)
      } catch (error) {
        console.error('Error getting existing contracts:', error)
      }
    }

    getExistingContracts()
  }, [])

  async function pushContract(escrow) {
    try {
      const response = await axios.post(
        'http://localhost:5000/add-contract',
        escrow
      )
      console.log(response.data) // This should contain the updated contracts array
    } catch (error) {
      console.error('Error adding contract:', error)
    }
  }
  

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value
    const arbiter = document.getElementById('arbiter').value
    const value = ethers.utils.parseEther(document.getElementById('Eth').value)
    const escrowContract = await deploy(signer, arbiter, beneficiary, value)

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className = 'complete'
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!"
        })

        await approve(escrowContract, signer)
      },
    }

    setEscrows([...escrows, escrow])
    // update the database with the new contract
    pushContract(escrow)
  }
console.log(escrows)
  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="Eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault()

            newContract()
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />
          })}
        </div>
      </div>
    </>
  )
}

export default App
