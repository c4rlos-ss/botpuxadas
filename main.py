from config import api_id, api_hash, group_username
from telethon import TelegramClient, events
import asyncio
import subprocess

with open('mensagemDOusuario.txt', 'r') as file:
   message = file.read()

with open('mensagemDOusuario.txt', 'w') as file:
   pass

your_message = message

async def my_event_handler(client, entity, message):
   received_response = False
   while not received_response:
       @client.on(events.NewMessage(chats=entity))
       async def handle_new_message(event):
           nonlocal received_response
           if event.message.reply_to_msg_id == message.id:
               if event.message.document:
                  await client.download_media(event.message, 'temp.txt')
                  with open('temp.txt', 'r') as file:
                      response_text = file.read()
               else:
                  response_text = event.message.text

               lines = response_text.splitlines()
               if len(lines) > 5:
                  lines = lines[:-5]
               modified_response = '\n'.join(lines)

               print('Resposta modificada: ', modified_response)
               received_response = True
               with open('resultadodaconsulta.txt', 'w') as f:
                  f.write(modified_response)
               subprocess.call(['python3', './hastebin.py'])
       await asyncio.sleep(1)

async def main():
   async with TelegramClient('anon', api_id, api_hash) as client:
       entity = await client.get_entity(group_username)
       message = await client.send_message(entity, your_message)
       print('Mensagem enviada com sucesso.')

       try:
           await asyncio.wait_for(my_event_handler(client, entity, message), timeout=25)
       except asyncio.TimeoutError:
           print("Algo inesperado aconteceu, tente novamente.")

loop = asyncio.get_event_loop()
loop.run_until_complete(main())

