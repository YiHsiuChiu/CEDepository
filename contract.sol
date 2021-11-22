pragma solidity >=0.7.0 <0.9.0;

contract CERepository {

    string _carID;
    string _criticalData;

    function writeID(string memory input) public {
        _carID = input;
    }

    function readID() public view returns (string memory){
        return _carID;
    }

    function writeData(string memory input) public {
        _criticalData = input;
    }

    function readData() public view returns (string memory){
        return _criticalData;
    }
}