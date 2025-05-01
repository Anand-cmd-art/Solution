// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/interfaces/IRelayHub.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";

// this is done becuse the GsnTypes.UserOperation struct is not imported from the GSN library
// If not, define it here as per the GSN documentation
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGas;
    uint256 verificationGas;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

enum PostOpMode {
    opReverted,
    opSucceeded,
    postOpReverted
}



contract RiderLedgerPaymaster is BasePaymaster {
    // the two contracts this Paymaster will sponsor
    address public immutable riderLedger;
    address public immutable extendedLedger;

    constructor(
        address relayHub,
        address _riderLedger,
        address _extendedLedger
    ) {
        // point to the GSN RelayHub on zkEVM
        setRelayHub(IRelayHub(relayHub));

        riderLedger   = _riderLedger;
        extendedLedger = _extendedLedger;
    }

    /// @inheritdoc BasePaymaster
    function _validatePaymasterUserOp(
        UserOperation calldata op,
        bytes32,           
        uint256            
    )
        internal
        view
        override
        returns (bytes memory context, uint256 validity)
    {
        // only sponsor calls whose target is one of our two ledger contracts
        address to = op.to;
        require(
            to == riderLedger || to == extendedLedger,
            "Paymaster: target not whitelisted"
        );

        return ("", 3600);
    }

    /// @inheritdoc BasePaymaster
    function _postOp(
        bytes calldata, 
        GsnTypes.PostOpMode, 
        uint256, 
        bytes calldata
    ) internal override {
        // no post-op accounting needed
    }

    /// @notice allow funding the Paymaster with native MATIC
    receive() external payable {}
}
