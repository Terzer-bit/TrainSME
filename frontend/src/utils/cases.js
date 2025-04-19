export const emailCases = [
  {
    id: 1,
    subject: "Security Alert: Suspicious Login Attempt",
    senderName: "Microsoft Security",
    senderEmail: "no-reply@microsoft-security.com",
    avatar: "/microsoft.jpg",
    date: "lun, 15 abr, 08:43 (hoy)",
    body: `We noticed an unusual sign-in attempt from a new device to your account.\n\n
    Sign-in details:\n
    Country/Region: Russia/Moscow\n
    IP Address: 102.225.77.235\n
    Date: lun, 15 abr 2025 08:41:34\n
    Platform: Windows 10\n
    Browser: Firefox\n\n
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
    avatar: "/apple.png",
    date: "dom, 14 abr, 15:12 (ayer)",
    body: `You've won an iPhone!\n\n Claim it now before the 24-hour window closes or you will lose it forever!`,
    links: [{ text: "Claim your new iPhone 15", href: "http://free-iphone-claim.com" }],
    image: "/iphone.jpg",
    solution: "Phishing",
    explanation: "Be careful with messages offering free gifts, they're often phishing scams. Scammers usually add a time limit to make you feel rushed and more likely to click without thinking."
  },
  {
    id: 3,
    subject: "Unusual Activity Detected",
    senderName: "Santander",
    senderEmail: "s377@gmail.com",
    avatar: "./santander.png",
    date: "lun, 15 abr, 09:30 (hoy)",
    body: `Como parte de nuestras medidas de seguridad su cuenta ha sido temporalmente suspendida. 
    Durante nuestra última comprobación de seguridad, su cuenta fue marcada por nuestros sistemas. 
    De acuerdo con nuestras políticas de seguridad, hemos suspendido su cuenta. Siga el siguiente enlace para restaurar su acceso.`,
    image: "/santander2.png",
    links: [{ text: "Recuperar mi cuenta", href: "https://santander.com/login" }],
    solution: "Phishing",
    explanation: "The email address that sent the message is not even be from the bank. Even if the email was correct, in situations like this, it's best to contact your bank directly to clear up any issues. Banks usually don't send clickable links in emails."
  },
  {
    id: 4,
    subject: "The administrator has responded to your request for 'Project_X'",
    senderName: "SharePoint Online",
    senderEmail: "no-reply@sharepointonline.com",
    avatar: "/sharepoint.png",
    date: "vie, 12 abr, 17:45",
    body: `Good news: you now have access to "Project_X"\n`,
    links: [{ text: "Go to item", href: "https://organization_x.com/:w:/r/personal/user/_layouts/15/Doc.aspx?sourcedoc=%7B2DD11A3E-40AE-4F4C-8C32-FF4D76F22D86%7D&file=Project%20-%X%20.docx&action=default&mobileredirect=true" }],
    solution: "Safe",
    explanation: "It's a standard notification from SharePoint letting you know that you've been granted access to a document. Also, the document's name matches the URL in the link."
  },
  {  
    id: 5,
    subject: "Pedido: “Redmi Note 20 Midnight...”",
    senderName: "Amazon.es",
    senderEmail: "auto-confirm@amazon.es",
    avatar: "/amazon.jpg",
    date: "jue, 11 abr, 10:01",
    body: `Tu pedido está en camino, este es su estado actual:\n`,
    image: "/pedidoamz.png",
    solution: "Safe",
    explanation: "This is a standard order tracking message. The sender's email matches the one Amazon typically uses for these updates, and there are no suspicious links encouraging you to click. Note: The order details have been modified for illustrative purposes."
  },
  {
    id: 6,
    subject: "Access confirmation from a new device",
    senderName: "LinkedIn",
    senderEmail: "security@linkedin-access.com",
    avatar: "/linkedin.png",
    date: "lun, 15 abr, 06:21",
    body: `We've detected a login to your account from a new browser. Was it you?`,
    links: [{ text: "Review activity", href: "https://linkedin.com.access/security" }],
    solution: "Phishing",
    explanation: "Even though it might seem legitimate at first glance, the email address isn't valid, LinkedIn only uses linkedin.com. Also, the URL is suspicious because it includes extra text between '.com' and the '/', which means the actual domain is access, not linkedin.com."
  },
  {
    id: 7,
    subject: "50$ reward on Steam",
    senderName: "Steam promos",
    senderEmail: "promo@stean-official.com",
    avatar: "/steam.png",
    date: "lun, 15 abr, 11:11",
    body: `Participate in a user experience survey and receive a 50$ code for the Shop.`,
    links: [{ text: "Take the survey", href: "https://steanmicomnmunity.com/194567" }],
    solution: "Phishing",
    explanation: "Unrealistic promise and suspicious link and sender email."
  },
  {
    id: 8,
    subject: "Document shared: Quarterly_Report_2023.pdf",
    senderName: "Dropbox",
    senderEmail: "share@dropboxteam.com",
    avatar: "/dropbox.png",
    date: "mié, 10 abr, 13:30",
    body: `John Doe shared a file with you.`,
    links: [{ text: "View File", href: "https://dropbox.com/s/example" }],
    solution: "Safe",
    explanation: "Legitimate link, typical Dropbox message."
  },
  {
    id: 9,
    subject: "Factory reset requested",
    senderName: "Find my device",
    senderEmail: "noreply@google.com",
    avatar: "/google.jpg",
    date: "mar, 9 abr, 22:50",
    body: `A factory reset has been requested through Find My Device for your device.\n
    We will attempt to erase all data from this device. If it is not connected, we will erase it when it reconnects.\n
    If it wasn't you who made the request, change your password now to protect your Google account.`,
    links: [{ text: "Change your password", href: "https://support.google.com/accounts/answer/41078?hl=en&ref_topic=3382255" }],
    image: "/google2.png",
    solution: "Safe",
    explanation: "It is a normal factory reset request. The only risk is if you weren't the one that requested it, which implies a security breach of your account and you should inmediatly change your pasword to protect your account."
  },
  {
    id: 10,
    subject: "Password Reset Requested",
    senderName: "Apple Support",
    senderEmail: "support@apple-reset.com",
    avatar: "/apple.png",
    date: "Tue, 16 Apr, 08:30",
    body: `We received a request to reset your Apple ID password. If you did not make this request, click the link below to secure your account.`,
    links: [{ text: "Reset Password", href: "https://apple-reset.com/password" }],
    solution: "Phishing",
    explanation: "This is a phishing attempt disguised as an Apple password reset. Apple uses apple.com for all email communications. The domain here is suspicious and fake."
  },
  {
    id: 11,
    subject: "Congratulations! You've Won $1,000 Gift Card!",
    senderName: "Gift Card Giveaway",
    senderEmail: "promo@giftcard-giveaway.com",
    date: "Mon, 15 Apr, 09:45",
    body: `You've won a $1,000 gift card! Claim your prize before it expires in 24 hours.`,
    links: [{ text: "Claim Your Gift Card", href: "http://giftcard-claim.com" }],
    solution: "Phishing",
    explanation: "This email offers an unrealistic prize to encourage you to click the link. The domain is suspicious and unrelated to legitimate gift card services."
  },
  {
    id: 12,
    subject: "Security Alert: Suspicious Login Detected",
    senderName: "Facebook Security",
    senderEmail: "security@facebook.com",
    date: "Tue, 16 Apr, 07:15",
    body: `We detected an unusual login attempt from a new location. If this wasn't you, please follow the link below to secure your account.`,
    links: [{ text: "Secure My Account", href: "https://facebook.com/security" }],
    solution: "Safe",
    explanation: "A legitimate email from Facebook warning about suspicious login activity. Always verify that the email is from an official facebook.com address."
  },
  {
    id: 13,
    subject: "Your Netflix Subscription is on Hold",
    senderName: "Netflix Support",
    senderEmail: "support@netflix-subscription.com",
    date: "Mon, 15 Apr, 10:05",
    body: `We could not process your recent Netflix subscription payment. Please update your payment details to avoid disruption in service.`,
    links: [{ text: "Update Payment", href: "https://netflix-subscription.com/payment" }],
    solution: "Phishing",
    explanation: "This is a phishing attempt disguised as a payment issue. Netflix does not use domains like netflix-subscription.com; it uses netflix.com."
  },
  {
    id: 14,
    subject: "Amazon Order Confirmation - Urgent Action Required",
    senderName: "Amazon Customer Service",
    senderEmail: "support@amazon-orders.com",
    avatar: "/amazon.jpg",
    date: "Mon, 15 Apr, 11:20",
    body: `There's an issue with your recent Amazon order. Please verify your order details to avoid cancellation.`,
    links: [{ text: "Verify Order", href: "https://amazon-orders.com/verify" }],
    solution: "Phishing",
    explanation: "This email is trying to trick you into clicking a fraudulent link. The sender's email and domain are suspicious and not related to Amazon's official domain."
  },
  {
    id: 15,
    subject: "Bank Account Security Notification",
    senderName: "Chase Bank",
    senderEmail: "support@chase.com",
    date: "Mon, 15 Apr, 12:00",
    body: `We detected a login attempt from an unknown device. If you did not authorize this login, please secure your account immediately.`,
    links: [{ text: "Secure My Account", href: "https://chase.com/security" }],
    solution: "Safe",
    explanation: "A legitimate security alert from Chase Bank. Always double-check the URL to ensure it's an official website before entering sensitive information."
  },
  {
    id: 16,
    subject: "Unusual Activity Detected on Your PayPal Account",
    senderName: "PayPal Security",
    senderEmail: "security@paypal.com",
    date: "Mon, 15 Apr, 06:40",
    body: `We noticed unusual activity on your PayPal account. If you didn't initiate this, please review the activity and secure your account.`,
    links: [{ text: "Review Activity", href: "https://paypal.com/security" }],
    solution: "Safe",
    explanation: "A legitimate PayPal security email warning about unusual activity. Always verify the sender's email and ensure the link leads to paypal.com."
  },
  {
    id: 17,
    subject: "Important Account Verification Needed",
    senderName: "Bank of America",
    senderEmail: "security@bankofamerica.com",
    date: "Mon, 15 Apr, 13:00",
    body: `We need you to verify your identity to avoid account suspension. Please follow the link to complete the process.`,
    links: [{ text: "Verify Identity", href: "https://bankofamerica.com/verify" }],
    solution: "Phishing",
    explanation: "The email claims to need identity verification, but the link is not legitimate. Always go directly to the bank's website instead of clicking on links."
  },
  {
    id: 18,
    subject: "Your Amazon Account Has Been Suspended",
    senderName: "Amazon Support",
    senderEmail: "no-reply@amazon.com",
    avatar: "/amazon.jpg",
    date: "Mon, 15 Apr, 14:25",
    body: `We've detected suspicious activity on your Amazon account and have temporarily suspended it. Please verify your identity to restore access.`,
    links: [{ text: "Verify Identity", href: "https://amazonia.com/account-verify" }],
    solution: "Phishing",
    explanation: "Phishing attempt posing as Amazon. The link redirects to a fake Amazon page designed to steal your login credentials."
  },
  {
    id: 19,
    subject: "New Document Shared with You",
    senderName: "Google Docs",
    senderEmail: "noreply@googledocs.com",
    avatar: "/google.jpg",
    date: "Mon, 15 Apr, 15:00",
    body: `John Doe has shared a new document with you. Click the link below to view it.`,
    links: [{ text: "View Document", href: "https://googledocs.com/view" }],
    solution: "Phishing",
    explanation: "The sender's email and link are suspicious. Google Docs uses google.com for its communications, and this domain is not legitimate."
  },
  {
    id: 20,
    subject: "Account Verification Required",
    senderName: "Netflix",
    senderEmail: "service@netflix.com",
    date: "Sun, 14 Apr, 16:30",
    body: `Please verify your account to continue enjoying Netflix without interruptions. Click the link below to confirm your details.`,
    links: [{ text: "Verify Account", href: "https://netflix.com/verify" }],
    solution: "Safe",
    explanation: "This is a legitimate verification email from Netflix. Always ensure that the email is coming from the official netflix.com domain before clicking any link."
  }
 
];
