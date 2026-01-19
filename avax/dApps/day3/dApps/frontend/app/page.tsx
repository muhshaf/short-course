'use client';

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

// ==============================
// CONFIG
// ==============================

const CONTRACT_ADDRESS =
  '0xa626eb2664deee86156cb6907a7eac6fcd4f5e29';

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default function Page() {
  // ==============================
  // WALLET
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // ==============================
  // LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);

  // ==============================
  // PREVENT HYDRATION ERROR
  // ==============================
  useEffect(() => {
    setMounted(true);
  }, []);

  // ==============================
  // READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // WRITE CONTRACT
  // ==============================
  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = () => {
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // UTIL
  // ==============================
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!mounted) return null;

  // ==============================
  // UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container">

        <h1>❄️ Avalanche dApp</h1>
        <p className="subtitle">Connect Wallet (Core Wallet)</p>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        )}

        {/* ==========================
            WALLET INFO
        ========================== */}
        <div className="card">
          <p>
            <strong>Status:</strong>{' '}
            {isConnected ? 'Connected ✅' : 'Not Connected'}
          </p>

          <p><strong>Wallet Address:</strong></p>
          <p className="address">
            {isConnected && address
              ? shortenAddress(address)
              : '-'}
          </p>

          <p><strong>Nama:</strong> Dharma Fathahillah</p>
          <p><strong>NIM:</strong> 231011401770</p>
        </div>

        {/* ==========================
            READ CONTRACT
        ========================== */}
        <div className="card" style={{ marginTop: '16px' }}>
          <p><strong>Contract Value (Read)</strong></p>

          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {isReading ? 'Loading...' : value?.toString() ?? '0'}
          </p>

          <button
            onClick={() => refetch()}
            style={{ background: '#555' }}
          >
            Refresh Value
          </button>
        </div>

        {/* ==========================
            WRITE CONTRACT
        ========================== */}
        <div className="card" style={{ marginTop: '16px' }}>
          <p><strong>Update Contract Value</strong></p>

          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '8px',
            }}
          />

          <button
            onClick={handleSetValue}
            disabled={isWriting || !isConnected}
          >
            {isWriting ? 'Updating...' : 'Set Value'}
          </button>
        </div>

      </div>
    </main>
  );
}
