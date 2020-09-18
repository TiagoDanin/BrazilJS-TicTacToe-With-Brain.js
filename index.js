const {
	Select
} = require('enquirer')
const chalk = require('chalk')
const ia = require('./ia')

let table;
const playerAvatar = {
	ia: 'O',
	human: 'X'
}

const winingPosibles = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

const sleep = (timeMs) => new Promise(resolve => setTimeout(resolve, timeMs));

const cleanConsole = () => process.stdout.write('\033c');

const posibleChoices = () => table.filter(item => typeof item === 'number').map(item => item.toString());

const createTable = () => {
	table = [...Array(9).keys()];
}

const showTable = () => {
	const output = table.reduce((output, item, index) => output + item + ([2, 5, 8].includes(index) ? '\n' : '   '), '');
	console.log(output);
}

const writeTable = (possition, write) => table[Math.floor(possition)] = write === playerAvatar.human ? chalk.green(playerAvatar.human) : chalk.yellow(playerAvatar.ia);

const iaTable = () => table.map(item => item === chalk.yellow(playerAvatar.ia) ? 1 : 0)

const humanTable = () => table.map(item => item === chalk.green(playerAvatar.human) ? 1 : 0)

const createTableIa = (tableIa, position) => { 
	const newTable = [...tableIa];
	newTable[position] = 1;
	return newTable
}

const checkWining = async (isHuman) => {
	const selectTable = isHuman ? humanTable() : iaTable();
	const tableIndex = selectTable.map((item, index) => item === 1 ? index : null).filter(item => item !== null);
	const findWin = winingPosibles.find(winingPosible => tableIndex.filter(item => winingPosible.includes(item)).length >= 3);

	if (findWin) {
		ia.update(iaTable(), humanTable(), isHuman, false)
		tableIndex.map(possition => {
			table[Math.floor(possition)] = chalk.red(isHuman ? playerAvatar.human : playerAvatar.ia);
		});
		cleanConsole();
		showTable();
		console.log('---------------------')
		console.log(isHuman ? chalk.green('Você ganhou!') : chalk.red('Não foi dessa vez!'));
		await sleep(2400);
		cleanConsole();
		createTable();
	}
}

const checkTable = async (possition, write) => {
	cleanConsole();
	writeTable(possition, write);
	showTable();
	await sleep(1000);
	await checkWining(true)
	cleanConsole();

	const posibleIaChoices = posibleChoices();
	if (posibleIaChoices.length < 9) {
		if (posibleIaChoices.length > 0) {
			const data = posibleIaChoices.map(position => {
				return {
					position,
					table: createTableIa(iaTable(), position)
				}
			})

			const iaPosition = ia.check(data, iaTable());
			writeTable(iaPosition, playerAvatar.ia);
			await checkWining(false)
		}

		if (posibleChoices().length <= 0) {
			ia.update(iaTable(), humanTable(), false, true)
			showTable();
			console.log('---------------------')
			console.log(chalk.yellow('Empate!'));
			await sleep(3000);
			cleanConsole();
			createTable();
		}
	}
}

const main = async () => {
	cleanConsole();
	createTable()

	while (true) {
		showTable()

		const prompt = new Select({
			message: 'Let\'s Go',
			choices: [...posibleChoices(), 'Sair', 'Novo Jogo']
		})

		await prompt.run()
			.then(async answer => {
				switch (answer) {
					case 'Sair':
						process.exit(0);
						break;
					case 'Novo Jogo':
						createTable();
						break;
					default:
						await checkTable(answer, playerAvatar.human)
						break;
				}
			})
			.catch(console.error)
	}
}

main()

module.exports = {
	createTable,
	showTable
}