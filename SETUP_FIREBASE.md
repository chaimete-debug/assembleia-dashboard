# Configuração Firebase para controlo real da data

## O que esta versão faz
- A data da assembleia vem de um documento central no Firestore.
- Apenas administradores autenticados podem alterar essa data.
- Os restantes utilizadores ficam com acesso somente de leitura.

## Ficheiros
- index_admin_firebase.html
- firestore.rules

## 1) Activar Firebase
No Firebase Console:
- Authentication -> activar Email/Password
- Firestore Database -> criar base de dados

## 2) Preencher configuração
No ficheiro index_admin_firebase.html, substitua os valores em FIREBASE_CONFIG.

## 3) Publicar as regras
No painel de Rules do Firestore, cole o conteúdo de firestore.rules e publique.

## 4) Criar utilizador administrador
Crie o utilizador em Authentication.

## 5) Criar perfil admin no Firestore
Colecção: adminUsers
Documento: UID_DO_ADMIN

Conteúdo:
{
  "role": "admin",
  "canEditAssemblyDate": true,
  "active": true
}

## 6) Documento central usado pela app
Colecção: appConfig
Documento: assembleiaDistrital

A app grava aqui:
{
  "assemblyDate": "2026-04-11",
  "updatedAt": server timestamp,
  "updatedByUid": "...",
  "updatedByEmail": "..."
}

## 7) Publicação
Renomeie index_admin_firebase.html para index.html no projecto Vercel/GitHub, se quiser que esta seja a página principal.

## Nota
Sem Firebase configurado, a página fica em modo de leitura e não grava a data.
