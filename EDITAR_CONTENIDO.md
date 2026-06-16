# 📝 Guía de Edición de Contenido

## Dónde editar cada cosa

### Información de contacto
**Archivo**: `lib/data.ts` (línea ~12)

```typescript
company: {
  phone: '+506 8765-4321',        // ← Tu teléfono
  whatsapp: '50687654321',         // ← Sin +, solo números
  email: 'info@example.com',       // ← Tu email
  instagram: '@tuinstagram',       // ← Tu Instagram
}
```

### Textos principales
**Archivo**: `lib/data.ts`

Busca la sección que necesites:
- `hero` - Título y subtítulo del banner
- `intro` - Introducción del tour
- `modalities` - Descripción de modalidades
- `birds` - Información sobre aves
- `faq` - Preguntas y respuestas

### Modalidades del tour
**Archivo**: `lib/data.ts` - Sección `modalities.items`

```typescript
{
  id: 'classic',
  name: 'Birdwatching Clásico',
  priceEsBRL: '₡35,000',    // ← Cambiar precio
  priceUSD: '$65',           // ← Cambiar precio
  duration: '2.5 - 3 horas', // ← Cambiar duración
  // ... más campos
}
```

### Estaciones de observación
**Archivo**: `lib/data.ts` - Sección `birdingSpots.spots`

Cada spot tiene:
- `name` - Nombre del mirador
- `description` - Descripción
- `features` - Características
- `commonBirds` - Aves frecuentes

### Aves destacadas
**Archivo**: `lib/data.ts` - Sección `birds.categories`

```typescript
{
  id: 'trogons',
  name: 'Trogones',
  emoji: '🦜',
  description: 'Tu descripción aquí',
  species: ['Especie 1', 'Especie 2'],
  season: 'Todo el año',
}
```

### Preguntas frecuentes
**Archivo**: `lib/data.ts` - Sección `faq`

```typescript
{
  question: '¿Tu pregunta?',
  answer: 'Tu respuesta aquí',
}
```

### Información del footer
**Archivo**: `lib/data.ts` - Sección `footer`

Aquí puedes editar:
- Enlaces del footer
- Información de contacto
- Texto legal

### Horarios disponibles
**Archivo**: `lib/data.ts` - Sección `schedule.times`

```typescript
{
  time: '5:30 a.m.',
  label: 'Extra temprano',
  suitable: true,  // true = recomendado, false = no recomendado
}
```

## Cómo agregar nuevas modalidades

1. Abre `lib/data.ts`
2. En `modalities.items`, agrega un nuevo objeto:

```typescript
{
  id: 'nueva-modalidad',
  name: 'Nombre del tour',
  icon: '🦅',
  description: 'Descripción breve',
  details: [
    'Detalle 1',
    'Detalle 2',
  ],
  audience: 'Público objetivo',
  duration: 'X horas',
  physicalLevel: 'Nivel físico',
  cta: 'Texto del botón',
  priceEsBRL: '₡XX,XXX',
  priceUSD: '$XXX',
}
```

## Cómo agregar nuevas aves

1. Abre `lib/data.ts`
2. En `birds.categories`, agrega:

```typescript
{
  id: 'identificador-unico',
  name: 'Nombre de la categoría',
  emoji: '🦜',
  description: 'Descripción de esta categoría de aves',
  species: [
    'Especie 1',
    'Especie 2',
    'Especie 3',
  ],
  season: 'Todo el año', // o 'Invierno', 'Verano', etc.
}
```

## Cómo cambiar estilos

### Colores
**Archivo**: `tailwind.config.js`

```javascript
colors: {
  'forest': '#1d5d3b',      // Verde principal
  'moss': '#6b8e6f',        // Verde musgo
  'beige': '#f5f0e8',       // Beige natural
  'earth': '#8b6f47',       // Café tierra
  'sunrise': '#f4d03f',     // Dorado/amanecer
}
```

### Tipografía
**Archivo**: `app/layout.tsx`

En el link de Google Fonts, puedes cambiar las fuentes:
```html
<link href="https://fonts.googleapis.com/css2?family=TU_FUENTE:wght@400;600;700&display=swap" rel="stylesheet" />
```

## Cómo cambiar el contenido de una sección completa

### Ejemplo: Cambiar la sección "Qué traer"

1. Abre `lib/data.ts`
2. Busca `whatToBring`
3. Modifica los campos:

```typescript
whatToBring: {
  title: 'Tu nuevo título',
  subtitle: 'Tu nuevo subtítulo',
  items: [
    {
      category: 'Nueva categoría',
      items: ['Elemento 1', 'Elemento 2'],
    },
  ],
}
```

## Verificar cambios

### En desarrollo
```bash
npm run dev
```
Abre http://localhost:3000 - Los cambios en `lib/data.ts` se reflejan automáticamente

### En producción
```bash
npm run build
npm start
```

## Agregar nueva sección completa

1. Crea componente en `components/MiSeccion.tsx`
2. Importa en `app/page.tsx`
3. Agrega en el JSX principal
4. Opcionalmente, agregar datos en `lib/data.ts`

## Traducción a inglés

`lib/data.ts` tiene estructura `es:` y `en:`. Para agregar inglés:

```typescript
export const siteContent = {
  es: { /* contenido en español */ },
  en: { /* agregar aquí contenido en inglés */ },
};
```

Ejemplo:
```typescript
en: {
  hero: {
    title: 'Birdwatching at La Vieja Adventures',
    subtitle: 'A guided experience to observe, photograph and connect with birds in Sucre, San Carlos.',
    // ...
  },
  // ...
}
```

## Tips importantes

✓ **Guarda con Ctrl+S** después de editar `lib/data.ts`
✓ **Recarga la página** (F5) para ver cambios en desarrollo
✓ **Escapa las comillas** usando `\"` o comillas simples
✓ **Verifica la sintaxis** - TypeScript te avisará de errores
✓ **No borres propiedades** - Puede causar errores

## Búsqueda rápida

Usa Ctrl+F en el editor para encontrar:
- Números de WhatsApp: `50687654321`
- Precios: `₡` o `$`
- Secciones: `title` o `subtitle`

## En caso de error

1. **Error de compilación**: Revisa errores en la terminal
2. **No se ve el cambio**: Recarga la página (Ctrl+Shift+R para limpia)
3. **Errores de TypeScript**: Verifica que no falten comillas o propiedades

---

¿Necesitas ayuda? Revisa los archivos de ejemplo en `lib/data.ts`.
