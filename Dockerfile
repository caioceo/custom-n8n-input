FROM public.ecr.aws/docker/library/node:22-alpine

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

# instalar custom nodes diretamente no diretório do n8n
# 1) cria o diretório custom do n8n
# 2) copia a estrutura original dos nodes (inclui SVGs e TS)
# 3) copia os JS compilados da pasta dist principal
RUN mkdir -p /home/node/.n8n/custom && \
    cp -r /opt/custom-nodes/nodes/* /home/node/.n8n/custom/ && \
    find /opt/custom-nodes/dist/nodes -name "*.js" -exec cp {} /home/node/.n8n/custom/Random/ \; && \
    chown -R node:node /home/node/.n8n

EXPOSE 5678

CMD ["n8n", "start"]
