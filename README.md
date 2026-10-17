# AeroCrest Detailing website

Static site for AeroCrest Detailing, a pilot-owned mobile aircraft detailing business in Prescott, Arizona.

Plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser, or upload the whole folder to any static host.

## Files

- `index.html`, `services.html`, `about.html`, `request.html`: the four pages
- `styles.css`: all styles
- `main.js`: all scripts
- `images/`: logo, favicons and photos. See `images/README.md` to swap a photo and `images/CREDITS.md` for sources.

## Making the request form deliver to your inbox

Out of the box, the form opens the visitor's email app with the request filled in and addressed to aerocrestdetailing@gmail.com. Nothing is sent until they hit send.

To have requests delivered directly:

1. Create a free form at [Formspree](https://formspree.io) (or [Web3Forms](https://web3forms.com)) that sends to aerocrestdetailing@gmail.com.
2. Copy the form's endpoint URL.
3. In `main.js`, change the one line at the top:

   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/your-form-id";
   ```

That's the only change for Formspree. Web3Forms also needs your access key added to the form in `request.html` as a hidden field: `<input type="hidden" name="access_key" value="your-key">`. The form then posts in the background and shows a confirmation.

## Before launch

- Add the canonical URL and `og:url` tags once the domain is confirmed, and switch the `og:image` paths to full URLs.
- Items marked `TO CONFIRM` in the HTML need William's sign-off.
