const brain = require('brain.js')

const config = {
	binaryThresh: 0.5,
	hiddenLayers: [],
	activation: 'sigmoid',
};

const net = new brain.NeuralNetwork(config);

const check = (posibleChoices, tableIa, tableHuman) => {
	return '0'
}

const update = (tableIa, tableHuman, isWinHuman, isTie) => {
}

module.exports = {
	check,
	update
};