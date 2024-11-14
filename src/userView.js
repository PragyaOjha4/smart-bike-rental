import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Button, Input, Col, Container, Row, Card, Alert } from 'reactstrap';

const SmartBike = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [availableBikes, setAvailableBikes] = useState([]);
  const [bikeId, setBikeId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const contractAddress = '0x87aF3d2702165E85eD82032030c12295B3C46aa0';
  const contractABI =[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "int256",
          "name": "bikeId",
          "type": "int256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "renter",
          "type": "address"
        }
      ],
      "name": "BikeRented",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "int256",
          "name": "bikeId",
          "type": "int256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "renter",
          "type": "address"
        }
      ],
      "name": "BikeReturned",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "name": "bikes",
      "outputs": [
        {
          "internalType": "int256",
          "name": "id",
          "type": "int256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isAvailable",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalBikes",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "_id",
          "type": "int256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "_isAvailable",
          "type": "bool"
        }
      ],
      "name": "addBike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "_id",
          "type": "int256"
        }
      ],
      "name": "rentBike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "_id",
          "type": "int256"
        }
      ],
      "name": "returnBike",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAvailableBikes",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int256",
              "name": "id",
              "type": "int256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "isAvailable",
              "type": "bool"
            }
          ],
          "internalType": "struct SmartBike.Bike[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];  // Replace with your contract ABI 

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        setAccount(accounts[0]);
      });

      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      alert('Please install MetaMask!');
    }
  }, [contractABI]);

  const fetchAvailableBikes = async () => {
    try {
      const bikes = await contract.methods.getAvailableBikes().call();
      setAvailableBikes(bikes);
    } catch (err) {
      setError('Error fetching available bikes');
    }
  };

  const rentBike = async (id) => {
    try {
      await contract.methods.rentBike(id).send({ from: account });
      setMessage(`Bike ${id} rented successfully!`);
      fetchAvailableBikes();  // Refresh available bikes
    } catch (err) {
      setError('Error renting bike');
    }
  };

  const returnBike = async () => {
    try {
      await contract.methods.returnBike(bikeId).send({ from: account });
      setMessage(`Bike ${bikeId} returned successfully!`);
      setBikeId('');  // Reset input
      fetchAvailableBikes();  // Refresh available bikes
    } catch (err) {
      setError('Error returning bike');
    }
  };

  useEffect(() => {
    if (contract) fetchAvailableBikes();
  }, [contract]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md="12">
          <h1>Smart Bike Rental System</h1>
          <p>Connected Account: {account}</p>
        </Col>
      </Row>

      {/* Alert Messages */}
      {message && <Alert color="success">{message}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}

      <Row>
        <Col md="12">
          <h4>Available Bikes</h4>
          <Row>
            {availableBikes.map((bike) => (
              <Col md="4" key={bike.id} className="mb-3">
                <Card body className="text-center">
                  <h3>🚲</h3>
                  <h5>{bike.name}</h5>
                  <p>ID: {bike.id}</p>
                  <Button color="success" onClick={() => rentBike(bike.id)}>
                    Rent Bike
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md="12">
          <h4>Return a Bike</h4>
          <Input
            type="text"
            value={bikeId}
            onChange={(e) => setBikeId(e.target.value)}
            placeholder="Enter Bike ID to Return"
          />
          <Button color="danger" className="mt-2" onClick={returnBike}>
            Return Bike
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SmartBike;
