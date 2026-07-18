# 🚀 Quick Start - Birdwatching La Vieja Adventures

## Comenzar en 3 pasos

### 1. Instalar y ejecutar
```bash
npm install
npm run dev
```
Abre http://localhost:3000

### 2. Configurar información de contacto
Abre `lib/data.ts` y busca `TODO`:
- Reemplaza `50687654321` con tu número de WhatsApp
- Actualiza email, teléfono e Instagram

### 3. Agregar imágenes (opcional)
- Crea carpeta `public/images/`
- Agrega imágenes de aves, bosque, miradores
- Referencia en componentes

## 📋 TODO List para producción

### Contacto
- [ ] Número de WhatsApp correcto en `lib/data.ts`
- [ ] Email de contacto
- [ ] Número telefónico
- [ ] Perfil de Instagram
- [ ] Coordenadas GPS (para Google Maps si lo deseas)

### Contenido
- [ ] Revisar y confirmar precios de todos los tours
- [ ] Actualizar horarios según disponibilidad real
- [ ] Confirmar información de aves (si es necesario)
- [ ] Revisar todas las descripciones

### Imágenes
- [ ] Foto de hero/fondo
- [ ] Fotos de cada modalidad de tour (optional)
- [ ] Fotos de estaciones de observación
- [ ] Fotos de aves destacadas (opcional)

### SEO & Analytics
- [ ] Configurar Google Analytics (si lo deseas)
- [ ] Agregar Schema.org markup
- [ ] Configurar Google Search Console
- [ ] Configurar Open Graph images

### Deployment
- [ ] Elegir plataforma (Vercel, Netlify, etc.)
- [ ] Configurar dominio personalizado
- [ ] Configurar SSL
- [ ] Establecer redirects si es necesario

## 🎨 Personalización rápida

### Cambiar colores principales
Edita `tailwind.config.js` en la sección `colors`

### Cambiar tipografía
Edita `app/layout.tsx` en la sección de Google Fonts

### Cambiar contenido de secciones
Todo está en `lib/data.ts` - estructura clara y bien organizada

## 📱 Testing

### Responsive
```bash
# Abre DevTools (F12) y prueba diferentes tamaños
```

### WhatsApp buttons
- Todos los botones abren WhatsApp
- Verifica que tu número sea correcto

### Performance
```bash
# Build
npm run build

# Analizar tamaño
npm run build -- --analyze
```

## 🚀 Deploy a Vercel (recomendado)

```bash
npm i -g vercel
vercel
```

Sigue el asistente. ¡Listo en minutos!

## 📞 Debugging

### No funciona WhatsApp
- Verifica número sin `+` al inicio
- Formato: `50687654321` (no `+506 8765-4321`)

### Elementos no se muestran
- Revisa la consola (F12)
- Verifica que tengas todas las dependencias instaladas

### Build falla
- Elimina `node_modules` y `.next`
- Vuelve a correr `npm install && npm run build`

## 📚 Recursos útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hooks](https://react.dev/reference/react/hooks)

---

¿Preguntas? Revisa el README.md completo.

Happy coding! 🦅🌿
