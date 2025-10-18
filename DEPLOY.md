# Deploy Guide - ZardUI SSR

Este guia documenta como fazer deploy da aplicação ZardUI com SSR (Server-Side Rendering) usando **Firebase App Hosting**.

## Arquitetura

A aplicação utiliza o **Firebase App Hosting**, a solução moderna e simplificada do Firebase para aplicações SSR:

- **Firebase App Hosting**: Gerencia automaticamente SSR com Cloud Run
- **CDN Global**: Distribui assets estáticos automaticamente
- **Auto-scaling**: Escala automaticamente baseado em demanda
- **Sitemap dinâmico**: Gerado em tempo real pelo servidor SSR baseado nas rotas disponíveis
- **Zero configuração de containers**: Firebase cuida de tudo automaticamente

## Pré-requisitos

1. **Instalar Firebase CLI** (versão 13.0.0+):
   ```bash
   npm install -g firebase-tools@latest
   firebase login
   ```

2. **Criar projeto Firebase** (se ainda não tiver):
   - Acesse [Firebase Console](https://console.firebase.google.com)
   - Crie um novo projeto ou use um existente
   - Habilite o Firebase App Hosting

3. **Conectar o repositório Git**:
   - Firebase App Hosting funciona com integração direta ao GitHub/GitLab
   - Configure o repositório no Firebase Console

## Deploy via Firebase Console (Recomendado)

### Primeira vez:

1. **Acesse o Firebase Console**:
   - Vá em `App Hosting` no menu lateral
   - Clique em `Get Started`

2. **Conecte seu repositório**:
   - Selecione GitHub ou GitLab
   - Autorize o Firebase a acessar seu repositório
   - Selecione o repositório `zardui`

3. **Configure o backend**:
   - Root directory: `/` (raiz do projeto)
   - O Firebase detectará automaticamente que é um projeto Angular
   - Confirme as configurações do `apphosting.yaml`

4. **Deploy automático**:
   - Cada push na branch principal fará deploy automaticamente
   - Você pode configurar branches específicas para preview

## Deploy via CLI

### 1. Inicializar App Hosting (primeira vez):

```bash
firebase init apphosting
```

Siga as instruções:
- Selecione o projeto Firebase
- Conecte ao repositório Git
- Configure a branch de produção

### 2. Deploy manual:

```bash
# Build da aplicação
npm run build

# Deploy (será feito automaticamente via Git)
git add .
git commit -m "Deploy SSR"
git push
```

## Configurações Importantes

### apphosting.yaml

Configuração do Cloud Run gerenciada pelo Firebase:

```yaml
runConfig:
  minInstances: 0        # Escala para zero quando sem tráfego
  maxInstances: 10       # Máximo de instâncias simultâneas
  concurrency: 80        # Requisições simultâneas por instância
  cpu: 1                 # 1 vCPU por instância
  memoryMiB: 512        # 512MB de memória por instância
```

**Ajuste conforme necessário**:
- Aumente `minInstances` para reduzir cold starts (mas aumenta custos)
- Aumente `maxInstances` se esperar muito tráfego
- Aumente `memoryMiB` se tiver problemas de memória

### firebase.json

Configuração simples do hosting (App Hosting gerencia o SSR automaticamente):

```json
{
  "hosting": {
    "public": "dist/apps/web/browser",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Variáveis de Ambiente

Para adicionar variáveis de ambiente, edite `apphosting.yaml`:

```yaml
env:
  - variable: API_KEY
    value: "sua-chave-aqui"
    availability:
      - RUNTIME
```

## Verificação do Deploy

Após o deploy, verifique:

1. **Status do deploy**:
   ```bash
   firebase apphosting:backends:list
   ```

2. **Sitemap dinâmico**:
   ```bash
   curl https://seu-dominio.web.app/sitemap.xml
   ```

3. **Logs em tempo real**:
   - Acesse o Firebase Console
   - Vá em App Hosting > Logs
   - Ou use: `firebase apphosting:backends:logs`

## Preview Environments

Firebase App Hosting cria automaticamente ambientes de preview para cada Pull Request:

1. Crie um PR no GitHub
2. Firebase automaticamente faz deploy de um preview
3. Link do preview aparecerá nos comentários do PR
4. Teste antes de fazer merge

## Rollback

Fazer rollback é simples:

```bash
# Listar versões anteriores
firebase apphosting:rollouts:list

# Fazer rollback para versão específica
firebase apphosting:rollouts:rollback <ROLLOUT_ID>
```

Ou via Firebase Console:
1. Vá em App Hosting > Rollouts
2. Selecione a versão anterior
3. Clique em "Rollback"

## Monitoramento

### Logs
```bash
# Logs em tempo real
firebase apphosting:backends:logs --tail

# Logs com filtro
firebase apphosting:backends:logs --filter="severity>=ERROR"
```

### Métricas
Acesse o Firebase Console:
- App Hosting > Analytics
- Veja requisições/s, latência, erros, etc.

## Custos Estimados

**Firebase App Hosting** usa o mesmo pricing do Cloud Run:

- **Tier gratuito**:
  - 2 milhões de requisições/mês
  - 180,000 vCPU-segundos/mês
  - 360,000 GiB-segundos de memória/mês

- **Após tier gratuito**:
  - ~$0.00002400/requisição
  - $0.00001800/vCPU-segundo
  - $0.00000200/GiB-segundo

**Exemplo**: Para 1 milhão de requisições extras/mês ≈ $24

## Troubleshooting

### Build falhou
1. Verifique se o build funciona localmente:
   ```bash
   npm run build
   npm run serve:ssr
   ```

2. Verifique os logs do build:
   ```bash
   firebase apphosting:backends:logs --filter="BUILD"
   ```

3. Certifique-se que `package.json` tem o script `build`

### Sitemap não atualiza
O sitemap é gerado dinamicamente pelo servidor SSR. Se não estiver atualizando:

1. Verifique se o deploy SSR está funcionando:
   ```bash
   curl https://seu-dominio.web.app/
   ```

2. Limpe o cache do navegador ou teste em modo anônimo

3. Verifique os logs do servidor:
   ```bash
   firebase apphosting:backends:logs --filter="/sitemap.xml"
   ```

### Cold starts lentos
Se a primeira requisição estiver lenta (cold start):

1. Edite `apphosting.yaml`:
   ```yaml
   runConfig:
     minInstances: 1  # Mantém sempre 1 instância ativa
   ```

2. **Atenção**: Isso aumenta os custos (cobrança 24/7)

### Erros de permissão
```bash
# Re-autentique
firebase login --reauth

# Verifique permissões do projeto
firebase projects:list
```

## Domínio Customizado

Para adicionar um domínio customizado:

1. No Firebase Console: App Hosting > Custom domains
2. Clique em "Add custom domain"
3. Siga as instruções para configurar DNS
4. Aguarde verificação (pode levar até 24h)

## CI/CD Automático

Firebase App Hosting já inclui CI/CD integrado! Cada push faz deploy automaticamente.

Para configurar:

1. **GitHub Integration** (já configurado via Console):
   - Cada push na branch principal faz deploy automaticamente
   - PRs criam ambientes de preview automaticamente

2. **Configurar branches específicas**:
   ```bash
   firebase apphosting:backends:update \
     --branch=production \
     --auto-deploy
   ```

3. **Notificações**:
   - Configure webhooks para Slack/Discord
   - Firebase > Project Settings > Integrations

## Diferenças entre App Hosting e Hosting tradicional

| Recurso | App Hosting | Hosting + Cloud Run |
|---------|-------------|---------------------|
| Setup SSR | Automático | Manual (Dockerfile) |
| Deploy | Git push | Build + gcloud deploy |
| Preview PRs | Automático | Manual |
| Rollback | 1 comando | Múltiplos passos |
| Logs | Integrado | Console separado |
| Configuração | apphosting.yaml | Dockerfile + firebase.json |

## Suporte

Para problemas, consulte:
- [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)
- [Angular SSR com Firebase](https://firebase.google.com/docs/app-hosting/frameworks/angular)
- [GitHub - Exemplos](https://github.com/FirebaseExtended/firebase-framework-tools)
