var encodes = []
var bubbleXor = []
var wordHexs = []
//Input hex string here.
var inputMessage = ["ea 9d aa 4b be da 3a bf a8 9a 27 cb b0 5e 62 3a e9 39 88 3a a3 f7 d1 f4 b1 e7 72 ec 12 39 77 af f9 e5 4 fd ff 87 71 f2 b9 34 49 2b b9 d8 e3 97 ff c1 1a 59 87 bc 4e 97 76 8a 82 36 f8 3c c8 a0 c0 71 a6 50 15 e 90 69 3a 1a d8 da c1 8a 5a 42 56 d4 91 72 4a 34 83 a b2 23 b3 40 97 b9 2 b8 b7 95 22 b5 18 4f 7d 96 7b 39",
		    "ff d5 b3 54 ff c3 33 b4 af 9b 62 82 b3 c 79 24 e5 7d 85 28 f1 f6 d0 f0 b1 fb 26 eb 9 77 63 e0 e6 fe 6 bc e3 87 34 f3 f7 36 4f 79 bd d8 e1 85 b1 d4 58 5f 9c e8 19 98 7a 9d 9e 7f f7 7b 98 a1 db 77 a6 45 1d 4a c2 6b 3d 1d 9e",
		    "f7 81 e3 51 ed 97 21 b3 b8 d6 20 8a b3 49 2d 2a ef 2f cd 3d eb f7 87 db a2 e8 67 a4 b 3b 71 fb e6 e5 3 b0 b1 83 7a f2 b9 29 55 2b a2 d9 fe 94 ba c4 58 59 9c bc 1 d0 65 9f 84 36 f9 2e 9b f3 dc 71 a6 40 7 b c2 7b 7e c d1 89 d0 86 1f 12 70 d4 93 75 5 36 9c 16 fb",
		    "e9 90 e3 5b ff d9 75 b5 b2 82 62 9b b2 43 60 25 f3 38 cd 30 ec e7 87 f7 a2 f3 63 a8 5b 31 7f fd f4 ff 1f b8 bd c2 7b e4 b9 25 50 6e bc 96 ed c0 b5 cf 1a 16 9b ae 4e 89 7c 8b d6 33 f3 3a 9a bd 94 64 bc 41 50 20 d1 68 32 4e c0 88 da 85 4d 3 71 d8 8e 7d d 64 9d 4 bb 36 a7 4c 9d b5 42",
		    "ff 9b e3 57 fc dd 30 b8 a9 d6 2b 98 e0 4d 2d 3f ef 3b 99 3e e2 e0 c2 b1 a1 eb 68 e0 17 32 30 e0 e6 aa 3 b8 fd 83 60 f3 fd 60 55 7f b3 c2 e9 c0 be ce 1c 16 90 ad 6 91 65 97 99 2d b8",
		    "f7 9b ab 5d ec de 21 ba b3 95 27 cb b0 5e 62 3a e9 39 88 3a a3 f3 87 e1 ac e9 63 f6 1d 22 7c af e1 e4 15 fd ff 83 60 e3 eb 21 4a 2b bf d3 ef 88 be ce 11 45 9f e8 8 9f 61 de 99 2d f1 3a 86 ba ce 79 ba 43 50 b de 7a 73 1d c4 88 c0 81 4b 17 6e dc 89 74 4a 3d 9e 10 a7 71 a1 42 9c a4 1b be e5 9c 6d" ]
// Input guessing word here.
var inputWords = [" platform ", " module ","This ", " program ", "hardware", " powerful ", "software.",
		  " the ", " provides ", "related ", "natural", "Java ",
		  "analizing", "environment ", "platforms.", "mechanism ", "learn", " organizing ", "language.",
		  " various", "onto ", "based","programming "]
var decodedKey = []
var maxMessage = []

