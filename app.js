'use strict'

const express = require('express');
const app = express();
const fs = require('fs');


app.listen(3000, async ()=>{
	console.log('App is listening on port 3000');
});

/*
*  File system method that watches input.txt for changes
*/

fs.watchFile('./input.txt', function() {
	retrieveTxtData ();
});

/*
*   a nodejs filesystem method that invokes a function that calculates the input.txt file on a callback
*/

function retrieveTxtData () {
	fs.readFile('input.txt', function (err, data) {
		if (err) {
			return console.error(err);
		}
		calculateTheResultOfTheInputFile(data);
	});
}

/*
*   This function collects and restructures the data so it can be used in a final fiunction that calculates a result of the cleaning and a position of roomba
*/

function calculateTheResultOfTheInputFile (data) {

	const arrInputLines = cleanTextInputData(data);

	/*
	*   input.txt file split into lines
	*/

	const roomDimension = arrInputLines[0];
	const roombaPosition = [arrInputLines[1]];
	const dirtCoordinates = arrInputLines.slice(2, -1);
	const roombaDirections = arrInputLines[arrInputLines.length - 1];

	/*
	*   Constants holding values of input.txt as numerical values
	*/

	const xLengthRoom = calcRoomArrLength(roomDimension).x;
	const yLengthRoom = calcRoomArrLength(roomDimension).y;
	const roomArrayLength = +(xLengthRoom * yLengthRoom);

	/*
	*  Arrays of values representing coordinates of elements as index number
	*/

	const roombaIndex = +(convertCoordinatesToArrayIndex(roombaPosition, yLengthRoom, yLengthRoom));
	const dirtArrayIndex = convertCoordinatesToArrayIndex(dirtCoordinates, yLengthRoom);
	const roombaArrayPathIndex = convertDirectionToNumbers(roombaDirections, yLengthRoom);

	performCleaning(roombaIndex, dirtArrayIndex, roombaArrayPathIndex, yLengthRoom, xLengthRoom);
}

/*
*  function that calculates the path of the roomba and the results of cleaning aka. Logic
*/

function performCleaning (positionRoomba, dirtArray, displacementDir, yLengthRoom, xLengthRoom) {

	let tilesCleaned = 0;
	const roomLengthArr = (yLengthRoom * xLengthRoom ) - 1;
	/*
	* adds a position where roomba starts as a possible cleaning spot
	*/
	displacementDir.unshift(0);

	/*
	* Puts roomba on the move and calculates its pattern
	*/

	displacementDir.forEach((element) => {

		/*
		* Filters out not allowed displcement direction i.e. walls
		*/

		const bordersCondition = (positionRoomba + element) > roomLengthArr || positionRoomba + element < 0 || positionRoomba % yLengthRoom === 0 &&  element === -1
		|| (positionRoomba + 1) % yLengthRoom === 0 && element === 1;

		if (bordersCondition)	return;

		positionRoomba = positionRoomba + element;

		/*
		* Checks position of roomba against the dirt patches array and removes cleaned coordinates from it
		*/

		if (dirtArray.includes(positionRoomba)) {

			const index = dirtArray.indexOf(positionRoomba);
			if (index !== -1) dirtArray.splice(index, 1);
			tilesCleaned ++
		};

	});

	const xCord = positionRoomba % yLengthRoom;
	const yCord = (positionRoomba - xCord)/yLengthRoom;

	console.log("Final coordinates of roomba: x= " + xCord + ", y= " + yCord );
	console.log("Tiles cleaned: " + tilesCleaned);
}

/*
*    UTILITY FUNCTIONS that transform the input.txt data to integers
*
*
*   Cleans data retrieved from input.txt, truns it into array representing lines of text, and removes empty strings
*/

function cleanTextInputData (data) {

	var arrayOfLines = data.toString().split('\n');
	arrayOfLines = arrayOfLines.filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"")});

	return arrayOfLines;
}

/*
*   Converts the X Y coordinates into array of values
*/

function convertCoordinatesToArrayIndex (coordinatesArray, lengthRoomY) {
	let result = [];

	coordinatesArray.forEach((element, index) => {

		const splitCoorArr = element.split(' ');
		const corX =  +splitCoorArr[0];
		const corY =  +splitCoorArr[1];
		const indexArray = lengthRoomY * (corY + 1) - ( lengthRoomY - corX);

		result.push(indexArray);

	});

	return  result;
}

/*
*   Converts directions to numerical values  i.e. N = 5, S = -5;
*/

function convertDirectionToNumbers (arr, lengthRoomY) {
	const arrayOfDir = arr.split('');
	let arrDirections = [];

	arrayOfDir.forEach((element) => {
		switch (element) {
			case 'N':
			arrDirections.push(lengthRoomY);
			break;
			case  'S':
			arrDirections.push(-lengthRoomY);
			break;
			case 'W':
			arrDirections.push(-1);
			break;
			case 'E':
			arrDirections.push(1);
			break;
			default:
			return;
		}
	});

	return arrDirections;
}

/*
*   function that returns an object with numerical values for the dimensions of the room
*/

function calcRoomArrLength  (room) {

	room = 	room.split(' ');
	const xLength =  +room[0];
	const yLength =  +room[1];

	const obj = {
		x: xLength,
		y: yLength
	};

	return obj;
}

retrieveTxtData ();
