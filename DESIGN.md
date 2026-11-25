# Migo case study — design record

## Pass 1 — approved tokens and direction

The brief sets an editorial 72rem layout and a single visual idea: trace a payment from chat through checkout, processors and queues to the merchant callback. The UI uses Quicksand for display, Nunito Sans for copy and JetBrains Mono for technical labels. Brand blue (`#1155CC`) carries actions and readable text; the bright blue (`#0D73FE`) marks active state. Teal is reserved for diagrams and the route line. The logo gradient appears only on that route. Light is the default; dark mode remaps semantic surface and text tokens. Panels use 16–20px corners, with the quality section on an inverse navy surface.

Motion stays to a short staggered hero/reveal treatment and state transitions, with reduced motion honored. The transaction stepper uses buttons, keyboard activation and a text description; the SVG-like architecture layout has a complete list view. Responsive grids collapse at tablet and phone widths. Contrast targets AA; small text uses deep blue rather than the brighter brand blue.

## Pass 2 — critique against the brief

- The payment route is the memorable element, expressed as a receipt stamp, stepper and architecture nodes rather than a generic purple hero.
- The hierarchy avoids repeated cards: the hero has one receipt panel, decisions are rows, quality is an inverse field, and metrics are large numerals.
- On small screens the nav can scroll horizontally, while the content itself remains within the viewport. Stepper and diagram columns collapse without losing information.
- All controls have visible focus; language and theme controls remain in the header; diagrams include a list alternative.
- The snapshot dates remain visible in the hero and footer. Claims about test coverage explicitly note that thresholds were not configured.
- Potential follow-up after browser review: tune SVG diagram label density on narrow phones; the list toggle is the accessible text alternative.
