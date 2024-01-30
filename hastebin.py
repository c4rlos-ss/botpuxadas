import requests
import json
import logging

def create_haste(text, access_token):
    url = 'https://hastebin.com/documents'
    headers = {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + access_token
    }

    text = text.encode('utf-8')

    response = requests.post(url, headers=headers, data=text)

    if response.status_code == 200:
        haste_url = 'https://hastebin.com/' + response.json()['key']
        haste_key = haste_url.split('/')[3]
        share_url = 'https://hastebin.com/share/' + haste_key
        short_url = shorten(share_url)
        return short_url
    else:
        print('Erro ao criar o haste: ', response.content)
        return None

def shorten(url):
    base_url = 'https://encurta.net/api?api=a76fb6522427bd7cfa5992f1b7976ca9679206a5&url='
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(base_url + url, headers=headers)
    short_url = json.loads(response.text)['shortenedUrl']
    return short_url

with open('resultadodaconsulta.txt', 'r') as file:
    content = file.read()

with open('resultadodaconsulta.txt', 'w') as file:
    pass

with open('resultadodaconsulta.txt', 'w') as file:
    file.write('(text=)')

text = content

access_token = 'e66f6ab6798c7983f428bb622095ad42e8bf596cd886623016d1dfb2342154896e18b47e6b6c469cf61fc4ca302f9c37ecb13a01b5b6b096fa91c11e913f6162'

link = create_haste(text, access_token)

print('Link do haste:', link)

with open('resultadofinal.txt', 'w') as file:
    pass
# Configura o logging para gravar no arquivo 'resultadofinal.txt'
logging.basicConfig(filename='resultadofinal.txt', level=logging.INFO)

# Grava a mensagem no arquivo de log
logging.info("""Ta na mão meu patrão!!! A sua consulta foi realizada com sucesso. Se você é burro e não sabe como pular o encurtador, há um tutorial disponível no link abaixo. Basta seguir as instruções e você será capaz de visualizar os resultados da sua consulta sem problemas.

link para o vídeo: https://youtube.com/shorts/nhAPM0luEck?si=xnhino0eHeP6sGhf

E aqui está o link direto para os resultados da sua consulta. Lembre-se de desligar o adblock para pular o encurtador normalmente para acessar os dados: %s""", link)

