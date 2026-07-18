# Birdwatching at La Vieja Adventures - Website

## 📋 Descripción

Página web profesional para el tour de observación de aves "Birdwatching at La Vieja Adventures" en Sucre, San Carlos, Alajuela, Costa Rica.

Construida con **Next.js 14**, **React 18**, **TypeScript** y **Tailwind CSS**.

## 🚀 Instalación y Setup

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar o descargar el proyecto**
```bash
cd BirdWatching-LVA
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Desarrollo local**
```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Build para producción**
```bash
npm run build
npm start
# o
yarn build
yarn start
```

## 📝 Configuración

### TODO: Elementos que requieren configuración

1. **Números de contacto** (`lib/data.ts` - Línea ~12)
   - Reemplaza `50687654321` con el número WhatsApp real
   - Actualiza teléfono, email e Instagram

2. **Números de WhatsApp** (en todos los componentes)
   - Busca `50687654321` y reemplaza con el número correcto
   - Considera usar variable de entorno

3. **Precios** (`lib/data.ts` - Sección modalidades)
   - Reemplaza placeholders de precios con valores reales
   - Formato: `₡35,000` / `$65`

4. **Imágenes** (componentes)
   - Hero section: Reemplazar fondo de bosque
   - Agregar imágenes reales de aves si es necesario
   - Considerar usar servicio como Cloudinary

5. **Enlaces de redes sociales** (Footer)
   - Actualizar URLs de Instagram y otras plataformas

### Estructura de archivos

```
BirdWatching-LVA/
├── app/
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── Header.tsx          # Navegación
│   ├── HeroBirdwatching.tsx
│   ├── TourIntro.tsx
│   ├── ModalitiesSection.tsx
│   ├── BirdingSpotsSection.tsx
│   ├── IncludesSection.tsx
│   ├── WhatToBringSection.tsx
│   ├── BirdSpeciesSection.tsx
│   ├── PhotographySection.tsx
│   ├── SustainabilitySection.tsx
│   ├── ScheduleSection.tsx
│   ├── FAQSection.tsx
│   ├── BookingCTA.tsx
│   ├── WhatsAppButton.tsx
│   └── Footer.tsx
├── lib/
│   └── data.ts             # Contenido y constantes
├── public/                 # Archivos estáticos (imágenes, etc.)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🎨 Personalización

### Colores

Los colores personalizados están definidos en `tailwind.config.js`:

- **forest**: `#1d5d3b` (verde oscuro principal)
- **moss**: `#6b8e6f` (verde musgo)
- **beige**: `#f5f0e8` (beige natural)
- **earth**: `#8b6f47` (café tierra)
- **sunrise**: `#f4d03f` (amanecer/dorado)

### Tipografía

- **Sans**: Inter (cuerpo de texto)
- **Serif**: Playfair Display (títulos)

Las fuentes se cargan desde Google Fonts en `app/layout.tsx`.

### Contenido

Todo el contenido se centraliza en `lib/data.ts`. Puedes:

- Editar textos
- Agregar/remover modalidades
- Actualizar aves destacadas
- Modificar preguntas frecuentes
- Cambiar precios y horarios

Estructura preparada para **bilingüe** (español/inglés).

## 🔧 Características

✅ **Responsive Design** - Optimizado para móvil, tablet y desktop
✅ **SEO Ready** - Meta tags, open graph, keywords
✅ **Animaciones suaves** - Fade-in, slide-up
✅ **CTA en WhatsApp** - Botón flotante + múltiples CTAs
✅ **Accesibilidad** - ARIA labels, contraste, navegación por teclado
✅ **Performance** - Optimizado con Next.js
✅ **TypeScript** - Code safety
✅ **Tailwind CSS** - Estilos consistentes y mantenibles

## 📊 Secciones incluidas

1. **Hero** - Banner principal con CTA
2. **Intro** - Presentación del tour
3. **Modalidades** - 5 tipos de tours
4. **Rutas** - 5 estaciones de observación
5. **Qué incluye** - Detalles de la experiencia
6. **Qué traer** - Lista de recomendaciones
7. **Aves** - Categorías de especies
8. **Fotografía** - Tour especializado
9. **Sostenibilidad** - Compromiso ambiental
10. **Horarios** - Mejores horas
11. **FAQ** - Preguntas frecuentes
12. **CTA Principal** - Reservas
13. **Footer** - Información y enlaces

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Otras opciones
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Heroku

## 📱 Mobile First

La página está diseñada con enfoque **mobile-first**:

- Botones grandes y clickeables
- Texto legible en pequeñas pantallas
- Navegación simplificada en móvil
- Imágenes responsivas
- Botón flotante de WhatsApp optimizado

## 🔒 Variables de entorno (Opcional)

Para mayor seguridad con números sensibles, puedes usar `.env.local`:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=50687654321
NEXT_PUBLIC_INSTAGRAM=@lavieja.adventures
NEXT_PUBLIC_EMAIL=info@lavieja-adventures.com
```

Luego importa en componentes con `process.env.NEXT_PUBLIC_*`

## 🛠️ Mantenimiento

### Actualizar contenido

1. Abre `lib/data.ts`
2. Modifica la sección correspondiente
3. Los cambios son inmediatos en desarrollo
4. En producción, redeploy automático

### Agregar nuevas secciones

1. Crea nuevo componente en `/components`
2. Importa en `app/page.tsx`
3. Agrega sección en el flujo de la página

### Optimizar imágenes

- Usa formato WebP cuando sea posible
- Comprime imágenes antes de subir
- Considera CDN externo

## ⚠️ Comentarios importantes

- Los números de WhatsApp están marcados como `TODO` para facilitar búsqueda
- Placeholder de precios listos para reemplazar
- Disclaimer sobre no garantizar avistamientos incluido
- Disclaimers de lluvia y condiciones naturales considerados

## 📚 Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 📞 Soporte

Para preguntas sobre la estructura o funcionalidades, consulta la documentación oficial de Next.js y Tailwind CSS.

## 📄 Licencia

Proyecto privado para La Vieja Adventures.

---

**Última actualización**: 2024
**Versión**: 1.0.0
# Birdwatching-LVA
