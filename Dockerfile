FROM node:22-alpine

# dependências do sistema necessárias para n8n e nodes personalizados
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    libmagic \
    zlib-dev

RUN npm install -g n8n@1.85.4
# é a versão recomenda pela documentação do n8n para Node v22

# copiar e compilar custom nodes
COPY custom-nodes/ /opt/custom-nodes/
WORKDIR /opt/custom-nodes
RUN npm install && npm run build

# dir workspace
WORKDIR /home/node/.n8n

# copiar nodes compilados para o diretório correto do n8n
RUN mkdir -p /home/node/.n8n/nodes && \
    cp -r /opt/custom-nodes/dist/* /home/node/.n8n/nodes/ && \
    cp /opt/custom-nodes/package.json /home/node/.n8n/

EXPOSE 5678

CMD ["n8n", "start"]
