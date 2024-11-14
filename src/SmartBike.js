import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Button, Form, Input, Label, Col, Container, Row, Card, Alert } from 'reactstrap';

const SmartBike = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [bikes, setBikes] = useState([]);
  const [newBike, setNewBike] = useState({ id: '', name: '', isAvailable: true });
  const [bikeId, setBikeId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const contractAddress = '0xa28c9Af94Eff428e9190ba766830dFc461a29a30'; // Replace with your contract's deployed address
  const contractABI = [
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "newCID",
          "type": "string"
        }
      ],
      "name": "BikesDataUpdated",
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
      "name": "bikesDataCID",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
          "internalType": "string",
          "name": "_newCID",
          "type": "string"
        }
      ],
      "name": "setBikesDataCID",
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
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
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
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
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
      "name": "getBikeStatus",
      "outputs": [
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
      "name": "getTotalBikes",
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
    }
  ]; // Replace with your contract ABI

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

  const getBikeStatus = async (id) => {
    try {
      const status = await contract.methods.getBikeStatus(id).call();
      setBikes([...bikes, { id, name: status[0], isAvailable: status[1] }]);
      setMessage(`Bike ${id} Status: ${status[1] ? 'Available' : 'Not Available'}`);
    } catch (err) {
      setError('Error fetching bike status');
    }
  };

  const addBike = async () => {
    if (!newBike.id || !newBike.name) {
      alert('Please provide all bike details');
      return;
    }
    try {
      await contract.methods.addBike(newBike.id, newBike.name, newBike.isAvailable).send({ from: account });
      setMessage(`Bike ${newBike.name} added successfully!`);
    } catch (err) {
      setError('Error adding bike');
    }
  };

  const rentBike = async (id) => {
    try {
      await contract.methods.rentBike(id).send({ from: account });
      setMessage(`Bike ${id} rented successfully!`);
    } catch (err) {
      setError('Error renting bike');
    }
  };

  const returnBike = async (id) => {
    try {
      await contract.methods.returnBike(id).send({ from: account });
      setMessage(`Bike ${id} returned successfully!`);
    } catch (err) {
      setError('Error returning bike');
    }
  };

  const getTotalBikes = async () => {
    try {
      const total = await contract.methods.getTotalBikes().call();
      setMessage(`Total bikes: ${total}`);
    } catch (err) {
      setError('Error fetching total bikes');
    }
  };

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

      <Row className="mb-4">
        <Col md="4">
          {/* Add Bike Form */}
          <Card body>
            <h4>Add a Bike</h4>
            <Form onSubmit={(e) => { e.preventDefault(); addBike(); }}>
              <Label for="bikeId">Bike ID</Label>
              <Input
                type="text"
                id="bikeId"
                value={newBike.id}
                onChange={(e) => setNewBike({ ...newBike, id: e.target.value })}
                placeholder="Enter Bike ID"
              />
              <Label for="bikeName">Bike Name</Label>
              <Input
                type="text"
                id="bikeName"
                value={newBike.name}
                onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
                placeholder="Enter Bike Name"
              />
              <Label for="isAvailable">Availability</Label>
              <Input
                type="checkbox"
                id="isAvailable"
                checked={newBike.isAvailable}
                onChange={(e) => setNewBike({ ...newBike, isAvailable: e.target.checked })}
              />
              <Button color="primary" className="mt-3">Add Bike</Button>
            </Form>
          </Card>
        </Col>

        <Col md="4">
          {/* Rent Bike Form */}
          <Card body>
            <h4>Rent a Bike</h4>
            <Form onSubmit={(e) => { e.preventDefault(); rentBike(bikeId); }}>
              <Label for="bikeToRent">Bike ID</Label>
              <Input
                type="text"
                id="bikeToRent"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                placeholder="Enter Bike ID"
              />
              <Button color="success" className="mt-3">Rent Bike</Button>
            </Form>
          </Card>
        </Col>

        <Col md="4">
          {/* Return Bike Form */}
          <Card body>
            <h4>Return a Bike</h4>
            <Form onSubmit={(e) => { e.preventDefault(); returnBike(bikeId); }}>
              <Label for="bikeToReturn">Bike ID</Label>
              <Input
                type="text"
                id="bikeToReturn"
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                placeholder="Enter Bike ID"
              />
              <Button color="danger" className="mt-3">Return Bike</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Get Total Bikes */}
      <Row className="mb-4">
        <Col md="12">
          <Button color="info" onClick={getTotalBikes}>Get Total Bikes</Button>
        </Col>
      </Row>

      {/* Get Bike Status */}
      <Row className="mb-4">
        <Col md="12">
          <Button color="primary" onClick={() => getBikeStatus(1)}>Get Bike 1 Status</Button>
          <Button color="primary" onClick={() => getBikeStatus(2)}>Get Bike 2 Status</Button>
          <Button color="primary" onClick={() => getBikeStatus(3)}>Get Bike 3 Status</Button>
        </Col>
      </Row>

      {/* Display Bike Statuses */}
      <Row>
        {bikes.map((bike) => (
          <Col md="4" key={bike.id}>
            <Card body>
              <h5>{bike.name}</h5>
              <p>Status: {bike.isAvailable ? 'Available' : 'Not Available'}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SmartBike;
