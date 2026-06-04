# Boilerplate de API Monorepo - Plano de Implementacao

> **Para agentes:** se este plano for executado depois, a implementacao deve ser feita por tarefas pequenas e verificaveis.

**Problema:** transformar o repositorio atual em um boilerplate reutilizavel para pequenas APIs de estudo, com autenticacao JWT, validacao de entrada com Zod e compartilhamento de contratos/tipagens entre backend e frontend.

**Abordagem escolhida:** reorganizar o repositorio para um monorepo mais padronizado com `apps/api`, `apps/web` e `packages/contracts`, usando workspace na raiz e contratos Zod compartilhados. Isso aumenta um pouco o esforco inicial, mas deixa a base mais didatica e mais reaproveitavel para futuras pequenas APIs.

**Stack alvo:** pnpm workspace, TypeScript, Express, Next.js, Zod, jsonwebtoken, Axios e testes basicos para os contratos e para o backend.

---

## 1. Estado atual do repositorio

### Estrutura
- O repositorio tem duas aplicacoes separadas: `backend/` e `frontend/`.
- Nao existe `package.json` nem `pnpm-workspace.yaml` na raiz do repositorio; hoje ele ainda nao funciona como monorepo centralizado.
- Existe um `pnpm-workspace.yaml` dentro de `frontend/`, o que nao organiza o repositorio inteiro.

### Backend
- Usa Express com TypeScript.
- Ja existe middleware JWT em `backend/src/middleware/authMiddleware.ts`.
- Ja existe validacao com Zod em `backend/src/services/validate.ts`.
- A rota `/login` usa `validate(schemaLogin)` e a rota `/perfil` usa `verifyJWT`.

### Frontend
- Usa Next.js com TypeScript.
- Possui uma instancia Axios em `frontend/src/api/axiosInstance.ts`.
- O frontend adiciona `Authorization` via interceptor, mas nao compartilha contratos/tipos com o backend.

### Lacunas atuais para virar boilerplate
- Segredo JWT hardcoded no codigo.
- Validacao de body ainda acoplada e com erros artificiais (`throw new Error(...)`) no servico `validate`.
- Schemas e tipos nao estao centralizados em um pacote compartilhado.
- Falta organizacao de modulos, padrao de resposta de erro, configuracao de ambiente e scripts de workspace.
- O backend nao exibe um padrao claro de testes, build e distribuicao para reutilizacao.

## 2. Objetivo arquitetural

Ao final, o boilerplate deve permitir:

1. subir backend e frontend a partir da raiz;
2. proteger rotas com middleware JWT reutilizavel;
3. validar `body`, `params` e `query` com Zod;
4. compartilhar schemas e tipos entre front e back;
5. servir como base simples para varias APIs pequenas de estudo.

## 3. Abordagens possiveis

### Opcao A - Workspace simples com pacote compartilhado
- Criar workspace na raiz.
- Manter `backend/` e `frontend/` como apps.
- Adicionar `packages/contracts` para Zod schemas, tipos inferidos e possiveis helpers de resposta.

**Vantagens**
- Menor curva de aprendizado.
- Pouca mudanca estrutural.
- Resolve diretamente JWT, validacao e compartilhamento de contratos.

**Desvantagens**
- Menos automacao de cache/pipeline do que uma stack com Turborepo.

### Opcao B - Workspace com `apps/` e `packages/` (**escolhida**)
- Reorganizar o repositorio para `apps/api`, `apps/web` e `packages/contracts`.
- Ja preparar tambem `packages/config` para tsconfig e lint compartilhados.

**Vantagens**
- Estrutura mais padronizada para crescimento.
- Excelente para ensinar separacao entre apps e pacotes.

**Desvantagens**
- Exige mais refatoracao logo no inicio.
- Pode ser complexidade extra para um boilerplate voltado a estudos pequenos.

### Opcao C - Boilerplate focado so em backend
- Compartilhar contratos Zod apenas para consumo externo futuro.
- Deixar frontend como exemplo opcional, nao como parte central da base.

**Vantagens**
- Menor superficie.
- Foco total em API.

**Desvantagens**
- Nao atende tao bem ao objetivo de compartilhar tipagens entre front e back dentro do mesmo estudo.

## 4. Direcao definida

Seguir com a **Opcao B** agora:
- workspace na raiz;
- migracao de `backend/` para `apps/api`;
- migracao de `frontend/` para `apps/web`;
- criacao de `packages/contracts` como primeira biblioteca compartilhada;
- espaco futuro para `packages/config` se quisermos centralizar ESLint, tsconfig e outras convencoes.

Isso deixa o boilerplate mais consistente como monorepo e facilita ensinar separacao entre aplicacoes e pacotes desde o inicio.

## 5. Fases do trabalho

### Fase 1 - Consolidar o monorepo
**Objetivo:** reorganizar a raiz do repositorio e estabelecer a estrutura padrao de monorepo.

**Arquivos esperados**
- Criar: `package.json` na raiz
- Criar: `pnpm-workspace.yaml` na raiz
- Mover: `backend/` para `apps/api/`
- Mover: `frontend/` para `apps/web/`
- Ajustar: `apps/api/package.json`
- Ajustar: `apps/web/package.json`

**Entregas**
- Scripts de workspace para `dev`, `build`, `lint` e `test`.
- Padrao unico de gerenciador de pacotes.
- Remocao da configuracao de workspace isolada do frontend.
- Estrutura `apps/` e `packages/` consolidada.

