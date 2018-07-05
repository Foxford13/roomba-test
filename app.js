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

	retrievetxtData ();

});

/*
*   a nodejs filesystem method that invokes a function that calculates the input.txt file on a callback
*/

function retrievetxtData () {
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
	*   input.txt file split according to their line number
	*/

	const roomDimension = arrInputLines[0];
	const roombaPosition = [arrInputLines[1]];
	const dirtCoordinates = arrInputLines.slice(2, -1);
	const roombaDirections = arrInputLines[arrInputLines.length - 1];

	/*
	*   Constants holding values of input.txt as numerical values
	*/

	const xLengthRoom = calcRoomArrLenght(roomDimension).x;
	const yLengthRoom = calcRoomArrLenght(roomDimension).y;
	const roomArrayLength = +(xLengthRoom * yLengthRoom);

	/*
	*  Arrays of values representing coordinates of elements as index number
	*/

	const roombaIndex = +(convertCoordinatesToArrayIndex(roombaPosition, yLengthRoom, yLengthRoom));
	const dirtArrayIndex = convertCoordinatesToArrayIndex(dirtCoordinates, yLengthRoom);
	const roombaArrayPathIndex = convertDirectionToNumbers(roombaDirections, yLengthRoom);

	performCleaning(roomArrayLength, roombaIndex, dirtArrayIndex, roombaArrayPathIndex, yLengthRoom);

}

/*
*  function that calculates the path of the roomba and the results of cleaning
*/

function performCleaning (dimension, position, target, displacementDir, lengthRoom) {

	dimension = +dimension;
	position = +position;

	let tilesCleaned = 0;

	var path = [position];

	const sizeRoom = (lengthRoom * lengthRoom ) - 1;
	displacementDir.forEach((element) => {

		const bordersCondition = (position + element) > sizeRoom || position + element < 0 || position % lengthRoom === 0 &&  element === -1
		|| (position + 1) % lengthRoom === 0 && element === 1;

		if (bordersCondition)	return;

		position = position + element;

		path.push(position);

		if (target.includes(position)) {
			console.log('yey');


			const index = target.indexOf(position);
			if (index !== -1) target.splice(index, 1);
			tilesCleaned ++
		}

	});
	console.log(path);

	const xCord = position % lengthRoom;
	const yCord = (position - xCord)/lengthRoom;

	console.log("Final coordinates of roomba: x= " + xCord + ", y= " + yCord );
	console.log("Tiles cleaned: " + tilesCleaned);

}


/*
*    UTILITY FUNCTIONS that transform the input.txt data to numbers
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
*   Cleans data retrieved from input.txt, truns it into array representing lines of text, and removes empty strings
*/

function convertCoordinatesToArrayIndex (coordinatesArray, lengthRoomY) {
	let result = [];

	coordinatesArray.forEach((element, index) => {

		const splitCoorArr = element.split(' ');
		const corX =  +splitCoorArr[0];
		const corY =  +splitCoorArr[1];
		const indexArray = lengthRoomY * (corY + 1) - ( lengthRoomY - corX);

		result.push(indexArray);

	})

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
	})

	return arrDirections;
}

/*
*   function that returns an object with numerical values for the dimensions of the room
*/

function calcRoomArrLenght  (room) {

	room = 	room.split(' ');
	const xLength =  +room[0];
	const yLength =  +room[1];

	const obj = {
		x: xLength,
		y: yLength
	}

	return obj;
}

retrievetxtData ();
