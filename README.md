Onfly – Desafio Técnico (n8n + Node 22 + Custom Node)

Visão geral
- Infra local com Docker Compose: n8n self-hosted (1.85.4) + Postgres 15
- Custom Node: Random (True Random Number Generator) usando Random.org
- Linguagem: Node.js 22 LTS + TypeScript

Pré‑requisitos
- Docker Desktop (com Docker Compose v2)
- Node.js 22 LTS e npm (apenas para compilar o custom node localmente)
- Windows PowerShell (comandos abaixo são compatíveis)

Estrutura do projeto
```
onfly-task/
├─ Dockerfile
├─ docker-compose.yml
├─ custom-nodes/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ nodes/
│     └─ Random/
│        ├─ Random.node.ts
│        └─ Random.svg
└─ .n8n/ (persistência do n8n; montada no container)
```

Como rodar a infraestrutura (n8n + Postgres)
0) Clonar o repositório
```
git clone https://github.com/caioceo/custom-n8n-input
cd custom-n8n-input
```
1) Build da imagem do n8n com Node 22 e os custom nodes (o Dockerfile já compila o TS → JS)
```
docker build -t custom-n8n-node22 .
```
2) Subir os serviços
``` 
docker compose up -d
```
3) Acessar a interface
- n8n: http://localhost:5678
4) Parar/derrubar quando quiser
```
docker compose down
```

Fluxo após mudanças no custom node
Sempre que editar `custom-nodes/nodes/**.ts`:
```
cd custom-nodes
npm run build
cd ..
docker compose build n8n
docker compose up --force-recreate n8n -d
```
Explicação rápida:
- `npm run build`: compila TS → JS em `custom-nodes/dist/**`
- `docker compose build n8n`: reconstrói a imagem com o JS atualizado
- `docker compose up --force-recreate n8n -d`: recria o container para usar a nova imagem

Detalhes do Custom Node: Random
- Nome: Random
- Operação: True Random Number Generator
- Parâmetros: Min (número inteiro), Max (número inteiro)
- Regra de validação: Min deve ser menor que Max
- Implementação: chama Random.org (GET)
	- `https://www.random.org/integers/?num=1&min={min}&max={max}&col=1&base=10&format=plain&rnd=new`
- Saída: `{ randomNumber: <inteiro> }`
- Ícone: `Random.svg` (carregado via `icon: 'file:Random.svg'`)

Variáveis de ambiente relevantes (docker-compose.yml)
- `DB_*`: configura Postgres do n8n
- `N8N_ENABLE_FILE_SYSTEM_NODES=true`: permite carregar nodes de `/home/node/.n8n/nodes`
- `N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom`: habilita pacote de extensão (se existir)
- `GENERIC_TIMEZONE=America/Sao_Paulo`: timezone

Como testar o node no n8n
1) Abra o editor em http://localhost:5678
2) Adicione o node “Random” ao canvas
3) Informe `Min` e `Max` (ex.: `1` e `60`)
4) Execute o node e veja `randomNumber` no output

Resolução de problemas

- Mudanças no TS não aparecem:
	- Garanta que executou: `npm run build` → `docker compose build n8n` → `docker compose up --force-recreate n8n -d`.
- Porta 5678 ocupada:
	- Pare o serviço em conflito ou mude o mapeamento de porta no `docker-compose.yml`.
- Verificar versão do Node dentro da imagem:
```
docker run --rm -it custom-n8n-node22 node -v
```

Considerações pessoais

Este foi meu primeiro contato com Docker e com o n8n. Apesar dos desafios naturais de aprender ferramentas novas (imagem, compose, build/recreate de containers e empacotamento de custom nodes), gostei muito da oportunidade de ser introduzido a esse ecossistema de automação e orquestração. Fico grato pela experiência e pelo aprendizado.


