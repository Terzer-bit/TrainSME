export const emailCases = [
  {
    id: 1,
    subject: "Security Alert: Suspicious Login Attempt",
    senderName: "Microsoft Security",
    senderEmail: "no-reply@microsoft-security.com",
    date: "lun, 15 abr, 08:43 (hoy)",
    body: `We noticed an unusual sign-in attempt from a new device to your account.\n 
    Sign-in details:\n
    Country/Region: Russia/Moscow\n
    IP Address: 102.225.77.235\n
    Date: lun, 15 abr 2025 08:41:34\n
    Platform: Windows 10\n
    Browser: Firefox\n
    Please verify your account to prevent unauthorized access.`,
    links: [{ text: "Verify Activity", href: "http://nicrosoft-acount-authentication.com" }],
    solution: "Phishing",
    explanation: "The domain looks like it's from Microsoft, but it's actually fake. Microsoft only uses addresses that end in microsoft.com. Also, the link it redirects to has a misspelling, there's an 'n' in place of part of 'Microsoft', and it uses 'http' instead of the secure 'https', which makes it unsafe."
  },
  {
    id: 2,
    subject: "🎁 You've Been Selected for a Free iPhone 15!",
    senderName: "Apple Giveaway",
    senderEmail: "promos@apple-giveaway.com",
    date: "dom, 14 abr, 15:12 (ayer)",
    body: `You've won an iPhone!\n\n Claim it now before the 24-hour window closes.`,
    links: [{ text: "Claim Now", href: "http://free-iphone-claim.com" }],
    image: "/iphone.jpg",
    solution: "Phishing",
    explanation: "Be careful with messages offering free gifts, they're often phishing scams. Scammers usually add a time limit to make you feel rushed and more likely to click without thinking."
  },
  // {
  //   id: 3,
  //   subject: "Unusual Activity Detected",
  //   senderName: "Bank of Nowhere",
  //   senderEmail: "alerts@bankofnowhere.com",
  //   date: "lun, 15 abr, 09:30 (hoy)",
  //   body: `Un intento fallido de acceso fue registrado. Revise su cuenta para evitar bloqueos.`,
  //   links: [{ text: "Acceder a cuenta", href: "https://bankofnowhere.com/login" }],
  //   solution: "Safe",
  //   explanation: "Dominio legítimo y contenido coherente con alertas bancarias reales."
  // },
  // {
  //   id: 4,
  //   subject: "You've received a file from Pedro",
  //   senderName: "Google Drive",
  //   senderEmail: "notify@drive-shared.com",
  //   date: "vie, 12 abr, 17:45",
  //   body: `Pedro shared a document with you: 'Team_Payroll_2024.xlsx'.`,
  //   links: [{ text: "Open File", href: "http://drive-fake.com/shared" }],
  //   solution: "Phishing",
  //   explanation: "Dominio falso que intenta imitar a Google Drive."
  // },
  // {
  //   id: 5,
  //   subject: "Factura disponible para descargar",
  //   senderName: "Amazon España",
  //   senderEmail: "facturacion@amazon.es",
  //   date: "jue, 11 abr, 10:01",
  //   body: `Tu factura está lista. Puedes descargarla desde el siguiente enlace.`,
  //   links: [{ text: "Descargar factura", href: "https://amazon.es/factura/12345" }],
  //   solution: "Safe",
  //   explanation: "Dominio legítimo, mensaje típico de Amazon."
  // },
  // {
  //   id: 6,
  //   subject: "Confirmación de acceso desde nuevo dispositivo",
  //   senderName: "LinkedIn",
  //   senderEmail: "security@linkedin.com",
  //   date: "lun, 15 abr, 06:21",
  //   body: `Hemos detectado acceso a tu cuenta desde un nuevo navegador. ¿Fuiste tú?`,
  //   links: [{ text: "Revisar actividad", href: "https://linkedin.com/security" }],
  //   solution: "Safe",
  //   explanation: "Dominio oficial y comportamiento esperable de la plataforma."
  // },
  // {
  //   id: 7,
  //   subject: "🎉 Gana un vale de 500€ de Carrefour",
  //   senderName: "Carrefour Promos",
  //   senderEmail: "promo@carrefour-official.com",
  //   date: "lun, 15 abr, 11:11",
  //   body: `Participa en nuestra encuesta y gana un vale de 500€ para usar en cualquier tienda.`,
  //   links: [{ text: "Participar ahora", href: "http://carrefour-fake.es/encuesta" }],
  //   solution: "Phishing",
  //   explanation: "Dominio sospechoso y promesa exagerada."
  // },
  // {
  //   id: 8,
  //   subject: "Document shared: Quarterly_Report_2023.pdf",
  //   senderName: "Dropbox",
  //   senderEmail: "share@dropboxteam.com",
  //   date: "mié, 10 abr, 13:30",
  //   body: `John Doe shared a file with you.`,
  //   links: [{ text: "View File", href: "https://dropbox.com/s/example" }],
  //   solution: "Safe",
  //   explanation: "Enlace legítimo, mensaje típico de Dropbox."
  // },
  // {
  //   id: 9,
  //   subject: "¡Te hemos detectado ganando dinero online!",
  //   senderName: "CryptoBot",
  //   senderEmail: "noreply@crypto-fastgainz.biz",
  //   date: "mar, 9 abr, 22:50",
  //   body: `Gana hasta 1000€/día desde casa usando esta app.`,
  //   links: [{ text: "Empezar ahora", href: "http://crypto-fastgainz.biz/signup" }],
  //   solution: "Phishing",
  //   explanation: "Lenguaje demasiado bueno para ser verdad + dominio fraudulento."
  // },
  // {
  //   id: 10,
  //   subject: "Tu cuenta será desactivada",
  //   senderName: "Outlook Support",
  //   senderEmail: "support@outlook-help.com",
  //   date: "lun, 15 abr, 12:00",
  //   body: `Tu cuenta ha sido marcada para eliminación. Confirma tu identidad ahora.`,
  //   links: [{ text: "Confirmar cuenta", href: "http://outlook-help.com/verify" }],
  //   solution: "Phishing",
  //   explanation: "Outlook no solicita verificaciones así, y el dominio no es oficial."
  // },
  // {
  //   id: 11,
  //   subject: "Has recibido una transferencia",
  //   senderName: "Banco Central",
  //   senderEmail: "notificaciones@bancocentral.com",
  //   date: "vie, 12 abr, 18:00",
  //   body: `Recibiste una transferencia de 849,32€. Ingresa a tu cuenta para más detalles.`,
  //   links: [{ text: "Ver movimiento", href: "https://bancocentral.com/clientes" }],
  //   solution: "Safe",
  //   explanation: "Mensaje típico de aviso de movimientos bancarios legítimos."
  // },
  // {
  //   id: 12,
  //   subject: "Fallo de seguridad detectado en tu cuenta",
  //   senderName: "Google",
  //   senderEmail: "alertas@googleaccount.com",
  //   date: "lun, 15 abr, 14:30",
  //   body: `Hemos bloqueado un intento sospechoso de inicio de sesión. Revísalo ahora.`,
  //   links: [{ text: "Revisar actividad", href: "http://googleaccount.com/security" }],
  //   solution: "Phishing",
  //   explanation: "Google solo usa cuentas bajo google.com."
  // },
  // {
  //   id: 13,
  //   subject: "Revisa tu contrato digital",
  //   senderName: "RRHH - Empresa X",
  //   senderEmail: "rrhh@empresa-x.com",
  //   date: "mié, 10 abr, 10:00",
  //   body: `Accede al nuevo contrato disponible para su firma digital.`,
  //   links: [{ text: "Ver documento", href: "https://empresa-x.com/docs/contrato123" }],
  //   solution: "Safe",
  //   explanation: "Dominio legítimo y situación común en entornos laborales."
  // },
  // {
  //   id: 14,
  //   subject: "¡Felicitaciones! Tu cupón está listo",
  //   senderName: "Zara Promos",
  //   senderEmail: "promo@zara-cupons.com",
  //   date: "dom, 14 abr, 19:20",
  //   body: `Has sido seleccionado para recibir un cupón de 100€ en Zara. Solo por hoy.`,
  //   links: [{ text: "Activar cupón", href: "http://zara-cupons.com" }],
  //   solution: "Phishing",
  //   explanation: "Zara no hace sorteos de esta forma. Dominio falso."
  // },
  // {
  //   id: 15,
  //   subject: "Tu documento 'Presupuesto 2025.xlsx' ha sido compartido",
  //   senderName: "OneDrive",
  //   senderEmail: "share@onedrive.com",
  //   date: "vie, 12 abr, 09:30",
  //   body: `Haz clic para ver el documento compartido contigo.`,
  //   links: [{ text: "Abrir documento", href: "https://onedrive.live.com/view?id=presupuesto2025" }],
  //   solution: "Safe",
  //   explanation: "Enlace legítimo de Microsoft."
  // },

  // Puedes duplicar la estructura anterior cambiando sujetos, fechas y enlaces
  // para completar hasta 30

];
