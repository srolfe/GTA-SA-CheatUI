var save={
	name: null,
	data: null,
	blocks: [],
	offsets: {}
}

function processFile(file){
	var reader=new FileReader();
	
	reader.onload=function(e){
		var raw=e.target.result;
		
		save.data=new Buffer(new Uint8Array(raw));
		parseBlockLocations();
		parseCheatLocations();
		loadStats();
	}
	
	reader.readAsArrayBuffer(file);
}

function parseBlockLocations(){
	for (ii = 0; ii < (save.data.length - 4); ii++){
		if (save.data.toString('utf8',ii,ii+1) == 'B'){
			if (save.data.toString('utf8',ii,ii+5) == 'BLOCK'){
				save.blocks.push(ii+5);
			}
		}
	}
}

function parseCheatLocations(){
	save.offsets.money = [save.blocks[15]+8, save.blocks[15]+20];
	
	save.offsets.infRun = save.blocks[15]+36;
	save.offsets.fastReload = save.blocks[15]+37;
	save.offsets.fireProof = save.blocks[15]+38;
	
	save.offsets.maxHealth = save.blocks[15]+39;
	save.offsets.maxArmor = save.blocks[15]+40;
	
	save.offsets.currentHealth = save.blocks[2]+48;
	save.offsets.currentArmor = save.blocks[2]+52;
}

function loadStats(){
	document.getElementById('curMoney').value=save.data.readUInt32LE(save.offsets.money[0]);
	document.getElementById('maxHealth').value=save.data.readUInt8(save.offsets.maxHealth);
	document.getElementById('maxArmor').value=save.data.readUInt8(save.offsets.maxArmor);
	document.getElementById('curHealth').value=save.data.readFloatLE(save.offsets.currentHealth);
	document.getElementById('curArmor').value=save.data.readFloatLE(save.offsets.currentArmor);
	
	if (save.data.readInt8(save.offsets.infRun)==1){
		document.getElementById('infRunCheat').checked=true;
	}else{
		document.getElementById('infRunCheat').checked=false;
	}
	
	if (save.data.readInt8(save.offsets.fireProof)==1){
		document.getElementById('fireProofCheat').checked=true;
	}else{
		document.getElementById('infRunCheat').checked=false;
	}
}

function writeStats(){
	save.data.writeUInt32LE(parseInt(document.getElementById('curMoney').value), save.offsets.money[0]);
	save.data.writeUInt32LE(parseInt(document.getElementById('curMoney').value), save.offsets.money[1]);
	
	save.data.writeUInt8(parseInt(document.getElementById('maxHealth').value), save.offsets.maxHealth);
	save.data.writeUInt8(parseInt(document.getElementById('maxArmor').value), save.offsets.maxArmor);
	save.data.writeFloatLE(parseFloat(document.getElementById('curHealth').value), save.offsets.currentHealth);
	save.data.writeFloatLE(parseFloat(document.getElementById('curArmor').value), save.offsets.currentArmor);
	
	save.data.writeInt8(document.getElementById('infRunCheat').checked?1:0, save.offsets.infRun);
	save.data.writeInt8(document.getElementById('fireProofCheat').checked?1:0, save.offsets.fireProof);
	
	writeChecksum();
}

function calculateSum(){
	var final=0;
	
	for (ii = 0; ii < (save.data.length - 4); ii++){
		final+=save.data.readUInt8(ii);
	}
	
	return final;
}

function writeChecksum(){
	save.data.writeUInt32LE(calculateSum(), save.data.length - 4);
	
	console.log(save.data);
	console.log(save.data.buffer);
	
	var blob = new Blob([save.data]);
	saveAs(blob, save.name)
}

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;

	var output;
	var f=files[0];
	save.name=f.name;
	output='<strong>'+ escape(f.name) +'</strong> - '+f.size+ ' bytes, last modified: '+(f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a')+'<br><br>';
	
	document.getElementById('list').innerHTML = output;
	
	processFile(evt.dataTransfer.files[0]);
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.clearData();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

document.getElementById("modSaveBut").addEventListener("click", writeStats, false);