### Fase 2 - Extrair contratos compartilhados com Zod
**Objetivo:** centralizar schemas e tipos usados pelo backend e pelo frontend.

**Arquivos esperados**
- Criar: `packages/contracts/package.json`
- Criar: `packages/contracts/src/auth.ts`
- Criar: `packages/contracts/src/common.ts`
- Criar: `packages/contracts/src/index.ts`
- Ajustar: `apps/api/src/index.ts`
- Ajustar: `apps/web/src/...` onde houver formularios e chamadas HTTP

**Entregas**
- Schema de login compartilhado.
- Tipos inferidos com `z.infer`.
- Contratos de request/response padronizados.

### Fase 3 - Padronizar validacoes do backend
**Objetivo:** transformar a validacao atual num middleware reutilizavel e confiavel.

**Arquivos esperados**
- Ajustar: `apps/api/src/services/validate.ts`
- Criar: `apps/api/src/middleware/validateRequest.ts` ou manter o servico atual com responsabilidade bem definida
- Criar: `apps/api/src/utils/formatZodError.ts`

**Entregas**
- Validacao de `body`, `params` e `query`.
- Resposta de erro consistente.
- Remocao dos erros artificiais hoje existentes no codigo.

### Fase 4 - Fortalecer autenticacao JWT
**Objetivo:** tornar o middleware JWT reutilizavel e seguro para o boilerplate.

**Arquivos esperados**
- Ajustar: `apps/api/src/middleware/authMiddleware.ts`
- Ajustar: `apps/api/src/controllers/authController.ts`
- Criar: `apps/api/src/config/env.ts`
- Criar: `apps/api/.env.example`
- Ajustar: `apps/api/src/types.ts` ou criar tipos dedicados para auth

**Entregas**
- Segredo JWT vindo de ambiente.
- Tipagem do payload autenticado.
- Middleware desacoplado da rota de exemplo.
- Funcoes auxiliares para assinar e verificar token.

### Fase 5 - Organizar a estrutura da API para reuso
**Objetivo:** sair de um `index.ts` concentrando tudo e adotar uma base mais didatica.

**Arquivos esperados**
- Ajustar: `apps/api/src/index.ts`
- Criar: `apps/api/src/app.ts`
- Criar: `apps/api/src/routes/index.ts`
- Criar: `apps/api/src/routes/auth.routes.ts`
- Criar: `apps/api/src/routes/profile.routes.ts`
- Criar: `apps/api/src/controllers/`
- Criar: `apps/api/src/schemas/` apenas se algum schema permanecer exclusivo da API

**Entregas**
- Separacao entre app, rotas, controllers, middlewares e contratos.
- Exemplo claro para replicar novos modulos.

### Fase 6 - Integrar frontend com contratos compartilhados
**Objetivo:** fazer o frontend consumir os mesmos schemas/tipos do backend.

**Arquivos esperados**
- Ajustar: `apps/web/src/api/axiosInstance.ts`
- Criar ou ajustar: `apps/web/src/pages/...` ou futuras paginas/formularios
- Criar: `apps/web/src/lib/` para helpers de chamada API, se necessario

**Entregas**
- Tipos de request/response importados de `packages/contracts`.
- Validacao de formularios com os mesmos contratos onde fizer sentido.
- Menos duplicacao entre front e back.

### Fase 7 - Adicionar itens essenciais de boilerplate
**Objetivo:** fechar os pontos minimos para reaproveitamento em varias APIs pequenas.

**Itens essenciais recomendados**
1. Configuracao por ambiente (`.env.example`, loader e validacao das envs).
2. Tratamento padrao de erros HTTP.
3. Healthcheck (`/health`) para diagnostico rapido.
4. Estrutura de modulos/rotas pronta para copiar.
5. Testes minimos para middleware JWT, validacao Zod e contratos compartilhados.
6. Documentacao curta de como clonar, instalar, rodar e iniciar um novo modulo.
7. Cliente HTTP do frontend padronizado.
8. Padrao de respostas (`success`, `message`, `data`, `errors`) para facilitar ensino.

**Itens opcionais, nao obrigatorios na primeira versao**
- Docker.
- ORM e banco ja plugado.
- Rate limit.
- Refresh token.
- CI.

Para um boilerplate de estudo, o foco inicial deve ser clareza e repetibilidade, nao cobertura completa de cenarios de producao.

## 6. Ordem sugerida de execucao

1. Migrar `backend/` e `frontend/` para `apps/api` e `apps/web`.
2. Criar workspace na raiz e consolidar scripts.
3. Extrair `packages/contracts`.
4. Corrigir e generalizar a validacao Zod.
5. Refatorar auth JWT para usar ambiente e tipos compartilhados.
6. Reorganizar a API em camadas simples.
7. Atualizar frontend para consumir contratos compartilhados.
8. Adicionar testes e documentacao minima.

## 7. Riscos e cuidados

- Nao misturar schema compartilhado com regra exclusiva de infraestrutura do backend.
- Evitar acoplamento do frontend a detalhes internos da API; compartilhar contratos, nao implementacao.
- Manter o boilerplate pequeno: tudo que nao for recorrente nas aplicacoes de estudo deve entrar como opcional.
- Ao mover arquivos, preservar a simplicidade do fluxo de aula e dos exemplos.

## 8. Decisao registrada

Ficou definido que o boilerplate sera estruturado desde ja como:

- `apps/api`
- `apps/web`
- `packages/contracts`

Com isso, o plano passa a priorizar uma base mais padronizada de monorepo, mesmo com um custo inicial maior de reorganizacao.
