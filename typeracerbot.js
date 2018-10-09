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

var turns = 0;

while(true){
	console.log('let\'s get this bread for the ' + turns + 'time');

	Import();

	await sleep(1000); // Wacht een seconde totdat Jquery is ingeladen
	
	var text = "";
	var inputField = $('.txtInput');

	$('span[unselectable="on"]').each(function(a,b){
		text += b.innerHTML;
	});

	for(var i = 0; i<= text.length; i++){
		addText(text[i]);
		await sleep(69);
	}

	console.log('Done');

	while($('.gameStatusLabel').html() != "The race has ended." && $('.gameStatusLabel').html().substr(0,12) != "You finished"){
		await sleep(1000);
	}
	console.log('Race voorbij');
	console.log('Nieuwe race starten..');
	removePop();
	document.getElementsByClassName('raceAgainLink')[0].click();
	turns++;
	await sleep(20000);
}
