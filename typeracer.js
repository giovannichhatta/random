// Import Jquery
var script = document.createElement('script');
var src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
script.src = src;
document.body.append(script);

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

await sleep(1000); // Wacht een seconde totdat Jquery is ingeladen

var text = "";
var inputField = $('.txtInput');

async function addText(character){
	$(inputField).val($(inputField).val() + character);
}

$('span[unselectable="on"]').each(function(a,b){
	text += b.innerHTML;
});

for(var i = 0; i<= text.length; i++){
	addText(text[i]);
	await sleep(69);
}
console.clear();
console.log('done');
