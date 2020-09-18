const brain = require('brain.js')

const config = {
	binaryThresh: 0.5,
	hiddenLayers: [12],
	activation: 'sigmoid',
};

const net = new brain.NeuralNetwork(config);

net.train([{
		input: [
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		],
		output: [0]
	},
	{
		input: [
			1, 1, 1,
			0, 0, 0,
			0, 0, 0
		],
		output: [1]
	},
	{
		input: [
			1, 0, 0,
			1, 0, 0,
			1, 0, 0
		],
		output: [1]
	},
	{
		input: [
			1, 0, 1,
			0, 0, 0,
			0, 1, 0
		],
		output: [0]
	}
])

const check = (posibleChoices, tableIa, tableHuman) => {
	const results = posibleChoices.map(data => {
		return {
			...data,
			result: net.run(data.table)
		}
	})

	return results.sort((a, b) => b.result - a.result)[0].position
}

const update = (tableIa, tableHuman, isWinHuman, isTie) => {
	if (isTie) {
		net.train([{
				input: tableIa,
				output: [0.4]
			},
			{
				input: tableHuman,
				output: [0]
			}
		])
	} else {
		net.train([{
				input: tableIa,
				output: [isWinHuman ? 0 : 0.85]
			},
			{
				input: tableHuman,
				output: [isWinHuman ? 1 : 0]
			}
		])
	}
}

module.exports = {
	check,
	update
};