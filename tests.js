const brain = require('brain.js')

const config = {
	binaryThresh: 0.5,
	hiddenLayers: [],
	activation: 'sigmoid'
}

const net = new brain.NeuralNetwork(config)