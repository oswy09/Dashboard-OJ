export interface CopyStage {
  id: string;
  name: string;
  text: string;
}

export interface NichoCopys {
  nichoId: string;
  stages: CopyStage[];
}

export const copys: NichoCopys[] = [
  {
    nichoId: 'hoteles',
    stages: [
      {
        id: 'contacto',
        name: 'Contacto Frío',
        text: `Hola, soy especialista en diseño web para hoteles y he notado que [Nombre del Cliente] tiene un gran potencial que podría multiplicarse con una presencia digital optimizada.

Hoteles similares al suyo han aumentado sus reservas directas hasta un 40% con una web profesional que elimina la dependencia de las OTAs y sus comisiones del 15-20%.

¿Te gustaría ver cómo podría verse tu hotel con una plataforma que convierta visitantes en huéspedes? Puedo prepararte una propuesta personalizada sin compromiso.`
      },
      {
        id: 'demo',
        name: 'Envío Demo',
        text: `¡Perfecto! He preparado una propuesta personalizada para [Nombre del Cliente] que te va a encantar.

Aquí puedes ver exactamente qué incluye tu proyecto, desde el sistema de reservas hasta la optimización SEO:

[Link de Propuesta]

He diseñado esto pensando específicamente en las necesidades de tu hotel. ¿Cuándo podríamos agendar una breve llamada de 15 minutos para revisar los detalles?`
      },
      {
        id: 'cierre',
        name: 'Cierre/Onboarding',
        text: `¡Excelente decisión! Estoy emocionado de trabajar en el proyecto de [Nombre del Cliente].

Para comenzar y entregarte un resultado espectacular, necesito que me compartas:

✅ Logo en alta calidad (formato PNG o AI)
✅ Fotos profesionales de las habitaciones e instalaciones
✅ Textos actuales de tu web (si los tienes)
✅ Acceso a redes sociales para integración
✅ Colores corporativos o guía de marca

¿Podrías enviarme estos materiales en los próximos 2-3 días? Mientras tanto, prepararé el ambiente de desarrollo y comenzaremos oficialmente el [FECHA].`
      }
    ]
  },
  {
    nichoId: 'spa',
    stages: [
      {
        id: 'contacto',
        name: 'Contacto Frío',
        text: `Hola, he estado investigando spas de alto nivel en la zona y [Nombre del Cliente] destaca por su calidad, pero creo que tu presencia digital no refleja la experiencia premium que ofreces.

Los spas que invierten en una web profesional con sistema de reservas online incrementan sus citas hasta un 50% y reducen cancelaciones con recordatorios automáticos.

¿Te interesaría ver una propuesta de cómo podríamos elevar tu marca digital al nivel de tus servicios? Te la preparo sin compromiso.`
      },
      {
        id: 'demo',
        name: 'Envío Demo',
        text: `Como prometí, aquí está tu propuesta personalizada para [Nombre del Cliente].

He diseñado un plan que incluye desde el catálogo de tratamientos hasta la venta de bonos online:

[Link de Propuesta]

Esta solución está pensada para reflejar la serenidad y profesionalismo de tu spa. ¿Te parece si conversamos 15 minutos esta semana para resolver cualquier duda?`
      },
      {
        id: 'cierre',
        name: 'Cierre/Onboarding',
        text: `¡Fantástico! Vamos a crear algo hermoso para [Nombre del Cliente].

Para empezar con el pie derecho, necesito que me facilites:

✅ Logo y elementos de marca
✅ Fotos profesionales de instalaciones y tratamientos
✅ Menú completo de servicios con descripciones y precios
✅ Información sobre profesionales/terapeutas
✅ Paleta de colores de tu marca

Con estos materiales en mano, podemos lanzar tu nueva plataforma en tiempo récord. ¿Los tendrías disponibles esta semana?`
      }
    ]
  },
  {
    nichoId: 'gastronomico',
    stages: [
      {
        id: 'contacto',
        name: 'Contacto Frío',
        text: `Hola, soy desarrollador especializado en restaurantes y vi que [Nombre del Cliente] tiene excelentes reseñas, pero podrías estar captando muchos más comensales con una presencia digital optimizada.

Restaurantes similares que implementaron pedidos online y reservas digitales vieron un aumento del 35% en ventas durante el primer trimestre.

La gente busca restaurantes desde el celular y si no encuentran un menú claro y forma de reservar fácilmente, van a la competencia. ¿Te gustaría ver una propuesta sin compromiso?`
      },
      {
        id: 'demo',
        name: 'Envío Demo',
        text: `Te preparé algo especial para [Nombre del Cliente]. Una propuesta que hará que tu restaurante sea imposible de ignorar online:

[Link de Propuesta]

Incluye todo desde el menú digital interactivo hasta integración con apps de delivery. ¿Cuándo tendrías 15 minutos para revisar juntos los detalles?`
      },
      {
        id: 'cierre',
        name: 'Cierre/Onboarding',
        text: `¡Genial! Estoy emocionado de trabajar en el proyecto de [Nombre del Cliente].

Para crear una experiencia digital tan deliciosa como tu comida, necesito:

✅ Logo y elementos visuales de marca
✅ Fotos profesionales de platos (¡esto es crucial!)
✅ Menú completo con descripciones y precios
✅ Historia del restaurante/chef
✅ Colores corporativos

¿Podrías tener estos materiales listos en los próximos días? Así arrancamos con todo y cumplimos el cronograma de entrega.`
      }
    ]
  }
];