// convert inputs message and find max message
for ( var i = 0; i < inputMessage.length ; i++ ) {
	var array = parseHexs( inputMessage[i] )
	if ( maxMessage.length < array.length ) {
		maxMessage = array
	}
	encodes.push( array )
}
// convert input hex
for ( var i = 0 ; i < inputWords.length ; i++ ) {
	wordHexs.push( parseHexFromString( inputWords[i] ) )
}
for ( var i = 0 ; i < encodes.length ; i++ ){
	bubbleXor[ i ] = []
}
// bubble xor
for ( var i = 0 ; i < encodes.length - 1 ; i++ ) {
	for ( var j = i+1 ; j < encodes.length ; j++ ) {
		var res = xorHexs( encodes[i], encodes[j] )
		bubbleXor[i].push(res)
		bubbleXor[j].push(res)
	}
}
// word xor loop
for ( var i = 0 ; i < bubbleXor.length ; i++ ) {
	for ( var j = 0 ; j < wordHexs.length ; j++ ) {
		doKeyByLoopWord( wordHexs[j], i )
	}
}

//Print result
console.log( decodedKey )
//Print Decode
for ( var i = 0 ; i < encodes.length ; i++ ) {
	console.log( toString( encodes[i] , decodedKey ) + "\n" )
}

function doKeyByLoopWord( word, xorIndex ) {
	for ( var i = 0 ; i < maxMessage.length - word.length ; i++ ) {
		if ( !isResulted( i , i + word.length - 1 ) ) {
			if ( isCorrectKey( word, i, xorIndex ) ) {
					saveResult( getKey( word, i , xorIndex) , i )
			}
		}
	}
}

function toString( encodedHex, keyHex ) {
	var result = ""
	for ( var i = 0 ; i < encodedHex.length ; i++ ) {
		if ( keyHex[ i ] == null ) {
			result += " " + encodedHex[ i ]
		} else {
			result += String.fromCharCode( encodedHex[ i ] ^ keyHex [ i ] )
		}
	}
	return result
}

function getKey( wordHexs, startIndex , xorIndex) {
	return xorWord( wordHexs, encodes[xorIndex], startIndex )
}

function xorWord ( wordHexs, targetHexs, startIndex ) {
	var result = []
	//if ( targetHexs.length < wordHexs.length + startIndex ) return result
	for ( var i = 0 ; i < wordHexs.length ; i++ ) {
		if ( i + startIndex >= targetHexs.length ) return result
		result.push( targetHexs[ i + startIndex ] ^ wordHexs[ i ] )	
	}
	return result
}

function saveResult( guessKeys, startIndex ) {
	for ( var i = 0 ; i < guessKeys.length ; i++ ) {
		decodedKey[ i + startIndex ] = guessKeys[ i ]
	}
}

function isCorrectKey( keyHexs, startIndex, bubbleXorIndex ) {
	var xor = bubbleXor[ bubbleXorIndex ]
	var count = xor.length
	for ( var i = 0 ; i < xor.length ; i++ ) {
		var res = isLetterAfterXor( keyHexs, startIndex, xor[ i ] )
		switch ( res ) {
			case 0 : return false
				break;
			case 2 : count--
		}
	}
	if ( count < 1 ) return false
	return true
}

function isLetterAfterXor( keyHexs, startIndex, message ) {
	if ( startIndex + keyHexs.length > message.length ) return 2
	for ( var i = 0 ; i < keyHexs.length ; i++ ) {
		if ( !isLetter( message[ startIndex + i ] ^ keyHexs[ i ] ) ) return 0
	}
	return 1
}

function isResulted( fromIndex, toIndex ) {
	for ( var i = fromIndex ; i <= toIndex ; i++ ) {
		if ( decodedKey[ i ]  == null ) return false
	}
	return true
}

//Modify this for target character (ASCII)
//Current is a-z , A-Z, ., -, space
function isLetter ( n ) {
	return n == 32 || ( n >= 65 && n <= 90 ) || ( n >= 97 && n <= 122 ) || ( n >= 44 && n <= 46 )
}

function parseHexFromString( str ) {
	var result = []
	for ( var i = 0 ; i < str.length ; i++ ) {
		result.push( str.charCodeAt(i) )
	}
	return result
}

function parseHexs( str ) {
	var result = []
	var a = str.split(" ")
	for ( var i = 0 ; i < a.length ; i++ ) {
		result.push( parseInt( a[i], 16 ) )
	}
	return result
}

function xorHexs( hexs1 , hexs2 ) {
	var result = []
	var len = Math.min( hexs1.length, hexs2.length )
	for ( var i = 0 ; i < len ; i++ ) {
		result.push( hexs1[ i ] ^ hexs2[ i ] )
	}
	return result 
}