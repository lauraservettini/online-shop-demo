# ONLINE SHOP DEMO

Questo progetto contiene il codice di sito e-commerce pensato per la vendita di  materiale informatico.

Il sito è stato costruito usando:
- HTML
- EJS template
- CSS
- Javascript
- Node.JS
- MVC Pattern
- NPM
- nodemon
- express
- express-session
- bcrypt
- MongoDB e connect-mongodb-session
- uuid
- cookie-parser
- csrf-sync
- json-circular-stringify
- multer
- stripe

___

## Descrizione

Nel sito sono implementate funzionalità come authenticazione e autorizzazione. E'  quindi possibile registrarsi come utente e caricare una foto del profilo. I propri dati verranno poi salvati nel database, verrà assegnato un id unico (uuid)  e la password verrà criptata con bcrypt prima di essere inviata al server MongoDB.
E' presente un carrello all'interno del quale verranno aggiunti gli articoli selezionati ed i cui dati sono salvati nella sessione. E' possibile eliminare o modificare le quantità dei singoli articoli direttamente dalla cart page.
E' necessario registrarsi per poter procedere agli eventuali acquisti. Il pagamento viene gestito tramite il third package di stripe.
Nel sito è implementato un livello di sicurezza di base tramite l'utilizzo della CSRFToken (csrf-sync, pacchetto csrf compatibile con l'utilizzo delle sessioni) ed "escape" contro i tentativi di code injection.

Nel caso in cui l'utente registrato disponga dell'autorizzazione di Admin potrà caricare/modificare/cancellare gli articoli direttamente da una Admin dashboard del sito.

Sono state inserite delle route protette sia per l'autentificazione sia per quanto riguarda l'autorizzazione.
___

# MIT LICENSE