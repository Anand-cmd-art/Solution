// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@opengsn/contracts/src/BasePaymaster.sol";
import "@opengsn/contracts/src/interfaces/IRelayHub.sol";
import "@opengsn/contracts/src/utils/GsnTypes.sol";
abstract contract RiderLedgerPaymaster is BasePaymaster {
    address public immutable riderLedger;
    address public immutable extendedLedger;
    constructor(
        address relayHub,
        address _riderLedger,
        address _extendedLedger
    ) {
        // Tell the paymaster which RelayHub to use
        setRelayHub(IRelayHub(relayHub));
        riderLedger   = _riderLedger;
        extendedLedger = _extendedLedger;
    }
    /// @notice Every BasePaymaster must expose a version string
    function versionPaymaster() external pure returns (string memory) {
        return "RiderLedgerPaymaster_v1";
    }
    /**
     * @notice Called *before* the relayed call. We check here that the
     * `to` address is one of our two ledger contracts.
     */
    function _preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata           ,  // signature
        bytes calldata           ,  // approvalData
        uint256                  )  // maxPossibleGas
        internal
        view
        returns (bytes memory context, bool rejectOnRecipientRevert)
    {
        address to = relayRequest.request.to;
        require(
            to == riderLedger || to == extendedLedger,
            "Paymaster: target not whitelisted"
        );
        return ("", false);
    }
    /**
     * @notice Nothing to do after the call—must still be implemented.
     */
    function _postRelayedCall(
        bytes calldata         ,  // context
        bool                  ,  // success
        uint256               ,  // gasUseWithoutPost
        GsnTypes.RelayData calldata  // relayData
    ) internal{
        // no-op
    }
    /// @dev Auto-forward any MATIC sent here into your RelayHub balance
    receive() external payable override {
        IRelayHub hub = IRelayHub(relayHub);
        hub.depositFor{ value: msg.value }(address(this));
    }
}