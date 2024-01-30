const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { exec } = require('child_process');
const md5 = require('md5');

const client = new Client();

let lastMessageTime = Date.now();
let lastReceivedMessage = null;
let lastSentMessage = '';
let md5Previous = null;

client.on('qr', (qr) => {
 qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
 console.log('Client is ready!');
});

function handleCPF1(message) {
 const input = message.body.substring(6).trim();
 if(/^\d{11}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('CPF inválido. Deve conter exatamente 11 dígitos.');
 }
}

function handleCPF2(message) {
 const input = message.body.substring(6).trim();
 if(/^\d{11}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('CPF inválido. Deve conter exatamente 11 dígitos.');
 }
}

function handleCPF3(message) {
 const input = message.body.substring(6).trim();
 if(/^\d{11}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('CPF inválido. Deve conter exatamente 11 dígitos.');
 }
}

function handleTelefone(message) {
 const input = message.body.substring(9).trim();
 if(/^\d{8,11}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('Número de telefone inválido. Deve conter entre 8 e 11 dígitos.');
 }
}

function handlePlaca(message) {
 const input = message.body.substring(5).trim();
 if(/^[A-Za-z0-9]{7}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('Placa inválida. Deve conter exatamente 7 dígitos ou letras.');
 }
}

function handleCNPJ(message) {
 const input = message.body.substring(5).trim();
 if(/^\d{14}$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('CNPJ inválido. Deve conter exatamente 14 dígitos.');
 }
}

function handleNome(message) {
 const input = message.body.substring(6).trim();
 if(/^[A-Za-z\s]+$/.test(input)) {
  writeAndExecutePythonScript(message.body);
 } else {
  message.reply('Nome inválido. Deve conter apenas letras.');
 }
}

function writeAndExecutePythonScript(message) {
 fs.writeFileSync('mensagemDOusuario.txt', message);
 exec('python3 main.py', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
 });
}

const commands = new Map([
 ['/cpf1', handleCPF1],
 ['/cpf2', handleCPF2],
 ['/cpf3', handleCPF3],
 ['/telefone', handleTelefone],
 ['/placa', handlePlaca],
 ['/cnpj', handleCNPJ],
 ['/nome', handleNome]
]);

client.on('message', message => {
 let currentTime = Date.now();
 if (message.body.startsWith('/') && currentTime - lastMessageTime > 30000) {
 const command = message.body.split(' ')[0];
 if(commands.has(command)) {
  const handler = commands.get(command);
  handler(message);
 } else {
  message.reply('Comando não reconhecido.');
 }
 lastMessageTime = currentTime;
 lastReceivedMessage = message;
 }
});

if (fs.existsSync('resultadofinal.txt')) {
 fs.watch('resultadofinal.txt', (eventType, filename) => {
 if (filename) {
    const md5Current = md5(fs.readFileSync('resultadofinal.txt'));
    if (md5Current !== md5Previous) {
      let response = fs.readFileSync('resultadofinal.txt', 'utf8');
      if (response.length === 0) {
        console.log("O arquivo está vazio.");
      } else {
        // Remove a informação indesejada
        response = response.replace('INFO:root:\n', '').trim();
        if (response !== lastSentMessage) {
          lastReceivedMessage.reply(response);
          lastSentMessage = response;
        }
        fs.writeFileSync('resultadofinal.txt', ''); // Limpa o arquivo
        md5Previous = md5Current;
      }
    }
 }
});
} else {
 console.log("Arquivo 'resultadofinal.txt' não encontrado.");
}

client.initialize();
