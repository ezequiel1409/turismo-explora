# Turismo Explora - Cotizador

Aplicación React + Vite para crear cotizaciones de viajes y descargarlas como PDF.

## Desarrollo local

```bash
npm install
npm run dev
```

## Publicación

El workflow de GitHub Actions publica automáticamente el sitio al recibir un push a `main`.

En el repositorio de GitHub, activá **Settings > Pages > Build and deployment > Source: GitHub Actions**. Después vinculá el remoto y subí el commit:

```bash
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```
