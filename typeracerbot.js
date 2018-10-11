function Import(){
	// Import Jquery
	var script = document.createElement('script');
	var src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
	script.src = src;
	document.body.append(script);
}

async function removePop(){
	await sleep(1000);	
	try{
		document.getElementsByClassName('xButton')[0].click();
		console.log('Login popup weggeklikt');
	}catch(a){
		console.log('Login popup niet gezien');
	}
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function addText(character){
	$(inputField).val($(inputField).val() + character);
}

var turns = 1;

var rank = {
	'first'  : 0,
	'second' : 0,
	'third'  : 0,
	'fourth' : 0,
	'fifth'  : 0
};

function getRank(){
	for( i in rank) {
 		console.log(i + "\t: " + rank[i]);
	}
}

Import();
await sleep(1000); // Wacht een seconde totdat Jquery is ingeladen

while(true){
	console.clear();
	console.log('Round: ' + turns);
	console.log("-".repeat(10));
	console.log("\nResults:\n");

	getRank()

	while(document.getElementsByClassName('lightLabel')[0]){
	 await sleep(1200);
	}
	console.log('let\'s get this bread');
	
	var text = "";
	var inputField = $('.txtInput');

	$('span[unselectable="on"]').each(function(a,b){
		text += b.innerHTML;
	});

	for(var i = 0; i < text.length; i++){
		addText(text[i]);
		await sleep(120);
	}

	console.log('Done');

	while($('.gameStatusLabel').html() != "The race has ended." && $('.gameStatusLabel').html().substr(0,12) != "You finished"){
		await sleep(1000);
	}
	
	switch($('.gameStatusLabel').html().substr(13,1)){
		case "1":
			rank.first++;
			break;
		case "2":
			rank.second++;
			break;
		case "3":
			rank.third++;
			break;
		case "4":
			rank.fourth++;
			break;
		case "5":
			rank.fifth++;
			break;
		default:
			console.log("Er ging iets met het opslaan van je rank..");
	}

	if($('.challengePrompt').html()){
		console.clear()
		console.log("Game over");
		console.log("-".repeat(10)+"\n");
		getRank();
		break;
	}

	console.log('Race voorbij');
	console.log('Nieuwe race starten..');
	removePop();
	document.getElementsByClassName('raceAgainLink')[0].click();
	turns++;
	
	await sleep(5000);
}
