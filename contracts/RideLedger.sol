// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";




contract RiderLedger is ERC2771Context {
    struct Ride {
        bytes32  rideHash;           // keccak256 of off‐chain ride JSON,
        uint256  fare;               // fare in wei
        address  rider;
        address  driver;
        bool     disputed;
        bytes32  riderName;
        bytes32  driverName;
        uint256  numberPlate;
        uint256  riderPhoneNumber;
        uint256  driverPhoneNumber;
    }

    mapping(uint256 => Ride) public rides;
    uint256 public nextRideId;
    address public admin;

    event RideLogged( 
        uint256 indexed rideId,
        bytes32    rideHash,
        uint256    fare,
        address    indexed rider,
        address    indexed driver,
        bytes32    riderName,
        bytes32    driverName,
        uint256    numberPlate,
        uint256    riderPhoneNumber,
        uint256    driverPhoneNumber
    ); // This is Recrod all the events for the ride log 

    event RideDisputed(uint256 indexed rideId, address indexed by); // This is to record the Disputed rides 

    constructor(address forwarder) ERC2771Context(forwarder) {  // the fordwarder is the address of the GSN relay server and passed to the ERC2771Context constructor
       // sets the admin to the address that deployed the contract
        admin = _msgSender();
    }

    modifier onlyAdmin() {
        require(_msgSender() == admin, "RiderLedger: caller is not admin");
        _;
    }

    
    function logRide(
        bytes32 _rideHash,
        uint256 _fare,
        address _rider,
        address _driver,
        bytes32 _riderName,
        bytes32 _driverName,
        uint256 _numberPlate,
        uint256 _riderPhoneNumber,
        uint256 _driverPhoneNumber
    ) external onlyAdmin returns (uint256) {
        uint256 rideId = nextRideId++;
        rides[rideId] = Ride({
            rideHash: _rideHash,
            fare: _fare,
            rider: _rider,
            driver: _driver,
            disputed: false,
            riderName: _riderName,
            driverName: _driverName,
            numberPlate: _numberPlate,
            riderPhoneNumber: _riderPhoneNumber,
            driverPhoneNumber: _driverPhoneNumber
        });

        

        emit RideLogged(
            rideId,
            _rideHash,
            _fare,
            _rider,
            _driver,
            _riderName,
            _driverName,
            _numberPlate,
            _riderPhoneNumber,
            _driverPhoneNumber
        );

        return rideId;
    } // this Function is used to log the rides, i.e. onlyAdmin can access this function and log the rides

    function disputeRide(uint256 rideId) external {
        Ride storage r = rides[rideId];
        address sender = _msgSender();
        require(
            sender == r.rider || sender == r.driver,
            "RiderLedger: not participant"
        );
        require(!r.disputed, "RiderLedger: already disputed");
        r.disputed = true;
        emit RideDisputed(rideId, sender);
    }

    // ===== GSN meta‐tx plumbing =====
    function _msgSender()
        internal
        view
        override(ERC2771Context) 
        returns (address)
    {
        return ERC2771Context._msgSender();
    }// changes to override()

    function _msgData()
        internal
        view
        override (ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}


contract ExtendedRiderLedger is RiderLedger {
    struct FareSplit {
        uint96 riderPaid;    // how much rider paid (wei)
        uint96 driverShare;  // how much goes to driver (wei)
        uint96 platformFee;  // how much the platform takes (wei)
    }

    mapping(uint256 => FareSplit) public splits;
    address public backend;  // your off-chain server  

    event RideSplitLogged(
        uint256 indexed rideId,
        bytes32    rideHash,
        address    indexed rider,
        address    indexed driver,
        uint96     riderPaid,
        uint96     driverShare,
        uint96     platformFee
    );
    event DisputedSplit(uint256 indexed rideId, address indexed by);

    constructor(address forwarder, address _backend)
        RiderLedger(forwarder)
    {
        backend = _backend;
    }

    modifier onlyBackend() {
        require(_msgSender() == backend, "Extended: caller is not backend");
        _;
    }

    /// @notice Log a ride AND its detailed fare split (meta-tx).
    function logRide(
        bytes32 rideHash,
        address rider,
        address driver,
        uint96  riderPaid,
        uint96  driverShare,
        uint96  platformFee
    ) external onlyBackend returns (uint256) {
        uint256 id = nextRideId++;
        // total fare is the sum of the split parts
        uint256 totalFare = uint256(riderPaid) + driverShare + platformFee;

        rides[id] = Ride({
            rideHash:          rideHash,
            fare:              totalFare,
            rider:             rider,
            driver:            driver,
            disputed:          false,
            riderName:         bytes32(0),
            driverName:        bytes32(0),
            numberPlate:       0,
            riderPhoneNumber:  0,
            driverPhoneNumber: 0
        });

        splits[id] = FareSplit(riderPaid, driverShare, platformFee);

        emit RideSplitLogged(
            id,
            rideHash,
            rider,
            driver,
            riderPaid,
            driverShare,
            platformFee
        );

        return id;
    }

    /// @notice Dispute via the split‐logic pathway.
    function dispute(uint256 id) external {
        Ride storage r = rides[id];
        address sender = _msgSender();
        require(
            sender == r.rider || sender == r.driver,
            "Extended: not participant"
        );
        require(!r.disputed, "Extended: already disputed");
        r.disputed = true;
        emit DisputedSplit(id, sender);
    }

    // Inherits the same _msgSender/_msgData overrides from RiderLedger
}
